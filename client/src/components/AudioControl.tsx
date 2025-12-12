import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioControlProps {
  onPlayingChange?: (isPlaying: boolean) => void;
}

export default function AudioControl({ onPlayingChange }: AudioControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = volume / 100;
      // Placeholder for Russian anthem - in production, replace with actual URL
      audio.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
      audioRef.current = audio;
    }
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Notify parent of playing state
  useEffect(() => {
    onPlayingChange?.(isPlaying);
  }, [isPlaying, onPlayingChange]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked by browser
        console.warn('Audio playback blocked by browser');
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 bg-card border-2 border-primary rounded-lg p-4 shadow-lg glow-kremlin z-50">
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Volume control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-accent hover:text-accent/80 transition-colors"
            title="Mute"
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
              if (isMuted && parseInt(e.target.value) > 0) {
                setIsMuted(false);
              }
            }}
            className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-kremlin-red) 0%, var(--color-kremlin-red) ${volume}%, var(--color-muted) ${volume}%, var(--color-muted) 100%)`,
            }}
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div
            className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-muted'}`}
          />
          <span className="text-xs text-muted-foreground">
            {isPlaying ? 'Воспроизведение' : 'Остановлено'}
          </span>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Нажмите <kbd className="bg-muted px-1 rounded">Space</kbd> для воспроизведения
      </div>
    </div>
  );
}
