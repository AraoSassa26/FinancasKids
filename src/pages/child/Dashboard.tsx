import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Coins,
  Gift,
  Goal,
  GraduationCap,
  Lightbulb,
  Play,
  Sparkles,
  Star,
  Trophy,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Child = {
  id: string;
  full_name: string;
  age_group_id: string;
  age_groups: {
    name: string;
    code: string;
  }[] | null;
};

type Chapter = {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: {
    id: string;
    title: string;
    description: string;
    points_reward: number;
  }[];
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [child, setChild] = useState<Child | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
  new Set()
);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      /*
       * 1. Buscar a criança autenticada
       */
      const { data: childData, error: childError } =
        await supabase
          .from("children")
          .select(`
            id,
            full_name,
            age_group_id,
            age_groups (
              name,
              code
            )
          `)
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

      if (childError) {
        throw childError;
      }

const { data: ageGroupData, error: ageGroupError } =
  await supabase
    .from("age_groups")
    .select("name, code")
    .eq("id", childData.age_group_id)
    .single();

if (ageGroupError) {
  throw ageGroupError;
}

const normalizedChild: Child = {
  id: childData.id,
  full_name: childData.full_name,
  age_group_id: childData.age_group_id,
  age_groups: ageGroupData
    ? [ageGroupData]
    : [],
};

setChild(normalizedChild);

setChild(normalizedChild);
      /*
       * 2. Buscar níveis da faixa etária
       */
      const { data: levelsData, error: levelsError } =
        await supabase
          .from("levels")
          .select("id")
          .eq("age_group_id", childData.age_group_id)
          .eq("status", "active")
          .order("level_order");

      if (levelsError) {
        throw levelsError;
      }

      const levelIds = (levelsData ?? []).map(
        (level) => level.id
      );

      if (levelIds.length === 0) {
        setChapters([]);
        return;
      }

      /*
       * 3. Buscar capítulos pertencentes
       * aos níveis da faixa etária
       */
      const { data: chaptersData, error: chaptersError } =
        await supabase
          .from("chapters")
          .select(`
            id,
            title,
            description,
            order_index
          `)
          .in("level_id", levelIds)
          .eq("is_active", true)
          .order("order_index");

      if (chaptersError) {
        throw chaptersError;
      }

      /*
       * 4. Buscar aulas publicadas desses capítulos
       */
      const chapterIds = (chaptersData ?? []).map(
        (chapter) => chapter.id
      );

      let lessonsData: {
        id: string;
        title: string;
        description: string;
        points_reward: number;
        chapter_id: string;
      }[] = [];

      if (chapterIds.length > 0) {
        const { data, error: lessonsError } =
          await supabase
            .from("lessons")
            .select(`
              id,
              title,
              description,
              points_reward,
              chapter_id
            `)
            .in("chapter_id", chapterIds)
            .eq("is_published", true)
            .order("created_at");

        if (lessonsError) {
          throw lessonsError;
        }

        lessonsData = data ?? [];
      }

      /*
       * 5. Associar aulas aos capítulos
       */
      const formattedChapters: Chapter[] =
        (chaptersData ?? []).map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          description: chapter.description,
          order_index: chapter.order_index,
          lessons: lessonsData
            .filter(
              (lesson) =>
                lesson.chapter_id === chapter.id
            )
            .map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              points_reward: lesson.points_reward,
            })),
        }));

      setChapters(formattedChapters);

      /*
       * 6. Buscar progresso das aulas
       */
      const { data: progressData, error: progressError } =
        await supabase
          .from("lesson_progress")
          .select(`
            lesson_id,
            completed,
            xp_earned
          `)
          .eq("child_id", childData.id);

      if (progressError) {
        throw progressError;
      }

      const completed =
  progressData?.filter(
    (item) => item.completed === true
  ) ?? [];

setCompletedLessonIds(
  new Set(completed.map((item) => item.lesson_id))
);

setCompletedLessons(completed.length);

const totalXp = completed.reduce(
  (total, item) =>
    total + (Number(item.xp_earned) || 0),
  0
);

setXp(totalXp);
    } catch (error) {
      console.error(
        "Erro ao carregar Dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Total de aulas disponíveis para esta criança
   */
  const totalLessons = chapters.reduce(
    (total, chapter) =>
      total + chapter.lessons.length,
    0
  );

  const progress =
    totalLessons > 0
      ? Math.min(
          Math.round(
            (completedLessons / totalLessons) * 100
          ),
          100
        )
      : 0;

 

  /*
   * Primeiro capítulo
   */
  const firstChapter = chapters[0];

  /*
   * Primeira aula disponível
   */
  const firstLesson = firstChapter?.lessons?.[0];

  if (loading) {
    return (
      <div className="kids-app">
        <main className="kids-content">
          <section className="kids-hero">
            <div className="hero-content">
              <div className="hero-greeting">
                <Sparkles size={18} />
                A carregar...
              </div>

              <h1>
                Vamos preparar
                <br />
                a tua jornada!
              </h1>

              <p>
                Estamos a buscar os teus dados.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="kids-app">

      {/* HEADER */}

      <header className="kids-header">
        <div className="brand">
          <div className="brand-icon">
            <Coins size={24} strokeWidth={2.5} />
          </div>

          <div>
            <strong>Finanças Kids</strong>
            <span>Aprender para crescer</span>
          </div>
        </div>

        <button
          className="profile-button"
          onClick={() =>
            navigate("/child/profile")
          }
          aria-label="Meu perfil"
        >
          <User size={22} />
        </button>
      </header>

      <main className="kids-content">

        {/* HERO */}

        <section className="kids-hero">
          <div className="hero-content">

            <div className="hero-greeting">
              <Sparkles size={18} />
              Olá, {child?.full_name ?? "Criança"}!
            </div>

            <h1>
              Vamos aprender
              <br />
              sobre dinheiro?
            </h1>

            <p>
              Aprende, joga e descobre como cuidar melhor
              do teu dinheiro.
            </p>

            <div className="age-badge">
              <GraduationCap size={18} />
              {child?.age_groups?.[0]?.name ?? "Faixa etária"}
            </div>

          </div>

          <div className="hero-illustration">

            <div className="hero-circle circle-one" />
            <div className="hero-circle circle-two" />

            <div className="hero-money">
              <Coins size={68} strokeWidth={1.5} />
            </div>

            <Star
              className="hero-star star-one"
              size={28}
            />

            <Star
              className="hero-star star-two"
              size={20}
            />

          </div>
        </section>

        {/* NÍVEL */}

        <section className="level-card">

          <div className="level-icon">
            <Trophy size={30} />
          </div>

          <div className="level-info">
            <span>TEU NÍVEL</span>
            <h2>Nível 1</h2>
            <p>Primeiros passos</p>
          </div>

          <div className="level-number">
            01
          </div>

        </section>

        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card stat-xp">

            <div className="stat-icon">
              <Zap size={23} />
            </div>

            <div>
              <strong>{xp}</strong>
              <span>XP ganho</span>
            </div>

          </div>

          <div className="stat-card stat-lessons">

            <div className="stat-icon">
              <BookOpen size={23} />
            </div>

            <div>
              <strong>
                {completedLessons}/{totalLessons}
              </strong>

              <span>Aulas</span>
            </div>

          </div>

          <div className="stat-card stat-progress">

            <div className="stat-icon">
              <Star size={23} />
            </div>

            <div>
              <strong>{progress}%</strong>
              <span>Progresso</span>
            </div>

          </div>

        </section>

        {/* CONTINUAR */}

        <section className="dashboard-block">

          <div className="block-title">

            <div>
              <span>APRENDIZAGEM</span>

              <h2>
                {completedLessons === 0
                  ? "Começa a aprender"
                  : "Continua de onde paraste"}
              </h2>
            </div>

          </div>

          {firstLesson ? (

            <div className="continue-card">

              <div className="lesson-image">
                <Coins size={42} />
              </div>

              <div className="continue-info">

                <small>
                  LIÇÃO FINANCEIRA
                </small>

                <h3>
                  {firstLesson.title}
                </h3>

                <p>
                  {firstLesson.description}
                </p>

                <div className="lesson-meta">

                  <span>
                    <Zap size={14} />
                    {firstLesson.points_reward} XP
                  </span>

                  <span>
                    <BookOpen size={14} />
                    Iniciante
                  </span>

                </div>

              </div>

              <button
                className="play-button"
                onClick={() =>
                  navigate(
                    `/child/lesson/${firstLesson.id}`
                  )
                }
                aria-label="Começar aula"
              >
                <Play
                  size={25}
                  fill="currentColor"
                />
              </button>

            </div>

          ) : (

            <div className="continue-card">
              <div className="continue-info">
                <h3>
                  Nenhuma aula disponível
                </h3>

                <p>
                  Em breve teremos novas aulas.
                </p>
              </div>
            </div>

          )}

        </section>

        {/* DESAFIO */}

        <section className="challenge-card">

          <div className="challenge-icon">
            <Lightbulb size={34} />
          </div>

          <div className="challenge-content">

            <span>DESAFIO DO DIA</span>

            <h2>
              Faz uma boa escolha!
            </h2>

            <p>
              Pensa antes de gastar. Precisas mesmo
              dessa coisa?
            </p>

            <button
              onClick={() =>
                navigate("/child/challenges")
              }
              className="big-action-button"
            >
              Começar desafio
              <ChevronRight size={20} />
            </button>

          </div>

        </section>

        {/* CAPÍTULOS */}

        <section className="dashboard-block">

          <div className="block-title">

            <div>
              <span>FORMAÇÃO</span>
              <h2>Os teus capítulos</h2>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate("/child/lessons")
              }
            >
              Ver aulas
              <ChevronRight size={18} />
            </button>

          </div>

          <div className="chapters-list">

            {chapters.map((chapter, index) => {

              const colors = [
                "yellow",
                "blue",
                "green",
              ];

              const icons = [
                Coins,
                Wallet,
                Goal,
              ];

              const Icon =
                icons[index] ?? Coins;

              const color =
                colors[index] ?? "yellow";

              const chapterLessonIds =
                chapter.lessons.map(
                  (lesson) => lesson.id
                );

             const chapterCompleted =
  chapterLessonIds.filter((lessonId) =>
    completedLessonIds.has(lessonId)
  ).length;

const chapterProgress =
  chapterLessonIds.length > 0
    ? Math.round(
        (chapterCompleted /
          chapterLessonIds.length) *
          100
      )
    : 0;

              return (

                <button
                  key={chapter.id}
                  className="chapter-card"
                  onClick={() =>
                    navigate("/child/lessons")
                  }
                >

                  <div
                    className={`chapter-icon ${color}`}
                  >
                    <Icon size={29} />
                  </div>

                  <div className="chapter-content">

                    <div className="chapter-top">

                      <span>
                        CAPÍTULO {index + 1}
                      </span>

                      <ChevronRight size={20} />

                    </div>

                    <h3>
                      {chapter.title}
                    </h3>

                    <p>
                      {chapter.description}
                    </p>

                    <div className="chapter-bottom">

                      <span>
                        {chapter.lessons.length} aulas
                      </span>

                      <div className="mini-progress">
                        <div
                          style={{
                            width: `${chapterProgress}%`,
                          }}
                        />
                      </div>

                      <strong>
                        {chapterProgress}%
                      </strong>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        </section>

        {/* RECOMPENSAS */}

        <section className="reward-card">

          <div className="reward-decoration">
            <Gift size={38} />
          </div>

          <div>

            <span>CONQUISTAS</span>

            <h2>
              As tuas recompensas
            </h2>

            <p>
              Completa aulas para desbloquear
              prémios.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/child/rewards")
            }
            className="icon-action"
            aria-label="Ver recompensas"
          >
            <ChevronRight size={22} />
          </button>

        </section>

        {/* DICA */}

        <section className="tip-card">

          <div className="tip-icon">
            <Wallet size={26} />
          </div>

          <div>

            <span>DICA FINANCEIRA</span>

            <h2>
              Guardar dinheiro é cuidar do futuro.
            </h2>

            <p>
              Pequenas poupanças também fazem
              diferença.
            </p>

          </div>

        </section>

        {/* MOTIVAÇÃO */}

        <section className="motivation-card">

          <div className="motivation-stars">

            <Star
              size={22}
              fill="currentColor"
            />

            <Star
              size={15}
              fill="currentColor"
            />

            <Star
              size={18}
              fill="currentColor"
            />

          </div>

          <h2>
            Pequenos passos.
          </h2>

          <h3>
            Grandes conquistas!
          </h3>

          <p>
            Cada aula deixa-te mais preparado
            para cuidar do teu dinheiro.
          </p>

        </section>

      </main>

      {/* BOTTOM NAV */}

      <nav className="kids-bottom-nav">

        <button
          className="nav-item active"
          onClick={() =>
            navigate("/child/dashboard")
          }
        >
          <BookOpen size={23} />
          <span>Início</span>
        </button>

        <button
          className="nav-item"
          onClick={() =>
            navigate("/child/lessons")
          }
        >
          <GraduationCap size={23} />
          <span>Aprender</span>
        </button>

        <button
          className="nav-item"
          onClick={() =>
            navigate("/child/rewards")
          }
        >
          <Trophy size={23} />
          <span>Prémios</span>
        </button>

        <button
          className="nav-item"
          onClick={() =>
            navigate("/child/profile")
          }
        >
          <User size={23} />
          <span>Perfil</span>
        </button>

      </nav>

    </div>
  );
}