import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  GraduationCap,
  Star,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type LevelData = {
  id: string;
  name: string;
  description: string | null;
  level_order: number;
};

type ChapterData = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  level_id: string;
};

type LessonData = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  points_reward: number;
  chapter_id: string | null;
};

type ProgressData = {
  lesson_id: string;
  progress: number;
  completed: boolean;
  xp_earned: number;
};

export default function Lessons() {
  const navigate = useNavigate();

  const [levels, setLevels] =
    useState<LevelData[]>([]);

  const [chapters, setChapters] =
    useState<ChapterData[]>([]);

  const [lessons, setLessons] =
    useState<LessonData[]>([]);

  const [progressData, setProgressData] =
    useState<ProgressData[]>([]);

  const [ageGroupName, setAgeGroupName] =
    useState("Faixa etária");

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    try {
      setLoading(true);
      setErrorMessage("");

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
        .select("id, age_group_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (childError || !childData) {
        console.error(
          "Erro ao carregar criança:",
          childError
        );

        setErrorMessage(
          "Não foi possível encontrar o perfil da criança."
        );

        return;
      }

      /*
       * FAIXA ETÁRIA
       */

      const {
        data: ageGroupData,
        error: ageGroupError,
      } = await supabase
        .from("age_groups")
        .select("id, name, code")
        .eq("id", childData.age_group_id)
        .eq("is_active", true)
        .single();

      if (ageGroupError) {
        console.error(
          "Erro ao carregar faixa etária:",
          ageGroupError
        );
      }

      if (ageGroupData) {
        setAgeGroupName(ageGroupData.name);
      }

      /*
       * NÍVEIS
       */

      const {
        data: levelData,
        error: levelError,
      } = await supabase
        .from("levels")
        .select(
          "id, name, description, level_order"
        )
        .eq(
          "age_group_id",
          childData.age_group_id
        )
        .eq("status", "active")
        .order("level_order", {
          ascending: true,
        });

      if (levelError) {
        console.error(
          "Erro ao carregar níveis:",
          levelError
        );

        setErrorMessage(
          "Não foi possível carregar os níveis."
        );

        return;
      }

      const loadedLevels =
        levelData ?? [];

      setLevels(loadedLevels);

      if (loadedLevels.length === 0) {
        setChapters([]);
        setLessons([]);
        setProgressData([]);
        return;
      }

      /*
       * CAPÍTULOS
       */

      const levelIds =
        loadedLevels.map(
          (level) => level.id
        );

      const {
        data: chapterData,
        error: chapterError,
      } = await supabase
        .from("chapters")
        .select(
          "id, title, description, order_index, level_id"
        )
        .in("level_id", levelIds)
        .eq("is_active", true)
        .order("order_index", {
          ascending: true,
        });

      if (chapterError) {
        console.error(
          "Erro ao carregar capítulos:",
          chapterError
        );

        setErrorMessage(
          "Não foi possível carregar os capítulos."
        );

        return;
      }

      const loadedChapters =
        chapterData ?? [];

      setChapters(loadedChapters);

      if (loadedChapters.length === 0) {
        setLessons([]);
        setProgressData([]);
        return;
      }

      /*
       * AULAS
       */

      const chapterIds =
        loadedChapters.map(
          (chapter) => chapter.id
        );

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
          difficulty,
          points_reward,
          chapter_id
          `
        )
        .in("chapter_id", chapterIds)
        .eq("is_published", true);

      if (lessonError) {
        console.error(
          "Erro ao carregar aulas:",
          lessonError
        );

        setErrorMessage(
          "Não foi possível carregar as aulas."
        );

        return;
      }

      const loadedLessons =
        lessonData ?? [];

      setLessons(loadedLessons);

      /*
       * PROGRESSO
       */

      const {
        data: lessonProgress,
        error: progressError,
      } = await supabase
        .from("lesson_progress")
        .select(
          `
          lesson_id,
          progress,
          completed,
          xp_earned
          `
        )
        .eq(
          "child_id",
          childData.id
        );

      if (progressError) {
        console.error(
          "Erro ao carregar progresso:",
          progressError
        );

        setProgressData([]);
      } else {
        setProgressData(
          lessonProgress ?? []
        );
      }
    } catch (error) {
      console.error(
        "Erro ao carregar formação:",
        error
      );

      setErrorMessage(
        "Ocorreu um erro ao carregar a formação."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * PROGRESSO DE UMA AULA
   */

  function getLessonProgress(
    lessonId: string
  ) {
    return progressData.find(
      (item) =>
        item.lesson_id === lessonId
    );
  }

  /*
   * AULAS CONCLUÍDAS
   */

  const completedLessonIds =
    new Set(
      progressData
        .filter(
          (item) => item.completed
        )
        .map(
          (item) => item.lesson_id
        )
    );

  /*
   * ESTATÍSTICAS
   */

  const totalLessons =
    lessons.length;

  const completedLessons =
    completedLessonIds.size;

  const totalXp =
    progressData.reduce(
      (total, item) =>
        total +
        (item.completed
          ? item.xp_earned
          : 0),
      0
    );

  const overallProgress =
    totalLessons > 0
      ? Math.round(
          (completedLessons /
            totalLessons) *
            100
        )
      : 0;

  /*
   * CAPÍTULOS ORDENADOS
   */

  const sortedChapters =
    [...chapters].sort(
      (a, b) =>
        a.order_index -
        b.order_index
    );

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="lessons-screen">
        <div className="kids-loading">
          <BookOpen size={40} />

          <p>
            A carregar a tua formação...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-screen">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <header className="lessons-header">

        <button
          className="lessons-back"
          onClick={() =>
            navigate(
              "/child/dashboard"
            )
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={23} />
        </button>

        <div className="lessons-header-title">

          <span>
            FORMAÇÃO
          </span>

          <h1>
            Aprender
          </h1>

        </div>

        <button
          className="lessons-profile"
          onClick={() =>
            navigate(
              "/child/profile"
            )
          }
          aria-label="Perfil"
        >
          <User size={22} />
        </button>

      </header>

      {/* ============================= */}
      {/* CONTEÚDO */}
      {/* ============================= */}

      <main className="lessons-content">

        {/* HERO */}

        <section className="lessons-hero">

          <div className="lessons-hero-icon">
            <GraduationCap
              size={34}
            />
          </div>

          <div>

            <span>
              A TUA JORNADA
            </span>

            <h2>
              Aprende e evolui
            </h2>

            <p>
              Aprende sobre dinheiro
              através de pequenas aulas
              e desafios.
            </p>

          </div>

        </section>

        {/* PROGRESSO */}

        <section className="lessons-progress-card">

          <div className="progress-header">

            <div className="progress-main">

              <span>
                O TEU PROGRESSO
              </span>

              <strong>
                {overallProgress}%
              </strong>

            </div>

            <div className="progress-xp">

              <Zap size={18} />

              <strong>
                {totalXp} XP
              </strong>

              <small>
                ganho
              </small>

            </div>

          </div>

          <div className="progress-bar">

            <div
              style={{
                width:
                  `${overallProgress}%`,
              }}
            />

          </div>

          <p>
            {completedLessons} de{" "}
            {totalLessons} aulas
            concluídas.
          </p>

        </section>

        {/* FAIXA ETÁRIA */}

        <div className="lessons-age-badge">

          <GraduationCap
            size={18}
          />

          <span>
            {ageGroupName}
          </span>

        </div>

        {/* ERRO */}

        {errorMessage && (
          <section className="lessons-error">

            <p>
              {errorMessage}
            </p>

            <button
              onClick={
                loadLessons
              }
            >
              Tentar novamente
            </button>

          </section>
        )}

        {/* SEM FORMAÇÃO */}

        {!errorMessage &&
          levels.length === 0 && (
            <section className="lessons-empty">

              <BookOpen
                size={42}
              />

              <h2>
                Ainda não há formação
              </h2>

              <p>
                O conteúdo para a tua
                faixa etária ainda
                está a ser preparado.
              </p>

            </section>
          )}

        {/* ============================= */}
        {/* CAPÍTULOS */}
        {/* ============================= */}

        {sortedChapters.length > 0 && (
          <section className="lessons-section">

            <div className="section-heading">

              <div>

                <span>
                  CAPÍTULOS
                </span>

                <h2>
                  Continua a aprender
                </h2>

              </div>

            </div>

            <div className="lessons-chapters">

              {sortedChapters.map(
                (
                  chapter,
                  chapterIndex
                ) => {

                  /*
                   * AULAS DO CAPÍTULO
                   */

                  const chapterLessons =
                    lessons
                      .filter(
                        (lesson) =>
                          lesson.chapter_id ===
                          chapter.id
                      )
                      .sort(
                        (a, b) =>
                          a.title.localeCompare(
                            b.title
                          )
                      );

                  /*
                   * PROGRESSO DO CAPÍTULO
                   */

                  const completedInChapter =
                    chapterLessons.filter(
                      (lesson) =>
                        completedLessonIds.has(
                          lesson.id
                        )
                    ).length;

                  const chapterTotal =
                    chapterLessons.length;

                  const chapterProgress =
                    chapterTotal > 0
                      ? Math.round(
                          (completedInChapter /
                            chapterTotal) *
                            100
                        )
                      : 0;

                  return (
                    <article
                      key={chapter.id}
                      className="lesson-chapter"
                    >

                      {/* HEADER DO CAPÍTULO */}

                      <div className="chapter-header">

                        <div className="chapter-number">

                          {chapterIndex + 1}

                        </div>

                        <div className="chapter-header-info">

                          <span>
                            CAPÍTULO{" "}
                            {chapterIndex + 1}
                          </span>

                          <h2>
                            {chapter.title}
                          </h2>

                          {chapter.description && (
                            <p>
                              {
                                chapter.description
                              }
                            </p>
                          )}

                        </div>

                      </div>

                      {/* PROGRESSO DO CAPÍTULO */}

                      <div className="chapter-progress-info">

                        <span>
                          {completedInChapter}/
                          {chapterTotal} aulas
                        </span>

                        <strong>
                          {chapterProgress}%
                        </strong>

                      </div>

                      <div className="chapter-progress">

                        <div
                          style={{
                            width:
                              `${chapterProgress}%`,
                          }}
                        />

                      </div>

                      {/* AULAS */}

                      <div className="chapter-lessons">

                        {chapterLessons.length ===
                        0 ? (
                          <div className="no-lessons">

                            <BookOpen
                              size={24}
                            />

                            <p>
                              Ainda não existem
                              aulas neste capítulo.
                            </p>

                          </div>
                        ) : (
                          chapterLessons.map(
                            (lesson) => {

                              const lessonProgress =
                                getLessonProgress(
                                  lesson.id
                                );

                              const completed =
                                lessonProgress?.completed ??
                                false;

                              return (
                                <button
                                  key={
                                    lesson.id
                                  }
                                  className={`lesson-item ${
                                    completed
                                      ? "completed"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    navigate(
                                      `/child/lesson/${lesson.id}`
                                    )
                                  }
                                >

                                  {/* ÍCONE */}

                                  <div className="lesson-item-icon">

                                    {completed ? (
                                      <Check
                                        size={21}
                                      />
                                    ) : (
                                      <BookOpen
                                        size={21}
                                      />
                                    )}

                                  </div>

                                  {/* CONTEÚDO */}

                                  <div className="lesson-item-content">

                                    <div className="lesson-item-top">

                                      <span>
                                        LIÇÃO
                                      </span>

                                      {completed && (
                                        <small>
                                          <Check
                                            size={13}
                                          />

                                          Concluída
                                        </small>
                                      )}

                                    </div>

                                    <h3>
                                      {
                                        lesson.title
                                      }
                                    </h3>

                                    {lesson.description && (
                                      <p>
                                        {
                                          lesson.description
                                        }
                                      </p>
                                    )}

                                    <div className="lesson-item-meta">

                                      <span>
                                        <Star
                                          size={14}
                                          fill="currentColor"
                                        />

                                        {
                                          lesson.points_reward
                                        }{" "}
                                        XP
                                      </span>

                                      <span>
                                        {
                                          lesson.difficulty ||
                                          "Iniciante"
                                        }
                                      </span>

                                      {lessonProgress &&
                                        !completed &&
                                        lessonProgress.progress >
                                          0 && (
                                          <span>
                                            {
                                              lessonProgress.progress
                                            }%
                                          </span>
                                        )}

                                    </div>

                                  </div>

                                  {/* SETA */}

                                  <ChevronRight
                                    size={21}
                                    className="lesson-item-arrow"
                                  />

                                </button>
                              );
                            }
                          )
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* ============================= */}
        {/* MOTIVAÇÃO */}
        {/* ============================= */}

        <section className="lessons-motivation">

          <div className="motivation-icon">

            <Trophy size={30} />

          </div>

          <div>

            <span>
              CONTINUA ASSIM!
            </span>

            <h2>
              Cada aula conta.
            </h2>

            <p>
              Aprende um pouco todos
              os dias e fica cada vez
              melhor a cuidar do teu
              dinheiro.
            </p>

          </div>

        </section>

      </main>

      {/* ============================= */}
      {/* NAVBAR INFERIOR */}
      {/* ============================= */}

      <nav className="kids-bottom-nav">

        <button
          className="nav-item"
          onClick={() =>
            navigate(
              "/child/dashboard"
            )
          }
        >
          <BookOpen size={23} />

          <span>
            Início
          </span>
        </button>

        <button
          className="nav-item active"
          onClick={() =>
            navigate(
              "/child/lessons"
            )
          }
        >
          <GraduationCap
            size={23}
          />

          <span>
            Aprender
          </span>
        </button>

        <button
          className="nav-item"
          onClick={() =>
            navigate(
              "/child/rewards"
            )
          }
        >
          <Trophy size={23} />

          <span>
            Prémios
          </span>
        </button>

        <button
          className="nav-item"
          onClick={() =>
            navigate(
              "/child/profile"
            )
          }
        >
          <User size={23} />

          <span>
            Perfil
          </span>
        </button>

      </nav>

    </div>
  );
}