import { UserCircle } from "lucide-react";

export default function ChildHeader() {
  return (
    <header className="child-header">
      <div className="brand">
        <div className="brand-icon">
          <span>F</span>
        </div>

        <div>
          <strong>Finanças Kids</strong>
          <small>Aprender para crescer</small>
        </div>
      </div>

      <button
        type="button"
        className="profile-button"
        aria-label="Abrir perfil"
      >
        <UserCircle size={28} strokeWidth={1.8} />
      </button>
    </header>
  );
}