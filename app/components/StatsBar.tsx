import type { LucideIcon } from "lucide-react";

interface StatsBarProps {
  stats: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
  }>;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 md:p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
              <p className="text-2xl md:text-3xl font-bold text-ink mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
