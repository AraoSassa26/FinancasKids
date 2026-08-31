import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "purple" | "green" | "yellow";
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  variant = "purple",
}: StatCardProps) {
  return (
    <article className={`stat-card stat-${variant}`}>
      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}