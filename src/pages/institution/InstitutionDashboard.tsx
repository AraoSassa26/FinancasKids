import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  School,
  UserRound,
  TrendingUp,
  Award,
} from "lucide-react";

import "./InstitutionDashboard.css";

function InstitutionDashboard() {
  return (
    <div className="institution-page">

      {/* SIDEBAR DESKTOP */}
      <aside className="institution-sidebar">

        <div className="institution-brand">
          <div className="institution-logo">
            <School size={24} />
          </div>

          <div>
            <strong>Finanças Kids</strong>
            <span>Painel da Instituição</span>
          </div>
        </div>

        <nav className="institution-menu">

          <a className="institution-menu-item active" href="#">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>

          <a className="institution-menu-item" href="#">
            <Users size={20} />
            <span>Alunos</span>
          </a>

          <a className="institution-menu-item" href="#">
            <GraduationCap size={20} />
            <span>Turmas</span>
          </a>

          <a className="institution-menu-item" href="#">
            <BookOpen size={20} />
            <span>Conteúdos</span>
          </a>

          <a className="institution-menu-item" href="#">
            <BarChart3 size={20} />
            <span>Relatórios</span>
          </a>

        </nav>

        <div className="institution-sidebar-bottom">

          <a className="institution-menu-item" href="#">
            <Settings size={20} />
            <span>Configurações</span>
          </a>

          <button className="institution-logout">
            <LogOut size={20} />
            <span>Sair</span>
          </button>

        </div>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="institution-main">

        {/* HEADER */}
        <header className="institution-header">

          <div>
            <span className="institution-header-label">
              PAINEL DA INSTITUIÇÃO
            </span>

            <h1>Olá, seja bem-vindo! 👋</h1>

            <p>
              Acompanhe a evolução dos seus alunos no Finanças Kids.
            </p>
          </div>

          <div className="institution-header-actions">

            <button className="institution-notification">
              <Bell size={21} />
              <span></span>
            </button>

            <div className="institution-user">
              <div className="institution-user-avatar">
                <UserRound size={20} />
              </div>

              <div>
                <strong>Instituição</strong>
                <small>Administrador</small>
              </div>
            </div>

          </div>

        </header>

        {/* ESTATÍSTICAS */}
        <section className="institution-stats">

          <div className="institution-stat-card">
            <div className="institution-stat-icon students">
              <Users size={22} />
            </div>

            <div className="institution-stat-content">
              <span>Total de alunos</span>
              <strong>0</strong>
              <small>Alunos cadastrados</small>
            </div>
          </div>

          <div className="institution-stat-card">
            <div className="institution-stat-icon classes">
              <GraduationCap size={22} />
            </div>

            <div className="institution-stat-content">
              <span>Turmas</span>
              <strong>0</strong>
              <small>Turmas ativas</small>
            </div>
          </div>

          <div className="institution-stat-card">
            <div className="institution-stat-icon lessons">
              <BookOpen size={22} />
            </div>

            <div className="institution-stat-content">
              <span>Conteúdos</span>
              <strong>0</strong>
              <small>Conteúdos disponíveis</small>
            </div>
          </div>

          <div className="institution-stat-card">
            <div className="institution-stat-icon progress">
              <TrendingUp size={22} />
            </div>

            <div className="institution-stat-content">
              <span>Progresso médio</span>
              <strong>0%</strong>
              <small>Evolução dos alunos</small>
            </div>
          </div>

        </section>

        {/* ÁREA INFERIOR */}
        <section className="institution-content-grid">

          {/* ATIVIDADE */}
          <div className="institution-panel">

            <div className="institution-panel-header">

              <div>
                <span>ACOMPANHAMENTO</span>
                <h2>Atividade dos alunos</h2>
              </div>

              <button>Ver tudo</button>

            </div>

            <div className="institution-empty-state">

              <div className="institution-empty-icon">
                <BarChart3 size={28} />
              </div>

              <h3>Nenhuma atividade ainda</h3>

              <p>
                Quando os alunos começarem a utilizar a plataforma,
                as atividades aparecerão aqui.
              </p>

            </div>

          </div>

          {/* DESEMPENHO */}
          <div className="institution-panel">

            <div className="institution-panel-header">

              <div>
                <span>DESEMPENHO</span>
                <h2>Visão geral</h2>
              </div>

            </div>

            <div className="institution-performance">

              <div className="institution-performance-icon">
                <Award size={30} />
              </div>

              <strong>0%</strong>

              <span>Progresso geral</span>

              <div className="institution-progress">
                <div></div>
              </div>

              <p>
                Ainda não existem dados suficientes para apresentar
                o desempenho dos alunos.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* NAVBAR MOBILE */}
      <nav className="institution-bottom-nav">

        <a className="active" href="#">
          <LayoutDashboard size={21} />
          <span>Início</span>
        </a>

        <a href="#">
          <Users size={21} />
          <span>Alunos</span>
        </a>

        <a href="#">
          <GraduationCap size={21} />
          <span>Turmas</span>
        </a>

        <a href="#">
          <BarChart3 size={21} />
          <span>Relatórios</span>
        </a>

        <a href="#">
          <Settings size={21} />
          <span>Mais</span>
        </a>

      </nav>

    </div>
  );
}

export default InstitutionDashboard;