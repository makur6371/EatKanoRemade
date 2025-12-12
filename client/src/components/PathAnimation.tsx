import { useEffect, useRef } from 'react';
import L from 'leaflet';
import gsap from 'gsap';

interface PathAnimationProps {
  map: L.Map | null;
  events: Array<{
    id: number;
    latitude: string;
    longitude: string;
    year: number;
    title: string;
  }>;
  selectedYear: number;
}

export default function PathAnimation({ map, events, selectedYear }: PathAnimationProps) {
  const polylineRef = useRef<L.Polyline | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!map) return;

    // Get events for selected year and previous years (chronological order)
    const sortedEvents = events
      .filter((e) => e.year <= selectedYear)
      .sort((a, b) => a.year - b.year);

    if (sortedEvents.length < 2) {
      // Remove polyline if less than 2 points
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
      return;
    }

    // Create coordinates array
    const coordinates: [number, number][] = sortedEvents.map((e) => [
      parseFloat(e.latitude),
      parseFloat(e.longitude),
    ]);

    // Remove old polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }

    // Create new polyline with animation
    const polyline = L.polyline([], {
      color: '#D4AF37', // Gold color
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 5',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    polylineRef.current = polyline;

    // Animate polyline drawing
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const animationDuration = Math.min(coordinates.length * 0.3, 3); // Max 3 seconds

    animationRef.current = gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: animationDuration,
        ease: 'power1.inOut',
        onUpdate: function () {
          const progress = this.targets()[0].progress;
          const endIndex = Math.ceil(coordinates.length * progress);
          polyline.setLatLngs(coordinates.slice(0, endIndex));
        },
      }
    );

    // Add markers for key points
    sortedEvents.forEach((event, index) => {
      const isLastPoint = index === sortedEvents.length - 1;
      const iconColor = isLastPoint ? '#D52B1E' : '#0039A6';

      const icon = L.divIcon({
        html: `
          <div class="w-3 h-3 rounded-full border-2 border-accent bg-${isLastPoint ? 'destructive' : 'secondary'} flex items-center justify-center">
            <div class="w-1 h-1 bg-accent rounded-full"></div>
          </div>
        `,
        iconSize: [12, 12],
        className: 'path-marker',
      });

      L.marker([parseFloat(event.latitude), parseFloat(event.longitude)], {
        icon,
      }).addTo(map);
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [map, events, selectedYear]);

  return null;
}
