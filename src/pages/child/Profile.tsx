import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CircleHelp,
  LogOut,
  Settings,
  Star,
  Trophy,
  User,
  Zap,
} from "lucide-react";

interface ChildProgress {
  xp: number;
  completedLessons: number;
  totalLessons: number;
  rewards: number;
}

const DEFAULT_PROGRESS: ChildProgress = {
  xp: 0,
  completedLessons: 0,
  totalLessons: 5,
  rewards: 0,
};

const PROGRESS_KEY = "financas-kids-progress";

function loadProgress(): ChildProgress {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);

    if (!saved) {
      return DEFAULT_PROGRESS;
    }

    return {
      ...DEFAULT_PROGRESS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function Profile() {
  const navigate = useNavigate();

  const [progress, setProgress] =
    useState<ChildProgress>(loadProgress);

  useEffect(() => {
    function updateProgress() {
      setProgress(loadProgress());
    }

    window.addEventListener(
      "financas-kids-progress-updated",
      updateProgress
    );

    window.addEventListener("storage", updateProgress);

    return () => {
      window.removeEventListener(
        "financas-kids-progress-updated",
        updateProgress
      );

      window.removeEventListener("storage", updateProgress);
    };
  }, []);

  const progressPercentage =
    progress.totalLessons > 0
      ? Math.round(
          (progress.completedLessons /
            progress.totalLessons) *
            100
        )
      : 0;

  function handleHelp() {
    window.alert(
      "Precisas de ajuda? Continua a aprender através das aulas e desafios. Em breve teremos uma área de ajuda completa."
    );
  }

  function handleLogout() {
    const confirmed = window.confirm(
      "Queres sair do Finanças Kids?"
    );

    if (!confirmed) return;

    navigate("/");
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          className="back-button"
          onClick={() => navigate("/child/dashboard")}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <span>CONTA</span>
          <h1>Meu perfil</h1>
        </div>
      </header>

      <main className="profile-content">
        <section className="profile-hero">
          <div className="profile-avatar">
            <User size={48} strokeWidth={2.2} />
          </div>

          <div className="profile-name">
            <span>OLÁ!</span>
            <h2>KID</h2>
          </div>

          <div className="profile-level">
            <Star size={17} fill="currentColor" />
            <strong>Nível 1</strong>
          </div>
        </section>

        <section className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-icon xp">
              <Zap size={22} fill="currentColor" />
            </div>

            <strong>{progress.xp}</strong>
            <span>XP</span>
          </div>

          <div className="profile-stat">
            <div className="profile-stat-icon lessons">
              <BookOpen size={22} />
            </div>

            <strong>
              {progress.completedLessons}
            </strong>

            <span>Aulas</span>
          </div>

          <div className="profile-stat">
            <div className="profile-stat-icon rewards">
              <Trophy size={22} />
            </div>

            <strong>{progress.rewards}</strong>
            <span>Prémios</span>
          </div>
        </section>

        <section className="profile-progress-card">
          <div className="profile-progress-top">
            <div>
              <span>PROGRESSO</span>
              <h2>A tua jornada</h2>
            </div>

            <strong>{progressPercentage}%</strong>
          </div>

          <div className="profile-progress-track">
            <div
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <p>
            {progress.completedLessons === 0
              ? "Completa a tua primeira aula para começar."
              : progress.completedLessons >=
                progress.totalLessons
              ? "Parabéns! Completaste todas as aulas."
              : `Já completaste ${progress.completedLessons} de ${progress.totalLessons} aulas.`}
          </p>
        </section>

        <div className="profile-section-title">
          <span>OPÇÕES</span>
          <h2>Configurações</h2>
        </div>

        <section className="profile-menu">
          <button
            className="profile-menu-item"
            onClick={() =>
              navigate("/child/settings")
            }
          >
            <div className="profile-menu-icon blue">
              <Settings size={22} />
            </div>

            <div>
              <strong>Definições</strong>
              <span>
                Personaliza a tua experiência
              </span>
            </div>

            <ChevronRight size={20} />
          </button>

          <button
            className="profile-menu-item"
            onClick={handleHelp}
          >
            <div className="profile-menu-icon yellow">
              <CircleHelp size={22} />
            </div>

            <div>
              <strong>Ajuda</strong>
              <span>Precisas de ajuda?</span>
            </div>

            <ChevronRight size={20} />
          </button>

          <button
            className="profile-menu-item profile-logout"
            onClick={handleLogout}
          >
            <div className="profile-menu-icon red">
              <LogOut size={22} />
            </div>

            <div>
              <strong>Sair</strong>
              <span>Voltar ao início</span>
            </div>

            <ChevronRight size={20} />
          </button>
        </section>

        <section className="profile-motivation">
          <div className="profile-motivation-icon">
            <Star size={30} fill="currentColor" />
          </div>

          <div>
            <span>CONTINUA ASSIM</span>

            <h2>Cada aula conta!</h2>

            <p>
              Aprende um pouco todos os dias e
              torna-te cada vez melhor com o dinheiro.
            </p>
          </div>
        </section>
      </main>

      <nav className="kids-bottom-nav">
        <button
          className="nav-item"
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
          <BookOpen size={23} />
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

        <button className="nav-item active">
          <User size={23} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}