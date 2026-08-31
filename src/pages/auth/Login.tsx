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

  // Função para redirecionar com base no perfil do utilizador (aluno, pai, instituição, etc.)
  async function redirectUserByRole(userId: string) {
    try {
      // Consulta a tabela de perfis para identificar a role do utilizador
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        // Redirecionamento de segurança caso não encontre a role cadastrada
        navigate("/dashboard", { replace: true });
        return;
      }

      // Roteamento baseado no perfil retornado pela base de dados
      switch (profile.role) {
        case "student":
        case "child":
          navigate("/child/dashboard", { replace: true });
          break;
        case "parent":
        case "guardian":
          navigate("/parent/dashboard", { replace: true });
          break;
        case "institution":
        case "school":
        case "admin":
          navigate("/institution/dashboard", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
          break;
      }
    } catch {
      // Fallback em caso de falha de conexão ou erro inesperado na leitura da tabela
      navigate("/dashboard", { replace: true });
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

    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (loginError) {
      setLoading(false);
      setError("E-mail ou palavra-passe incorretos.");
      return;
    }

    if (authData.user) {
      // Procede com a verificação de permissões/perfis antes do encaminhamento
      await redirectUserByRole(authData.user.id);
    }

    setLoading(false);
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
                <span className="spinner" /> A autenticar...
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
          <p>Plataforma Integrada de Educação Financeira</p>
        </footer>
      </main>
    </div>
  );
}