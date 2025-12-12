import { useEffect, useRef } from 'react';
import L from 'leaflet';
import gsap from 'gsap';

interface CrimeaRouteProps {
  map: L.Map | null;
  isVisible: boolean;
}

// Key coordinates for Crimea route
const CRIMEA_ROUTE = [
  { lat: 55.7558, lng: 37.6173, name: 'Kremlin, Moscow' }, // Starting point
  { lat: 45.3571, lng: 36.6753, name: 'Crimea Bridge' }, // Crimea Bridge
  { lat: 44.6167, lng: 34.25, name: 'Sevastopol' }, // Ending point
];

export default function CrimeaRoute({ map, isVisible }: CrimeaRouteProps) {
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!map || !isVisible) {
      // Hide route
      if (polylineRef.current) {
        map?.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
      markersRef.current.forEach((marker) => {
        map?.removeLayer(marker);
      });
      markersRef.current = [];
      return;
    }

    // Create coordinates array
    const coordinates: [number, number][] = CRIMEA_ROUTE.map((point) => [
      point.lat,
      point.lng,
    ]);

    // Create polyline with golden color and animation
    const polyline = L.polyline([], {
      color: '#D4AF37', // Orthodox gold
      weight: 4,
      opacity: 0.9,
      dashArray: '10, 5',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    polylineRef.current = polyline;

    // Animate polyline drawing with glow effect
    if (animationRef.current) {
      animationRef.current.kill();
    }

    animationRef.current = gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: 2,
        ease: 'power1.inOut',
        onUpdate: function () {
          const progress = this.targets()[0].progress;
          const endIndex = Math.ceil(coordinates.length * progress);
          polyline.setLatLngs(coordinates.slice(0, endIndex));

          // Add pulsing glow effect
          polyline.setStyle({
            opacity: 0.7 + 0.2 * Math.sin(progress * Math.PI * 4),
          });
        },
      }
    );

    // Add markers for key points
    CRIMEA_ROUTE.forEach((point, index) => {
      const isStart = index === 0;
      const isEnd = index === CRIMEA_ROUTE.length - 1;

      const iconHtml = isStart
        ? `<div class="w-4 h-4 rounded-full border-2 border-accent bg-primary flex items-center justify-center animate-pulse-glow">
             <div class="w-1.5 h-1.5 bg-accent rounded-full"></div>
           </div>`
        : isEnd
          ? `<div class="w-4 h-4 rounded-full border-2 border-accent bg-destructive flex items-center justify-center animate-pulse-glow">
               <div class="w-1.5 h-1.5 bg-accent rounded-full"></div>
             </div>`
          : `<div class="w-3 h-3 rounded-full border-2 border-accent bg-accent flex items-center justify-center">
               <div class="w-1 h-1 bg-primary rounded-full"></div>
             </div>`;

      const icon = L.divIcon({
        html: iconHtml,
        iconSize: [16, 16],
        className: 'crimea-marker',
      });

      const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);

      // Add popup
      marker.bindPopup(`
        <div class="bg-card text-card-foreground p-2 rounded text-sm">
          <h4 class="font-bold text-accent">${point.name}</h4>
          <p class="text-xs text-muted-foreground">${isStart ? 'Начало' : isEnd ? 'Конец' : 'Промежуточный пункт'}</p>
        </div>
      `);

      markersRef.current.push(marker);
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [map, isVisible]);

  return null;
}
