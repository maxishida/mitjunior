'use client';

import { TrendingUp, Flame, Clock, Trophy, Target } from 'lucide-react';

export interface DashboardStat {
  label: string;
  value: string;
  description: string;
  icon: 'trend' | 'clock' | 'streak' | 'trophy' | 'target';
  accent?: string;
}

const iconMap: Record<DashboardStat['icon'], JSX.Element> = {
  trend: <TrendingUp className="h-5 w-5" aria-hidden="true" />,
  clock: <Clock className="h-5 w-5" aria-hidden="true" />,
  streak: <Flame className="h-5 w-5" aria-hidden="true" />,
  trophy: <Trophy className="h-5 w-5" aria-hidden="true" />,
  target: <Target className="h-5 w-5" aria-hidden="true" />,
};

interface DashboardStatsRowProps {
  stats: DashboardStat[];
}

export function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/6 via-white/4 to-transparent p-6 shadow-[0_25px_55px_-40px_rgba(0,0,0,0.9)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_35px_65px_-45px_rgba(0,200,150,0.55)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-neutral-300">{stat.description}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 text-primary shadow-inner shadow-black/20">
              {iconMap[stat.icon]}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default DashboardStatsRow;
