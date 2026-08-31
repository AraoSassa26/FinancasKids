import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, LockKeyhole, Mail, LogIn, Sparkles, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validação simples de formato de e-mail
  function isValidEmail(emailToTest: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToTest);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Preenche o e-mail e a palavra-passe.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Por favor, insere um e-mail válido.");
      return;
    }

    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError("E-mail ou palavra-passe incorretos.");
      return;
    }

    navigate("/child/dashboard", { replace: true });
  }

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one" />
      <div className="login-background-shape shape-two" />

      <main className="login-card">
        <header className="login-brand">
          <div className="login-logo" aria-hidden="true">
            <Coins size={34} strokeWidth={2.5} />
          </div>

          <div>
            <strong>Finanças Kids</strong>
            <span>Aprender para crescer</span>
          </div>
        </header>

        <section className="login-welcome">
          <div className="login-sparkle" aria-hidden="true">
            <Sparkles size={20} />
          </div>

          <span>BEM-VINDO!</span>

          <h1>Vamos aprender?</h1>

          <p>
            Entra na tua conta para continuar a tua jornada financeira.
          </p>
        </section>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <div className="login-field">
            <label htmlFor="email-input">Email</label>
            <div className="login-input">
              <Mail size={21} className="input-icon" />
              <input
                id="email-input"
                type="email"
                placeholder="O teu e-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password-input">Palavra-passe</label>
            <div className="login-input">
              <LockKeyhole size={21} className="input-icon" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="A tua palavra-passe"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                tabIndex={0}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="login-loading-state">
                <span className="spinner" /> A entrar...
              </span>
            ) : (
              <>
                Entrar
                <LogIn size={22} />
              </>
            )}
          </button>
        </form>

        <footer className="login-footer">
          <p>Aprende. Joga. Cresce.</p>
        </footer>
      </main>
    </div>
  );
}