import {
  ArrowRight,
  BookOpen,
  CircleDollarSign,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <div className="brand">
          <div className="brand-icon">
            <CircleDollarSign size={23} strokeWidth={2.4} />
          </div>

          <div>
            <strong>Finanças Kids</strong>
            <span>Aprender para crescer</span>
          </div>
        </div>

        <button className="header-button" type="button">
          Entrar
        </button>
      </header>

      <main className="home-content">
        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">
              <Sparkles size={15} />
              APRENDER PODE SER DIVERTIDO
            </span>

            <h1>
              Aprende sobre dinheiro
              <span> de forma simples.</span>
            </h1>

            <p>
              Descobre como usar, guardar e cuidar
              do dinheiro através de aulas, desafios
              e atividades pensadas para crianças.
            </p>

            <div className="hero-actions">
              <button className="primary-button" type="button">
                Começar a aprender
                <ArrowRight size={18} />
              </button>

              <button className="secondary-button" type="button">
                Saber mais
              </button>
            </div>
          </div>

          <div className="hero-illustration">
            <div className="coin coin-one">
              <CircleDollarSign size={25} />
            </div>

            <div className="coin coin-two">
              <Target size={23} />
            </div>

            <div className="coin coin-three">
              <Trophy size={23} />
            </div>

            <div className="hero-card">
              <span>O teu progresso</span>

              <strong>0%</strong>

              <div className="progress-track">
                <div className="progress-value" />
              </div>

              <small>
                Começa a tua jornada
              </small>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-title">
            <span>COMO FUNCIONA</span>

            <h2>
              Aprende. Pratica. Cresce.
            </h2>

            <p>
              Pequenos passos podem criar grandes
              hábitos financeiros.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card purple">
              <div className="feature-icon">
                <BookOpen size={25} />
              </div>

              <h3>Aulas simples</h3>

              <p>
                Aprende conceitos financeiros através
                de conteúdos pensados para crianças.
              </p>
            </article>

            <article className="feature-card green">
              <div className="feature-icon">
                <Target size={25} />
              </div>

              <h3>Desafios</h3>

              <p>
                Pratica o que aprendeste através de
                pequenas decisões do dia a dia.
              </p>
            </article>

            <article className="feature-card yellow">
              <div className="feature-icon">
                <Trophy size={25} />
              </div>

              <h3>Conquistas</h3>

              <p>
                Ganha XP, desbloqueia conquistas e
                acompanha a tua evolução.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <strong>Finanças Kids</strong>

        <span>
          Pequenos passos, grandes conquistas.
        </span>
      </footer>
    </div>
  );
}