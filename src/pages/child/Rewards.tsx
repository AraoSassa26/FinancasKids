import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Lock,
  Star,
  Trophy,
  User,
  Zap,
  Target,
  Award,
} from "lucide-react";

export default function Rewards() {
  const navigate = useNavigate();

  const rewards = [
    {
      id: 1,
      title: "Primeiro passo",
      description: "Completa a tua primeira aula.",
      icon: Star,
      progress: "0/1",
      unlocked: false,
    },
    {
      id: 2,
      title: "Pequeno aprendiz",
      description: "Completa 3 aulas financeiras.",
      icon: BookOpen,
      progress: "0/3",
      unlocked: false,
    },
    {
      id: 3,
      title: "Guardador",
      description: "Aprende como poupar dinheiro.",
      icon: Target,
      progress: "0/1",
      unlocked: false,
    },
    {
      id: 4,
      title: "Mestre do dinheiro",
      description: "Completa 5 aulas.",
      icon: Trophy,
      progress: "0/5",
      unlocked: false,
    },
  ];

  return (
    <div className="rewards-page">
      <header className="rewards-header">
        <button
          className="back-button"
          onClick={() => navigate("/child/dashboard")}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <span>CONQUISTAS</span>
          <h1>Prémios</h1>
        </div>
      </header>

      <main className="rewards-content">
        <section className="rewards-hero">
          <div className="rewards-hero-icon">
            <Trophy size={48} strokeWidth={2} />
          </div>

          <div>
            <span>AS TUAS CONQUISTAS</span>
            <h2>Vamos ganhar prémios!</h2>
            <p>
              Aprende, completa desafios e desbloqueia novas conquistas.
            </p>
          </div>
        </section>

        <section className="reward-xp-card">
          <div className="reward-xp-icon">
            <Zap size={27} fill="currentColor" />
          </div>

          <div className="reward-xp-info">
            <span>XP TOTAL</span>
            <strong>0 XP</strong>
          </div>

          <div className="reward-level">
            <small>NÍVEL</small>
            <strong>1</strong>
          </div>
        </section>

        <section className="rewards-summary">
          <div>
            <strong>0</strong>
            <span>Desbloqueados</span>
          </div>

          <div>
            <strong>4</strong>
            <span>Por conquistar</span>
          </div>

          <div>
            <strong>0%</strong>
            <span>Conquistas</span>
          </div>
        </section>

        <div className="rewards-heading">
          <span>COLEÇÃO</span>
          <h2>As tuas conquistas</h2>
        </div>

        <section className="rewards-grid">
          {rewards.map((reward) => {
            const Icon = reward.icon;

            return (
              <article
                className={`reward-item ${
                  reward.unlocked ? "reward-unlocked" : "reward-locked"
                }`}
                key={reward.id}
              >
                <div className="reward-item-icon">
                  {reward.unlocked ? (
                    <Icon size={34} />
                  ) : (
                    <Lock size={29} />
                  )}
                </div>

                <div className="reward-item-content">
                  <span>CONQUISTA {reward.id}</span>

                  <h3>{reward.title}</h3>

                  <p>{reward.description}</p>

                  <div className="reward-item-progress">
                    <span>{reward.progress}</span>

                    <div>
                      <div style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="next-reward-card">
          <div className="next-reward-icon">
            <Award size={32} />
          </div>

          <div>
            <span>PRÓXIMA CONQUISTA</span>
            <h2>Primeiro passo</h2>
            <p>
              Completa a tua primeira aula para começar a tua coleção.
            </p>
          </div>
        </section>
      </main>

      <nav className="kids-bottom-nav">
        <button
          className="nav-item"
          onClick={() => navigate("/child/dashboard")}
        >
          <BookOpen size={23} />
          <span>Início</span>
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/child/lessons")}
        >
          <BookOpen size={23} />
          <span>Aprender</span>
        </button>

        <button className="nav-item active">
          <Trophy size={23} />
          <span>Prémios</span>
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/child/profile")}
        >
          <User size={23} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}