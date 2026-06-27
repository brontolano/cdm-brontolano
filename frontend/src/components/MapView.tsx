import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons (Leaflet + bundlers)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  order?: number;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapView({
  markers = [],
  center = [-7.0289, 107.5198],
  zoom = 13,
  onPick,
  showRoute = false,
}: {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onPick?: (lat: number, lng: number) => void;
  showRoute?: boolean;
}) {
  const valid = markers.filter((m) => m.lat != null && m.lng != null);
  const mapCenter: [number, number] = valid.length ? [valid[0].lat, valid[0].lng] : center;
  const line: [number, number][] = valid.map((m) => [m.lat, m.lng]);

  return (
    <div className="map-box">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onPick && <ClickHandler onPick={onPick} />}
        {valid.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
            <Popup>
              {m.order != null ? `#${m.order} — ` : ''}
              {m.label || `${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}`}
            </Popup>
          </Marker>
        ))}
        {showRoute && line.length > 1 && <Polyline positions={line} color="#2563eb" />}
      </MapContainer>
    </div>
  );
}
