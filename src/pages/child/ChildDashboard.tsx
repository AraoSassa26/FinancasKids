import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleDollarSign,
  Home,
  Target,
  Trophy,
  User,
} from "lucide-react";

import "./ChildDashboard.css";

const lessons = [
  {
    title: "O que é o dinheiro?",
    description:
      "Descobre o que é o dinheiro e para que podemos usá-lo.",
    xp: 10,
    completed: false,
  },
  {
    title: "Para que usamos o dinheiro?",
    description:
      "Aprende como o dinheiro pode ajudar nas nossas escolhas.",
    xp: 10,
    completed: false,
  },
  {
    title: "Gastar e guardar",
    description:
      "Aprende a diferença entre gastar e guardar dinheiro.",
    xp: 15,
    completed: false,
  },
];

const activities = [
  {
    title: "Minhas aulas",
    description: "Continua a tua formação financeira.",
    icon: BookOpen,
    className: "purple",
  },
  {
    title: "Conquistas",
    description: "Vê tudo o que já desbloqueaste.",
    icon: Trophy,
    className: "yellow",
  },
  {
    title: "Meus objetivos",
    description: "Define objetivos para aprender a poupar.",
    icon: Target,
    className: "green",
  },
];

export default function ChildDashboard() {
  return (
    <div className="child-dashboard">
      <header className="child-header">
        <div className="child-brand">
          <div className="child-brand-icon">
            <CircleDollarSign size={22} />
          </div>

          <div>
            <strong>Finanças Kids</strong>
            <span>Aprender para crescer</span>
          </div>
        </div>

        <button
          className="child-profile-button"
          type="button"
          aria-label="Abrir perfil"
        >
          <User size={20} />
        </button>
      </header>

      <main className="child-content">
        <section className="child-welcome">
          <div className="child-welcome-content">
            <span className="child-eyebrow">
              Olá, Criança
            </span>

            <h1>
              Vamos aprender
              <br />
              sobre dinheiro?
            </h1>

            <span className="age-badge">
              6 a 9 anos
            </span>
          </div>

          <div className="welcome-icon">
            <CircleDollarSign size={58} />
          </div>
        </section>

        <section className="level-section">
          <div className="section-heading">
            <div>
              <span>FORMAÇÃO</span>
              <h2>Nível atual</h2>
            </div>

            <button type="button">
              Ver nível
              <ChevronRight size={17} />
            </button>
          </div>

          <article className="level-card">
            <div className="level-number">
              1
            </div>

            <div className="level-info">
              <span>NÍVEL 1</span>

              <h3>
                Primeiros passos
              </h3>

              <p>
                Aprende os conceitos básicos
                sobre dinheiro.
              </p>

              <div className="level-progress">
                <div className="level-progress-top">
                  <span>Progresso</span>
                  <strong>0%</strong>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" />
                </div>
              </div>
            </div>

            <ArrowRight className="level-arrow" size={22} />
          </article>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon purple">
              <Trophy size={20} />
            </div>

            <span>XP conquistado</span>
            <strong>0</strong>
          </article>

          <article className="stat-card">
            <div className="stat-icon blue">
              <BookOpen size={20} />
            </div>

            <span>Aulas concluídas</span>
            <strong>0/5</strong>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">
              <Target size={20} />
            </div>

            <span>Progresso</span>
            <strong>0%</strong>
          </article>
        </section>

        <section className="learning-section">
          <div className="section-heading">
            <div>
              <span>APRENDIZAGEM</span>
              <h2>Continua de onde paraste</h2>
            </div>
          </div>

          <article className="lesson-card">
            <div className="lesson-icon">
              <BookOpen size={25} />
            </div>

            <div className="lesson-info">
              <span>LIÇÃO FINANCEIRA</span>

              <h3>
                {lessons[0].title}
              </h3>

              <p>
                {lessons[0].description}
              </p>

              <strong>
                +{lessons[0].xp} XP
              </strong>
            </div>

            <button
              type="button"
              className="lesson-button"
            >
              Começar
              <ArrowRight size={17} />
            </button>
          </article>
        </section>

        <section className="challenge-section">
          <div className="challenge-card">
            <div className="challenge-icon">
              <Target size={28} />
            </div>

            <div>
              <span>DESAFIO DIÁRIO</span>

              <h2>
                Faz uma boa escolha financeira
              </h2>

              <p>
                Pensa numa coisa que precisas
                mesmo antes de gastar dinheiro.
              </p>
            </div>

            <button type="button">
              Começar desafio
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <section className="chapters-section">
          <div className="section-heading">
            <div>
              <span>FORMAÇÃO</span>
              <h2>Os teus capítulos</h2>
            </div>

            <button type="button">
              Ver aulas
              <ChevronRight size={17} />
            </button>
          </div>

          <article className="chapter-card">
            <div className="chapter-number">
              1
            </div>

            <div className="chapter-info">
              <span>CAPÍTULO 1</span>

              <h3>
                O que é o dinheiro?
              </h3>

              <p>
                Descobre o que é o dinheiro,
                para que serve e como podemos
                fazer boas escolhas.
              </p>

              <div className="chapter-bottom">
                <span>5 aulas</span>
                <strong>0%</strong>
              </div>
            </div>

            <button
              className="chapter-button"
              type="button"
            >
              <ArrowRight size={18} />
            </button>
          </article>
        </section>

        <section className="activities-section">
          <div className="section-heading">
            <div>
              <span>EXPLORAR</span>
              <h2>Mais atividades</h2>
            </div>
          </div>

          <div className="activities-grid">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <button
                  key={activity.title}
                  type="button"
                  className="activity-card"
                >
                  <div
                    className={`activity-icon ${activity.className}`}
                  >
                    <Icon size={22} />
                  </div>

                  <strong>
                    {activity.title}
                  </strong>

                  <span>
                    {activity.description}
                  </span>

                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="motivation-card">
          <div>
            <span>FINANÇAS KIDS</span>

            <h2>
              Pequenos passos,
              <br />
              grandes conquistas.
            </h2>

            <p>
              Cada aula ajuda-te a tomar
              decisões melhores com o teu dinheiro.
            </p>
          </div>

          <CircleDollarSign size={52} />
        </section>
      </main>

      <nav className="child-bottom-nav">
        <button
          className="active"
          type="button"
        >
          <Home size={20} />
          <span>Início</span>
        </button>

        <button type="button">
          <BookOpen size={20} />
          <span>Aprender</span>
        </button>

        <button type="button">
          <Trophy size={20} />
          <span>Conquistas</span>
        </button>

        <button type="button">
          <User size={20} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}