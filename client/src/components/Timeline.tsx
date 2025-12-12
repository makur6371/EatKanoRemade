import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TimelineProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function Timeline({ years, selectedYear, onYearChange }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Animate indicator position
  useEffect(() => {
    if (!indicatorRef.current || years.length === 0) return;

    const index = years.indexOf(selectedYear);
    if (index === -1) return;

    const percentage = (index / (years.length - 1)) * 100;

    gsap.to(indicatorRef.current, {
      left: `${percentage}%`,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }, [selectedYear, years]);

  return (
    <div className="w-full bg-card border-t border-border p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-primary mb-6">Временная шкала (1999–2025)</h2>

        {/* Timeline container */}
        <div ref={timelineRef} className="relative h-24">
          {/* Background line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-kremlin transform -translate-y-1/2" />

          {/* Year markers */}
          <div className="absolute inset-0 flex items-center justify-between px-0">
            {years.map((year, index) => (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                className={`relative z-10 flex flex-col items-center gap-2 transition-all ${
                  selectedYear === year ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                {/* Marker circle */}
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedYear === year
                      ? 'bg-primary border-accent scale-150 shadow-lg glow-kremlin'
                      : 'bg-card border-accent hover:bg-muted'
                  }`}
                />
                {/* Year label */}
                <span
                  className={`text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedYear === year ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {year}
                </span>
              </button>
            ))}
          </div>

          {/* Moving indicator (nuclear briefcase) */}
          <div
            ref={indicatorRef}
            className="absolute top-0 left-0 w-8 h-full flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              {/* Briefcase icon */}
              <div className="w-6 h-8 bg-primary rounded border-2 border-accent shadow-lg animate-pulse-glow">
                <div className="w-full h-1 bg-accent mt-1" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded blur-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-accent" />
            <span className="text-foreground">Выбранный год</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-card border-2 border-accent" />
            <span className="text-muted-foreground">Другой год</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-primary rounded border-2 border-accent" />
            <span className="text-muted-foreground">Ядерный чемодан</span>
          </div>
        </div>
      </div>
    </div>
  );
}
