import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coins,
  LockKeyhole,
  Mail,
  LogIn,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Validação simples de formato de e-mail
  function isValidEmail(emailToTest: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToTest);
  }

  // Redireciona o utilizador de acordo com a role existente na tabela users
  async function redirectUserByRole(userId: string) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
        if (isMounted.current) {
          setError("Não foi possível carregar o perfil do utilizador.");
        }
        return;
      }

      if (!profile) {
        console.error("Perfil não encontrado.");
        if (isMounted.current) {
          setError("Perfil do utilizador não encontrado.");
        }
        return;
      }

      console.log("Utilizador autenticado:", userId);
      console.log("Role encontrada:", profile.role);

      switch (profile.role) {
        // CRIANÇA
        case "kid":
        case "student":
        case "child":
          navigate("/child/dashboard", { replace: true });
          break;

        // RESPONSÁVEL / ENCARREGADO
        case "parent":
        case "guardian":
          navigate("/parent/dashboard", { replace: true });
          break;

        // ADMINISTRADOR DA ESCOLA
        case "school_admin":
        case "school":
        case "institution":
          navigate("/institution/dashboard", { replace: true });
          break;

        // ADMINISTRADOR DO SISTEMA
        case "system_admin":
        case "admin":
          navigate("/institution/dashboard", { replace: true });
          break;

        // ROLE DESCONHECIDA
        default:
          console.error("Role não reconhecida:", profile.role);
          if (isMounted.current) {
            setError(
              "O perfil deste utilizador ainda não possui uma área definida."
            );
          }
          break;
      }
    } catch (err) {
      console.error("Erro inesperado ao redirecionar:", err);
      if (isMounted.current) {
        setError("Ocorreu um erro ao carregar o perfil.");
      }
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Preencha o e-mail e a palavra-passe.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        console.error("Erro de autenticação:", loginError);

        if (isMounted.current) {
          setError("E-mail ou palavra-passe incorretos.");
        }
        return;
      }

      if (!authData.user) {
        if (isMounted.current) {
          setError("Não foi possível identificar o utilizador.");
        }
        return;
      }

      console.log("Login realizado com sucesso.");
      console.log("ID do utilizador:", authData.user.id);

      await redirectUserByRole(authData.user.id);
    } catch (err) {
      console.error("Erro no login:", err);
      if (isMounted.current) {
        setError("Ocorreu um erro ao tentar iniciar sessão.");
      }
    } finally {
      // Evita atualizar estado se o componente já foi desmontado pelo navigate()
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }

  return (
    <div className="login-page" translate="no">
      <div className="login-background-shape shape-one" />
      <div className="login-background-shape shape-two" />

      <main className="login-card">
        <header className="login-brand">
          <div className="login-logo" aria-hidden="true">
            <Coins size={34} strokeWidth={2.5} />
          </div>

          <div>
            <strong>Finanças Kids</strong>
            <span>Educação e Gestão Financeira</span>
          </div>
        </header>

        <section className="login-welcome">
          <div className="login-sparkle" aria-hidden="true">
            <Sparkles size={20} />
          </div>

          <span>BEM-VINDO!</span>

          <h1>Aceder à Plataforma</h1>

          <p>
            Introduza os seus dados de acesso para entrar na sua conta.
          </p>
        </section>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <div className="login-field">
            <label htmlFor="email-input">E-mail</label>

            <div className="login-input">
              <Mail size={21} className="input-icon" />

              <input
                id="email-input"
                type="email"
                placeholder="seu.email@exemplo.com"
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
                placeholder="Sua palavra-passe"
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
                aria-label={
                  showPassword
                    ? "Ocultar palavra-passe"
                    : "Mostrar palavra-passe"
                }
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              key="login-error-container"
              className="login-error"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span key="loading-state" className="login-loading-state">
                <span className="spinner" />
                A autenticar...
              </span>
            ) : (
              <span key="idle-state" className="login-idle-state" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Entrar
                <LogIn size={22} />
              </span>
            )}
          </button>
        </form>

        <footer className="login-footer">
          <p>Plataforma Integrada de Educação Financeira</p>
        </footer>
      </main>
    </div>
  );
}