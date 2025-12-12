import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Bullet {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  duration: number;
  language: 'zh' | 'ru' | 'en';
}

interface BulletScreenProps {
  isPlaying: boolean;
}

// Sample comments in multiple languages
const SAMPLE_COMMENTS = [
  { text: '西伯利亚力量！', language: 'zh' as const, color: '#FFD700' },
  { text: 'Сила Сибири!', language: 'ru' as const, color: '#D4AF37' },
  { text: 'From Kremlin to Pacific!', language: 'en' as const, color: '#0039A6' },
  { text: '25年的权力轨迹', language: 'zh' as const, color: '#D52B1E' },
  { text: 'Путин - лидер России', language: 'ru' as const, color: '#8B0000' },
  { text: 'A journey across continents', language: 'en' as const, color: '#FFD700' },
  { text: '从克里姆林宫到太平洋', language: 'zh' as const, color: '#0039A6' },
  { text: 'Одна воля, одна Россия', language: 'ru' as const, color: '#D4AF37' },
  { text: 'Diplomatic power', language: 'en' as const, color: '#8B0000' },
  { text: '国际访问147次', language: 'zh' as const, color: '#FFD700' },
];

export default function BulletScreen({ isPlaying }: BulletScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bullets, setBullets] = useState<Bullet[]>([]);

  // Generate bullets periodically
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const sample = SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)];
      const newBullet: Bullet = {
        id: `${Date.now()}-${Math.random()}`,
        text: sample.text,
        color: sample.color,
        fontSize: 14 + Math.random() * 8,
        duration: 6 + Math.random() * 4,
        language: sample.language,
      };

      setBullets((prev) => [...prev, newBullet]);

      // Remove bullet after animation
      setTimeout(() => {
        setBullets((prev) => prev.filter((b) => b.id !== newBullet.id));
      }, (newBullet.duration + 1) * 1000);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {bullets.map((bullet) => (
        <BulletComment key={bullet.id} bullet={bullet} />
      ))}
    </div>
  );
}

interface BulletCommentProps {
  bullet: Bullet;
}

function BulletComment({ bullet }: BulletCommentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const startY = Math.random() * (window.innerHeight - 40);
    const startX = window.innerWidth;
    const endX = -200;

    gsap.fromTo(
      ref.current,
      {
        x: startX,
        y: startY,
        opacity: 1,
      },
      {
        x: endX,
        opacity: 0,
        duration: bullet.duration,
        ease: 'linear',
        onComplete: () => {
          ref.current?.remove();
        },
      }
    );
  }, [bullet.duration]);

  return (
    <div
      ref={ref}
      className="fixed whitespace-nowrap font-bold pointer-events-none"
      style={{
        color: bullet.color,
        fontSize: `${bullet.fontSize}px`,
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        fontWeight: 'bold',
      }}
    >
      {bullet.text}
    </div>
  );
}
