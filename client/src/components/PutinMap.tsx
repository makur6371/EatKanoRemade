import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trpc } from '@/lib/trpc';

interface MapEvent {
  id: number;
  latitude: string;
  longitude: string;
  title: string;
  description: string | null;
  year: number;
  type: string;
  location: string;
}

export default function PutinMap() {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2000);

  // Fetch all events
  const { data: allEvents = [], isLoading } = trpc.events.all.useQuery();

  // Filter events by year
  const yearEvents = allEvents.filter((e) => e.year === selectedYear);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', {
        center: [55.7558, 37.6173], // Moscow
        zoom: 4,
        zoomControl: true,
        attributionControl: true,
      });

      // Add tile layer with dark theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      // Cleanup is handled by Leaflet
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    yearEvents.forEach((event) => {
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);

      // Create custom icon based on event type
      const iconColor = getIconColor(event.type);
      const icon = L.divIcon({
        html: `
          <div class="w-8 h-8 rounded-full border-2 border-accent bg-${iconColor} flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
            <div class="w-2 h-2 bg-accent rounded-full"></div>
          </div>
        `,
        iconSize: [32, 32],
        className: 'event-marker',
      });

      const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current!);

      // Add popup
      marker.bindPopup(`
        <div class="bg-card text-card-foreground p-3 rounded">
          <h3 class="font-bold text-primary">${event.title}</h3>
          <p class="text-sm text-muted-foreground">${event.location}</p>
          <p class="text-xs mt-2">${event.description || ''}</p>
        </div>
      `);

      // Add click handler
      marker.on('click', () => {
        setSelectedEvent(event);
      });

      markersRef.current.push(marker);
    });
  }, [yearEvents]);

  // Get icon color based on event type
  const getIconColor = (type: string): string => {
    switch (type) {
      case 'domestic':
        return 'bg-primary';
      case 'international':
        return 'bg-secondary';
      case 'speech':
        return 'bg-accent';
      case 'ceremony':
        return 'bg-primary';
      case 'military':
        return 'bg-destructive';
      case 'diplomatic':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  // Get available years
  const years = Array.from(
    new Set(allEvents.map((e) => e.year))
  ).sort((a, b) => a - b);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-kremlin text-white p-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">От Кремля до Тихого океана</h1>
        <p className="text-lg opacity-90">Путин: 25 лет власти (1999–2025)</p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Map */}
        <div className="flex-1 rounded-lg overflow-hidden shadow-lg">
          <div id="map" className="w-full h-full" />
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-card rounded-lg shadow-lg p-4 overflow-y-auto border border-border">
          {/* Year selector */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primary mb-3">Выберите год</h2>
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-2 rounded text-sm font-bold transition-all ${
                    selectedYear === year
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Events list */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-3">
              События {selectedYear}
            </h2>
            {isLoading ? (
              <p className="text-muted-foreground">Загрузка...</p>
            ) : yearEvents.length > 0 ? (
              <div className="space-y-3">
                {yearEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`p-3 rounded cursor-pointer transition-all border-l-4 ${
                      selectedEvent?.id === event.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted/20 border-muted hover:bg-muted/40'
                    }`}
                  >
                    <h3 className="font-bold text-sm text-primary">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Нет событий в этом году</p>
            )}
          </div>

          {/* Selected event details */}
          {selectedEvent && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-lg font-bold text-primary mb-3">Детали события</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Название:</span>
                  <p className="font-bold text-foreground">{selectedEvent.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Место:</span>
                  <p className="font-bold text-foreground">{selectedEvent.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Тип:</span>
                  <p className="font-bold text-foreground capitalize">{selectedEvent.type}</p>
                </div>
                {selectedEvent.description && (
                  <div>
                    <span className="text-muted-foreground">Описание:</span>
                    <p className="text-foreground mt-1">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
