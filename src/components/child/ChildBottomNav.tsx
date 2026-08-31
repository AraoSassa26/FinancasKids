import {
  Home,
  BookOpen,
  Trophy,
  User,
} from "lucide-react";

export default function ChildBottomNav() {
  return (
    <nav className="child-bottom-nav">
      <button className="nav-item active" type="button">
        <Home size={21} />
        <span>Início</span>
      </button>

      <button className="nav-item" type="button">
        <BookOpen size={21} />
        <span>Aprender</span>
      </button>

      <button className="nav-item" type="button">
        <Trophy size={21} />
        <span>Conquistas</span>
      </button>

      <button className="nav-item" type="button">
        <User size={21} />
        <span>Perfil</span>
      </button>
    </nav>
  );
}