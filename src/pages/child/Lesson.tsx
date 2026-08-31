import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Coins,
  Gamepad2,
  Lightbulb,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type LessonData = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  difficulty: string;
  points_reward: number;
  chapter_id: string | null;
};

type ChildData = {
  id: string;
  full_name: string;
};

type ExistingProgress = {
  id: string;
  progress: number;
  completed: boolean;
  xp_earned: number;
};

type QuestionOption = {
  id: string;
  option_text: string;
  option_order: number;
  is_correct: boolean;
};

type LessonQuestion = {
  id: string;
  question: string;
  explanation: string | null;
  question_order: number;
  points: number;
  options: QuestionOption[];
};

type RelatedGame = {
  id: string;
  title: string;
  description: string | null;
  game_type: string;
  difficulty: string | null;
  points_reward: number;
  config: Record<string, unknown>;
};

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [child, setChild] = useState<ChildData | null>(null);
  const [existingProgress, setExistingProgress] =
    useState<ExistingProgress | null>(null);

  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [relatedGame, setRelatedGame] =
    useState<RelatedGame | null>(null);

  /*
   * 1 = Aula
   * 2 = Quiz
   * 3 = Resultado
   * 4 = Jogo
   * 5 = Conclusão
   */
  const [step, setStep] = useState(1);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] =
    useState<string | null>(null);
  const [answerChecked, setAnswerChecked] =
    useState(false);

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizPoints, setQuizPoints] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const totalSteps = 5;

  const progress = (step / totalSteps) * 100;

  const currentQuestionData =
    questions[currentQuestion];

  useEffect(() => {
    loadLesson();
  }, [id]);

  async function loadLesson() {
    try {
      setLoading(true);

      if (!id) {
        navigate("/child/lessons");
        return;
      }

      /*
       * UTILIZADOR
       */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      /*
       * CRIANÇA
       */

      const {
        data: childData,
        error: childError,
      } = await supabase
        .from("children")
        .select("id, full_name")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (childError || !childData) {
        console.error(
          "Erro ao carregar criança:",
          childError
        );
        return;
      }

      setChild(childData);

      /*
       * AULA
       */

      const {
        data: lessonData,
        error: lessonError,
      } = await supabase
        .from("lessons")
        .select(
          `
          id,
          title,
          description,
          content,
          difficulty,
          points_reward,
          chapter_id
          `
        )
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();

      if (lessonError || !lessonData) {
        console.error(
          "Aula não encontrada:",
          lessonError
        );

        navigate("/child/lessons");
        return;
      }

      setLesson(lessonData);

      /*
       * PROGRESSO
       */

      const {
        data: progressData,
        error: progressError,
      } = await supabase
        .from("lesson_progress")
        .select(
          `
          id,
          progress,
          completed,
          xp_earned
          `
        )
        .eq("child_id", childData.id)
        .eq("lesson_id", lessonData.id)
        .maybeSingle();

      if (progressError) {
        console.error(
          "Erro ao carregar progresso:",
          progressError
        );
      }

      if (progressData) {
        setExistingProgress(progressData);
      }

      /*
       * PERGUNTAS
       */

      const {
        data: questionData,
        error: questionError,
      } = await supabase
        .from("lesson_questions")
        .select(
          `
          id,
          question,
          explanation,
          question_order,
          points,
          question_options (
            id,
            option_text,
            option_order,
            is_correct
          )
          `
        )
        .eq("lesson_id", lessonData.id)
        .eq("status", "active")
        .order("question_order", {
          ascending: true,
        });

      if (questionError) {
        console.error(
          "Erro ao carregar perguntas:",
          questionError
        );
      }

      const formattedQuestions: LessonQuestion[] =
        (questionData ?? []).map((question) => ({
          id: question.id,
          question: question.question,
          explanation: question.explanation,
          question_order: question.question_order,
          points: question.points,
          options:
            question.question_options
              ?.slice()
              .sort(
                (
                  a: QuestionOption,
                  b: QuestionOption
                ) =>
                  a.option_order -
                  b.option_order
              ) ?? [],
        }));

      setQuestions(formattedQuestions);

      /*
       * JOGO RELACIONADO
       */

      const {
        data: gameData,
        error: gameError,
      } = await supabase
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
        .eq("lesson_id", lessonData.id)
        .eq("is_published", true)
        .limit(1)
        .maybeSingle();

      if (gameError) {
        console.error(
          "Erro ao carregar jogo:",
          gameError
        );
      }

      if (gameData) {
        setRelatedGame(gameData);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar aula:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ESCOLHER RESPOSTA
   */

  function selectOption(optionId: string) {
    if (answerChecked) {
      return;
    }

    setSelectedOption(optionId);
  }

  /*
   * VERIFICAR RESPOSTA
   */

  function checkAnswer() {
    if (
      !selectedOption ||
      !currentQuestionData
    ) {
      return;
    }

    const selected =
      currentQuestionData.options.find(
        (option) =>
          option.id === selectedOption
      );

    if (!selected) {
      return;
    }

    setAnswerChecked(true);

    if (selected.is_correct) {
      setCorrectAnswers(
        (previous) => previous + 1
      );

      setQuizPoints(
        (previous) =>
          previous +
          currentQuestionData.points
      );
    }
  }

  /*
   * PRÓXIMA PERGUNTA
   */

  function nextQuestion() {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      setSelectedOption(null);
      setAnswerChecked(false);

      return;
    }

    setStep(3);
  }

  /*
   * COMEÇAR QUIZ
   */

  function startQuiz() {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswerChecked(false);
    setCorrectAnswers(0);
    setQuizPoints(0);

    if (questions.length > 0) {
      setStep(2);
    } else {
      setStep(3);
    }
  }

  /*
   * IR PARA O JOGO
   */

  function playGame() {
    if (!relatedGame) {
      setStep(5);
      return;
    }

    navigate(
      `/child/game/${relatedGame.id}`
    );
  }

  /*
   * GUARDAR PROGRESSO
   */

  async function saveProgress() {
    if (!child || !lesson) {
      return false;
    }

    try {
      setSaving(true);

      const now =
        new Date().toISOString();

      const earnedXp =
        lesson.points_reward;

      /*
       * LESSON PROGRESS
       */

      if (existingProgress) {
        const {
          data,
          error,
        } = await supabase
          .from("lesson_progress")
          .update({
            progress: 100,
            completed: true,
            xp_earned: earnedXp,
            completed_at: now,
            updated_at: now,
          })
          .eq(
            "id",
            existingProgress.id
          )
          .select(
            "id, progress, completed, xp_earned"
          )
          .single();

        if (error) {
          throw error;
        }

        setExistingProgress(data);
      } else {
        const {
          data,
          error,
        } = await supabase
          .from("lesson_progress")
          .insert({
            child_id: child.id,
            lesson_id: lesson.id,
            progress: 100,
            completed: true,
            xp_earned: earnedXp,
            started_at: now,
            completed_at: now,
          })
          .select(
            "id, progress, completed, xp_earned"
          )
          .single();

        if (error) {
          throw error;
        }

        setExistingProgress(data);
      }

      /*
       * LESSON COMPLETION
       */

      const {
        data: completion,
        error: completionCheckError,
      } = await supabase
        .from("lesson_completions")
        .select("id")
        .eq("child_id", child.id)
        .eq("lesson_id", lesson.id)
        .maybeSingle();

      if (completionCheckError) {
        throw completionCheckError;
      }

      if (!completion) {
        const {
          error: completionError,
        } = await supabase
          .from("lesson_completions")
          .insert({
            child_id: child.id,
            lesson_id: lesson.id,
            status: "completed",
            points_earned: earnedXp,
            completed_at: now,
          });

        if (completionError) {
          throw completionError;
        }
      }

      return true;
    } catch (error) {
      console.error(
        "Erro ao guardar progresso:",
        error
      );

      alert(
        "Não foi possível guardar o progresso. Tenta novamente."
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  /*
   * CONCLUIR AULA
   */

  async function finishLesson() {
    const success =
      await saveProgress();

    if (success) {
      navigate("/child/lessons");
    }
  }

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="lesson-screen">
        <div className="kids-loading">
          <BookOpen size={40} />

          <p>
            A carregar a aula...
          </p>
        </div>
      </div>
    );
  }

  /*
   * AULA NÃO ENCONTRADA
   */

  if (!lesson) {
    return (
      <div className="lesson-screen">
        <div className="kids-loading">
          <p>
            Aula não encontrada.
          </p>

          <button
            onClick={() =>
              navigate(
                "/child/lessons"
              )
            }
          >
            Voltar às aulas
          </button>
        </div>
      </div>
    );
  }

  /*
   * RENDER
   */

  return (
    <div className="lesson-screen">

      {/* ========================= */}
      {/* TOPBAR */}
      {/* ========================= */}

      <header className="lesson-topbar">

        <button
          className="lesson-back"
          onClick={() =>
            navigate(
              "/child/lessons"
            )
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="lesson-progress-wrapper">

          <div className="lesson-progress-info">

            <span>
              {step === 1
                ? "AULA"
                : step === 2
                ? "QUIZ"
                : step === 3
                ? "RESULTADO"
                : step === 4
                ? "JOGO"
                : "CONCLUÍDO"}
            </span>

            <strong>
              {step}/{totalSteps}
            </strong>

          </div>

          <div className="lesson-progress">

            <div
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="lesson-xp-badge">

          <Star
            size={17}
            fill="currentColor"
          />

          {lesson.points_reward} XP

        </div>

      </header>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main className="lesson-main">

        {/* ========================= */}
        {/* PASSO 1 — AULA */}
        {/* ========================= */}

        {step === 1 && (

          <section className="lesson-step">

            <div className="lesson-illustration money-illustration">

              <div className="money-circle">
                <Coins
                  size={72}
                  strokeWidth={1.7}
                />
              </div>

              <div className="floating-coin coin-one">
                <Coins size={26} />
              </div>

              <div className="floating-coin coin-two">
                <Coins size={22} />
              </div>

              <div className="floating-star">
                <Star
                  size={24}
                  fill="currentColor"
                />
              </div>

            </div>

            <span className="lesson-category">
              DESCOBRE
            </span>

            <h1>
              {lesson.title}
            </h1>

            {lesson.description && (
              <p className="lesson-intro-text">
                {lesson.description}
              </p>
            )}

            {lesson.content ? (
              <div className="lesson-content-box">
                <p>
                  {lesson.content}
                </p>
              </div>
            ) : (
              <div className="lesson-highlight">

                <div className="highlight-icon">
                  <Lightbulb size={27} />
                </div>

                <div>
                  <strong>
                    Sabias?
                  </strong>

                  <p>
                    Aprender sobre dinheiro
                    ajuda-te a fazer escolhas
                    melhores todos os dias.
                  </p>
                </div>

              </div>
            )}

          </section>

        )}

        {/* ========================= */}
        {/* PASSO 2 — QUIZ */}
        {/* ========================= */}

        {step === 2 && (

          <section className="lesson-step question-step">

            {questions.length === 0 ? (

              <div className="lesson-empty">

                <BookOpen size={42} />

                <h1>
                  Ainda não há perguntas.
                </h1>

                <p>
                  Esta aula ainda não tem
                  perguntas disponíveis.
                </p>

              </div>

            ) : (

              <>

                <div className="question-header">

                  <span className="lesson-category">
                    TESTA O QUE APRENDESTE
                  </span>

                  <div className="question-counter">
                    Pergunta{" "}
                    {currentQuestion + 1}
                    {" "}de{" "}
                    {questions.length}
                  </div>

                </div>

                <div className="question-card">

                  <div className="question-icon">
                    <Lightbulb size={30} />
                  </div>

                  <h1>
                    {
                      currentQuestionData?.question
                    }
                  </h1>

                </div>

                <div className="question-options">

                  {currentQuestionData?.options.map(
                    (option) => {

                      const selected =
                        selectedOption ===
                        option.id;

                      const correct =
                        option.is_correct;

                      let className =
                        "question-option";

                      if (selected) {
                        className +=
                          " selected";
                      }

                      if (
                        answerChecked &&
                        correct
                      ) {
                        className +=
                          " correct";
                      }

                      if (
                        answerChecked &&
                        selected &&
                        !correct
                      ) {
                        className +=
                          " wrong";
                      }

                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={
                            className
                          }
                          onClick={() =>
                            selectOption(
                              option.id
                            )
                          }
                          disabled={
                            answerChecked
                          }
                        >

                          <span className="option-letter">
                            {String.fromCharCode(
                              65 +
                                option.option_order -
                                1
                            )}
                          </span>

                          <span className="option-text">
                            {
                              option.option_text
                            }
                          </span>

                          {answerChecked &&
                            correct && (
                              <Check
                                size={22}
                                className="option-result"
                              />
                            )}

                          {answerChecked &&
                            selected &&
                            !correct && (
                              <X
                                size={22}
                                className="option-result"
                              />
                            )}

                        </button>
                      );
                    }
                  )}

                </div>

                {answerChecked && (
                  <div
                    className={`answer-feedback ${
                      currentQuestionData?.options.find(
                        (option) =>
                          option.id ===
                          selectedOption
                      )?.is_correct
                        ? "success"
                        : "error"
                    }`}
                  >

                    <strong>
                      {currentQuestionData?.options.find(
                        (option) =>
                          option.id ===
                          selectedOption
                      )?.is_correct
                        ? "Muito bem! 🎉"
                        : "Quase! 💪"}
                    </strong>

                    {currentQuestionData?.explanation && (
                      <p>
                        {
                          currentQuestionData.explanation
                        }
                      </p>
                    )}

                  </div>
                )}

              </>
            )}

          </section>

        )}

        {/* ========================= */}
        {/* PASSO 3 — RESULTADO */}
        {/* ========================= */}

        {step === 3 && (

          <section className="lesson-step completion-step">

            <div className="completion-icon">
              <Trophy size={65} />
            </div>

            <span className="lesson-category">
              QUIZ TERMINADO
            </span>

            <h1>
              {correctAnswers === questions.length
                ? "Perfeito! 🏆"
                : correctAnswers > 0
                ? "Muito bem! 🎉"
                : "Continua a aprender! 💪"}
            </h1>

            <p className="lesson-intro-text">
              Respondeste ao quiz desta aula.
              Vê como te saíste.
            </p>

            <div className="quiz-result-card">

              <div>
                <strong>
                  {correctAnswers}
                </strong>

                <span>
                  Certas
                </span>
              </div>

              <div>
                <strong>
                  {questions.length}
                </strong>

                <span>
                  Perguntas
                </span>
              </div>

              <div>
                <strong>
                  {quizPoints}
                </strong>

                <span>
                  Pontos
                </span>
              </div>

            </div>

            {relatedGame ? (
              <div className="game-preview-card">

                <div className="game-preview-icon">
                  <Gamepad2 size={34} />
                </div>

                <div>

                  <span>
                    DESAFIO EXTRA
                  </span>

                  <h2>
                    {relatedGame.title}
                  </h2>

                  {relatedGame.description && (
                    <p>
                      {relatedGame.description}
                    </p>
                  )}

                  <strong>
                    +{relatedGame.points_reward} XP
                  </strong>

                </div>

              </div>
            ) : (
              <div className="lesson-highlight">

                <div className="highlight-icon">
                  <Check size={27} />
                </div>

                <div>

                  <strong>
                    Aula dominada!
                  </strong>

                  <p>
                    Não há jogo extra nesta aula.
                  </p>

                </div>

              </div>
            )}

          </section>

        )}

        {/* ========================= */}
        {/* PASSO 4 — JOGO */}
        {/* ========================= */}

        {step === 4 && (

          <section className="lesson-step game-step">

            <div className="game-large-icon">
              <Gamepad2 size={70} />
            </div>

            <span className="lesson-category">
              DESAFIO DA AULA
            </span>

            <h1>
              {relatedGame?.title}
            </h1>

            {relatedGame?.description && (
              <p className="lesson-intro-text">
                {relatedGame.description}
              </p>
            )}

            <div className="game-info">

              <div>

                <Star
                  size={20}
                  fill="currentColor"
                />

                <span>
                  +{relatedGame?.points_reward} XP
                </span>

              </div>

              <div>

                <Gamepad2 size={20} />

                <span>
                  {relatedGame?.difficulty ??
                    "Iniciante"}
                </span>

              </div>

            </div>

            <div className="lesson-content-box">

              <strong>
                Aprende jogando 🎮
              </strong>

              <p>
                Este desafio foi criado para
                reforçar aquilo que aprendeste
                nesta aula.
              </p>

            </div>

          </section>

        )}

        {/* ========================= */}
        {/* PASSO 5 — CONCLUSÃO */}
        {/* ========================= */}

        {step === 5 && (

          <section className="lesson-step completion-step">

            <div className="completion-icon">
              <Trophy size={70} />
            </div>

            <span className="lesson-category">
              AULA CONCLUÍDA
            </span>

            <h1>
              Excelente trabalho! 🏆
            </h1>

            <p className="lesson-intro-text">
              Concluíste a aula, respondeste
              ao quiz e completaste a tua
              jornada de aprendizagem.
            </p>

            <div className="completion-xp">

              <Star
                size={30}
                fill="currentColor"
              />

              <strong>
                +{lesson.points_reward} XP
              </strong>

            </div>

            <div className="completion-summary">

              <div>
                <Check size={21} />

                <span>
                  Aula concluída
                </span>
              </div>

              {questions.length > 0 && (
                <div>
                  <Check size={21} />

                  <span>
                    Quiz respondido
                  </span>
                </div>
              )}

              {relatedGame && (
                <div>
                  <Check size={21} />

                  <span>
                    Desafio disponível
                  </span>
                </div>
              )}

            </div>

          </section>

        )}

      </main>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer className="lesson-footer">

        {/* AULA */}

        {step === 1 && (
          <button
            type="button"
            className="lesson-next-button"
            onClick={startQuiz}
          >
            {questions.length > 0
              ? "Fazer o quiz"
              : "Ver resultado"}

            <ChevronRight size={23} />
          </button>
        )}

        {/* QUIZ */}

        {step === 2 && (
          <button
            type="button"
            className="lesson-next-button"
            onClick={
              answerChecked
                ? nextQuestion
                : checkAnswer
            }
            disabled={
              !selectedOption
            }
          >
            {answerChecked ? (
              <>
                {currentQuestion <
                questions.length - 1
                  ? "Próxima pergunta"
                  : "Ver resultado"}

                <ChevronRight
                  size={23}
                />
              </>
            ) : (
              <>
                Confirmar resposta
                <Check size={23} />
              </>
            )}
          </button>
        )}

        {/* RESULTADO */}

        {step === 3 && (
          <button
            type="button"
            className="lesson-next-button"
            onClick={() =>
              relatedGame
                ? setStep(4)
                : setStep(5)
            }
          >
            {relatedGame
              ? "Ver desafio"
              : "Concluir aula"}

            {relatedGame ? (
              <Gamepad2 size={23} />
            ) : (
              <Check size={23} />
            )}
          </button>
        )}

        {/* JOGO */}

        {step === 4 && (
          <button
            type="button"
            className="lesson-next-button"
            onClick={playGame}
            disabled={!relatedGame}
          >
            Jogar agora
            <Gamepad2 size={23} />
          </button>
        )}

        {/* FINAL */}

        {step === 5 && (
          <button
            type="button"
            className="lesson-next-button"
            onClick={finishLesson}
            disabled={saving}
          >
            {saving ? (
              "A guardar..."
            ) : (
              <>
                <Check size={23} />
                Concluir aula
              </>
            )}
          </button>
        )}

        <div className="lesson-footer-info">

          <BookOpen size={16} />

          Aprende um pouco todos os dias.

        </div>

      </footer>

    </div>
  );
}