import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Coins,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type GameItem = {
  id: string;
  name: string;
  icon: string;
  correct: boolean;
};

type GameData = {
  id: string;
  title: string;
  description: string | null;
  game_type: string;
  difficulty: string | null;
  points_reward: number;
  config: {
    instructions: string;
    max_score: number;
    items: GameItem[];
  };
};

type ChildData = {
  id: string;
};

export default function Game() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [game, setGame] = useState<GameData | null>(null);
  const [child, setChild] = useState<ChildData | null>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  async function loadGame() {
    try {
      setLoading(true);

      if (!id) {
        navigate("/child/lessons");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: childData, error: childError } =
        await supabase
          .from("children")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

      if (childError || !childData) {
        console.error(childError);
        return;
      }

      setChild(childData);

      const { data: gameData, error: gameError } =
        await supabase
          .from("games")
          .select(
            `
            id,
            title,
            description,
            game_type,
            difficulty,
            points_reward,
            config
            `
          )
          .eq("id", id)
          .eq("is_published", true)
          .maybeSingle();

      if (gameError || !gameData) {
        console.error(gameError);
        navigate("/child/lessons");
        return;
      }

      setGame(gameData);
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleItem(item: GameItem) {
    if (finished) return;

    setSelected((previous) => {
      if (previous.includes(item.id)) {
        return previous.filter(
          (id) => id !== item.id
        );
      }

      return [...previous, item.id];
    });
  }

  async function finishGame() {
    if (!game || !child) return;

    setSaving(true);

    try {
      const correctItems = game.config.items.filter(
        (item) => item.correct
      );

      const correctSelected =
        selected.filter((selectedId) =>
          correctItems.some(
            (item) => item.id === selectedId
          )
        );

      const wrongSelected =
        selected.filter((selectedId) =>
          game.config.items.some(
            (item) =>
              item.id === selectedId &&
              !item.correct
          )
        );

      const correctCount = correctSelected.length;
      const totalCorrect = correctItems.length;

      let calculatedScore =
        (correctCount / totalCorrect) * 100;

      if (wrongSelected.length > 0) {
        calculatedScore -=
          wrongSelected.length * 25;
      }

      calculatedScore = Math.max(
        0,
        Math.round(calculatedScore)
      );

      const pointsEarned =
        calculatedScore === 100
          ? game.points_reward
          : Math.round(
              (calculatedScore / 100) *
                game.points_reward
            );

      setScore(calculatedScore);
      setFinished(true);

      const { data: existing } =
        await supabase
          .from("game_progress")
          .select(
            `
            id,
            best_score,
            points_earned,
            attempts,
            completed
            `
          )
          .eq("child_id", child.id)
          .eq("game_id", game.id)
          .maybeSingle();

      if (existing) {
        const bestScore = Math.max(
          existing.best_score,
          calculatedScore
        );

        const points =
          Math.max(
            existing.points_earned,
            pointsEarned
          );

        const { error } =
          await supabase
            .from("game_progress")
            .update({
              best_score: bestScore,
              points_earned: points,
              attempts:
                existing.attempts + 1,
              completed:
                bestScore === 100,
              last_played_at:
                new Date().toISOString(),
              completed_at:
                bestScore === 100
                  ? new Date().toISOString()
                  : null,
              updated_at:
                new Date().toISOString(),
            })
            .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } =
          await supabase
            .from("game_progress")
            .insert({
              child_id: child.id,
              game_id: game.id,
              best_score: calculatedScore,
              points_earned: pointsEarned,
              attempts: 1,
              completed:
                calculatedScore === 100,
              last_played_at:
                new Date().toISOString(),
              completed_at:
                calculatedScore === 100
                  ? new Date().toISOString()
                  : null,
            });

        if (error) throw error;
      }
    } catch (error) {
      console.error(
        "Erro ao guardar progresso do jogo:",
        error
      );

      alert(
        "Não foi possível guardar o resultado do jogo."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="game-screen">
        <div className="kids-loading">
          <Coins size={40} />
          <p>A carregar o jogo...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="game-screen">
      <header className="game-header">
        <button
          onClick={() =>
            navigate("/child/lessons")
          }
          className="game-back"
        >
          <ArrowLeft size={23} />
        </button>

        <div>
          <span>DESAFIO</span>
          <h1>{game.title}</h1>
        </div>

        <div className="game-xp">
          <Star
            size={17}
            fill="currentColor"
          />
          {game.points_reward} XP
        </div>
      </header>

      <main className="game-main">
        {!finished ? (
          <>
            <section className="game-intro">
              <div className="game-icon">
                <Coins size={48} />
              </div>

              <span>ESCOLHE</span>

              <h2>
                É dinheiro ou não é?
              </h2>

              <p>
                {game.config.instructions}
              </p>
            </section>

            <section className="game-items">
              {game.config.items.map(
                (item) => {
                  const isSelected =
                    selected.includes(
                      item.id
                    );

                  return (
                    <button
                      key={item.id}
                      className={`game-item ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleItem(item)
                      }
                    >
                      <div className="game-item-icon">
                        <Coins size={35} />
                      </div>

                      <strong>
                        {item.name}
                      </strong>

                      {isSelected && (
                        <Check size={22} />
                      )}
                    </button>
                  );
                }
              )}
            </section>

            <button
              className="game-finish-button"
              onClick={finishGame}
              disabled={
                saving ||
                selected.length === 0
              }
            >
              {saving
                ? "A guardar..."
                : "Ver resultado"}
            </button>
          </>
        ) : (
          <section className="game-result">
            <div className="result-icon">
              {score === 100 ? (
                <Trophy size={58} />
              ) : score >= 50 ? (
                <Star
                  size={58}
                  fill="currentColor"
                />
              ) : (
                <X size={58} />
              )}
            </div>

            <span>RESULTADO</span>

            <h2>
              {score === 100
                ? "Excelente! 🎉"
                : score >= 50
                ? "Muito bem! 👏"
                : "Vamos tentar novamente! 💪"}
            </h2>

            <div className="game-score">
              {score}%
            </div>

            <p>
              {score === 100
                ? `Ganhaste ${game.points_reward} XP!`
                : "Continua a aprender e tenta melhorar a tua pontuação."}
            </p>

            <button
              className="game-finish-button"
              onClick={() =>
                navigate(
                  `/child/lesson/${game.id}`
                )
              }
            >
              Voltar à formação
            </button>
          </section>
        )}
      </main>
    </div>
  );
}