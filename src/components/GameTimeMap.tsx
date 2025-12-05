import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Users, Trophy } from 'lucide-react';

interface GameTimeMapProps {
  className?: string;
}

// Mock data for demonstration
const mockLocations = {
  courts: [
    { id: 1, name: 'Main Courts', lng: -97.7431, lat: 30.2672, courts: 8 },
    { id: 2, name: 'North Courts', lng: -97.7531, lat: 30.2872, courts: 4 },
  ],
  players: [
    { id: 1, name: 'Player 1', lng: -97.7401, lat: 30.2652 },
    { id: 2, name: 'Player 2', lng: -97.7461, lat: 30.2692 },
    { id: 3, name: 'Player 3', lng: -97.7511, lat: 30.2712 },
  ],
  sessions: [
    { id: 1, name: 'Tuesday Open Play', lng: -97.7431, lat: 30.2672, players: 12 },
    { id: 2, name: 'Challenge Court', lng: -97.7531, lat: 30.2872, players: 4 },
  ],
};

const GameTimeMap = ({ className }: GameTimeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(() => localStorage.getItem('mapbox_token') || '');
  const [tempToken, setTempToken] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  const saveToken = () => {
    if (tempToken.trim()) {
      localStorage.setItem('mapbox_token', tempToken.trim());
      setToken(tempToken.trim());
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-97.7431, 30.2672],
        zoom: 13,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapReady(true);

        // Add court markers
        mockLocations.courts.forEach((court) => {
          const el = document.createElement('div');
          el.className = 'court-marker';
          el.innerHTML = `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg border-2 border-background"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;

          new mapboxgl.Marker(el)
            .setLngLat([court.lng, court.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${court.name}</strong><br/>${court.courts} courts`))
            .addTo(map.current!);
        });

        // Add player markers
        mockLocations.players.forEach((player) => {
          const el = document.createElement('div');
          el.className = 'player-marker';
          el.innerHTML = `<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;

          new mapboxgl.Marker(el)
            .setLngLat([player.lng, player.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${player.name}</strong><br/>Playing now`))
            .addTo(map.current!);
        });

        // Add session markers
        mockLocations.sessions.forEach((session) => {
          const el = document.createElement('div');
          el.className = 'session-marker';
          el.innerHTML = `<div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>`;

          new mapboxgl.Marker(el)
            .setLngLat([session.lng, session.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${session.name}</strong><br/>${session.players} players`))
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      setToken('');
      localStorage.removeItem('mapbox_token');
    }

    return () => {
      map.current?.remove();
    };
  }, [token]);

  if (!token) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Enable Map</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to view the map. Get one at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="pk.eyJ1..."
              value={tempToken}
              onChange={(e) => setTempToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveToken} disabled={!tempToken.trim()}>
              Save
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-64 rounded-lg overflow-hidden" />
      <div className="absolute bottom-2 left-2 flex gap-2">
        <div className="bg-background/90 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1 text-xs">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span>Courts</span>
        </div>
        <div className="bg-background/90 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1 text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span>Players</span>
        </div>
        <div className="bg-background/90 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1 text-xs">
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span>Sessions</span>
        </div>
      </div>
    </div>
  );
};

export default GameTimeMap;
