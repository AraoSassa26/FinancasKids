interface SectionTitleProps {
  eyebrow: string;
  title: string;
  action?: string;
}

export default function SectionTitle({
  eyebrow,
  title,
  action,
}: SectionTitleProps) {
  return (
    <div className="section-title">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>

      {action && (
        <button type="button" className="section-action">
          {action}
        </button>
      )}
    </div>
  );
}