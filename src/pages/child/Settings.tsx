import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Moon,
  RotateCcw,
  Settings as SettingsIcon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";

type Theme = "light" | "dark" | "system";
type TextSize = "small" | "normal" | "large";

interface AppSettings {
  theme: Theme;
  sound: boolean;
  animations: boolean;
  textSize: TextSize;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  sound: true,
  animations: true,
  textSize: "normal",
};

const STORAGE_KEY = "financas-kids-settings";

function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState<AppSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.textSize =
      settings.textSize;

    document.documentElement.classList.toggle(
      "reduce-animations",
      !settings.animations
    );
  }, [settings]);

  function updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button
          className="back-button"
          onClick={() => navigate("/child/profile")}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <span>PERSONALIZAÇÃO</span>
          <h1>Definições</h1>
        </div>
      </header>

      <main className="settings-content">
        <section className="settings-intro">
          <div className="settings-intro-icon">
            <SettingsIcon size={34} />
          </div>

          <div>
            <span>FINANÇAS KIDS</span>
            <h2>Personaliza a tua experiência</h2>
            <p>
              Escolhe como queres usar a aplicação.
            </p>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <span>APARÊNCIA</span>
            <h2>Tema do app</h2>
          </div>

          <div className="theme-options">
            <button
              className={`theme-option ${
                settings.theme === "light" ? "selected" : ""
              }`}
              onClick={() =>
                updateSetting("theme", "light")
              }
            >
              <Sun size={24} />

              <div>
                <strong>Claro</strong>
                <span>Tema claro</span>
              </div>

              {settings.theme === "light" && (
                <Check size={20} />
              )}
            </button>

            <button
              className={`theme-option ${
                settings.theme === "dark" ? "selected" : ""
              }`}
              onClick={() =>
                updateSetting("theme", "dark")
              }
            >
              <Moon size={24} />

              <div>
                <strong>Escuro</strong>
                <span>Tema escuro</span>
              </div>

              {settings.theme === "dark" && (
                <Check size={20} />
              )}
            </button>

            <button
              className={`theme-option ${
                settings.theme === "system" ? "selected" : ""
              }`}
              onClick={() =>
                updateSetting("theme", "system")
              }
            >
              <SettingsIcon size={24} />

              <div>
                <strong>Sistema</strong>
                <span>Usar o tema do dispositivo</span>
              </div>

              {settings.theme === "system" && (
                <Check size={20} />
              )}
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <span>EXPERIÊNCIA</span>
            <h2>Preferências</h2>
          </div>

          <div className="settings-list">
            <button
              className="settings-row"
              onClick={() =>
                updateSetting(
                  "sound",
                  !settings.sound
                )
              }
            >
              <div className="settings-row-icon blue">
                {settings.sound ? (
                  <Volume2 size={22} />
                ) : (
                  <VolumeX size={22} />
                )}
              </div>

              <div className="settings-row-info">
                <strong>Som</strong>
                <span>
                  {settings.sound
                    ? "Sons ativados"
                    : "Sons desativados"}
                </span>
              </div>

              <div
                className={`settings-switch ${
                  settings.sound ? "on" : ""
                }`}
              >
                <div />
              </div>
            </button>

            <button
              className="settings-row"
              onClick={() =>
                updateSetting(
                  "animations",
                  !settings.animations
                )
              }
            >
              <div className="settings-row-icon yellow">
                <ChevronRight size={22} />
              </div>

              <div className="settings-row-info">
                <strong>Animações</strong>
                <span>
                  {settings.animations
                    ? "Animações ativadas"
                    : "Animações reduzidas"}
                </span>
              </div>

              <div
                className={`settings-switch ${
                  settings.animations ? "on" : ""
                }`}
              >
                <div />
              </div>
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-title">
            <span>LEITURA</span>
            <h2>Tamanho do texto</h2>
          </div>

          <div className="text-size-options">
            {(
              [
                ["small", "Pequeno"],
                ["normal", "Normal"],
                ["large", "Grande"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                className={`text-size-option ${
                  settings.textSize === value
                    ? "selected"
                    : ""
                } ${value}`}
                onClick={() =>
                  updateSetting("textSize", value)
                }
              >
                <strong>Aa</strong>
                <span>{label}</span>

                {settings.textSize === value && (
                  <Check size={17} />
                )}
              </button>
            ))}
          </div>
        </section>

        <button
          className="reset-settings-button"
          onClick={resetSettings}
        >
          <RotateCcw size={19} />
          Restaurar definições
        </button>
      </main>
    </div>
  );
}