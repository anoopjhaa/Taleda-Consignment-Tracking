'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { useEffect, useState } from 'react';
import L from 'leaflet';

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

export default function MapInner({ sender, receiver, progress }: { sender: any, receiver: any, progress: number }) {
  const [route, setRoute] = useState<any>(null);
  
  useEffect(() => {
    if (!sender || !receiver) return;
    
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${sender.lng},${sender.lat};${receiver.lng},${receiver.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0]);
        }
      } catch (e) {
        console.error("Route fetch failed", e);
      }
    };
    
    fetchRoute();
  }, [sender, receiver]);

  if (!sender || !receiver) return null;

  let completedPositions: [number, number][] = [];
  let remainingPositions: [number, number][] = [];
  let currentPos = { lat: sender.lat, lng: sender.lng };

  if (route && route.geometry && route.geometry.coordinates) {
    const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]] as [number, number]);
    
    // Improved logic: Calculate based on distance distance
    // For now, simpler index based approach is visually acceptable for simulation
    const totalPoints = coords.length;
    const splitIndex = Math.floor(totalPoints * Math.min(Math.max(progress, 0), 1));
    
    completedPositions = coords.slice(0, splitIndex + 1);
    remainingPositions = coords.slice(splitIndex);
    
    if (completedPositions.length > 0) {
      const last = completedPositions[completedPositions.length - 1];
      currentPos = { lat: last[0], lng: last[1] };
    }
  }

  const bounds = L.latLngBounds([sender.lat, sender.lng], [receiver.lat, receiver.lng]);

  return (
    <MapContainer 
      center={[sender.lat, sender.lng]} 
      zoom={5} 
      style={{ height: '100%', width: '100%', borderRadius: 'inherit' }} 
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {/* Start Pin */}
      <Marker position={[sender.lat, sender.lng]}>
        <Popup>
          <b>From:</b> {sender.city}
        </Popup>
      </Marker>
      
      {/* End Pin */}
      <Marker position={[receiver.lat, receiver.lng]}>
        <Popup>
          <b>To:</b> {receiver.city}
        </Popup>
      </Marker>

      {/* Truck / Current Position */}
      {route && (
        <Marker position={[currentPos.lat, currentPos.lng]} icon={
          L.divIcon({
            className: 'custom-tracker-icon',
            html: `
              <div style="
                background-color: #27ae60; 
                width: 20px; 
                height: 20px; 
                border-radius: 50%; 
                border: 3px solid white; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }>
          <Popup>Current Location</Popup>
        </Marker>
      )}

      {/* Polyline */}
      {route && (
        <>
          <Polyline positions={completedPositions} color="#27ae60" weight={5} opacity={1} />
          <Polyline positions={remainingPositions} color="#94a3b8" weight={4} dashArray="5, 10" opacity={0.6} />
        </>
      )}

      <FitBounds bounds={bounds} />
    </MapContainer>
  );
}
