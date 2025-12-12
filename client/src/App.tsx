import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PutinMap from './components/PutinMap';
import Timeline from './components/Timeline';
import BulletScreen from './components/BulletScreen';
import AudioControl from './components/AudioControl';
import Statistics from './components/Statistics';
import { trpc } from '@/lib/trpc';

function App() {
  const [selectedYear, setSelectedYear] = useState(2000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Fetch all events to get available years
  const { data: allEvents = [] } = trpc.events.all.useQuery();
  const years = Array.from(new Set(allEvents.map((e) => e.year))).sort((a, b) => a - b);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      } else if (e.code === 'ArrowLeft') {
        const currentIndex = years.indexOf(selectedYear);
        if (currentIndex > 0) {
          setSelectedYear(years[currentIndex - 1]);
        }
      } else if (e.code === 'ArrowRight') {
        const currentIndex = years.indexOf(selectedYear);
        if (currentIndex < years.length - 1) {
          setSelectedYear(years[currentIndex + 1]);
        }
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowStats(!showStats);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedYear, years, isPlaying, showStats]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="w-full h-screen bg-background text-foreground flex flex-col overflow-hidden">
            {/* Map */}
            <div className="flex-1 overflow-hidden">
              <PutinMap />
            </div>

            {/* Timeline */}
            {years.length > 0 && (
              <Timeline
                years={years}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            )}

            {/* Bullet Screen */}
            <BulletScreen isPlaying={isPlaying} />

            {/* Audio Control */}
            <AudioControl onPlayingChange={setIsPlaying} />

            {/* Statistics Panel */}
            {showStats && (
              <div className="fixed bottom-20 right-6 w-96 max-h-96 overflow-y-auto bg-card border-2 border-primary rounded-lg shadow-2xl glow-kremlin z-40">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-primary">Статистика</h2>
                    <button
                      onClick={() => setShowStats(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                  <Statistics selectedYear={selectedYear} />
                </div>
              </div>
            )}

            {/* Keyboard shortcuts hint */}
            <div className="fixed top-4 left-4 text-xs text-muted-foreground bg-card/80 backdrop-blur p-3 rounded-lg border border-border z-30">
              <div className="font-bold text-primary mb-2">Горячие клавиши:</div>
              <div className="space-y-1">
                <div><kbd className="bg-muted px-1 rounded">Space</kbd> - Воспроизведение</div>
                <div><kbd className="bg-muted px-1 rounded">←</kbd> <kbd className="bg-muted px-1 rounded">→</kbd> - Навигация по годам</div>
                <div><kbd className="bg-muted px-1 rounded">K</kbd> - Статистика</div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
