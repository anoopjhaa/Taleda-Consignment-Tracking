
export interface LatLng {
  lat: number;
  lng: number;
}

export async function geocode(query: string): Promise<LatLng | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'ConsignmentTrackerDemo/1.0' } 
    });
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error('Geocode error:', error);
  }
  return null;
}

export async function getRouteDistance(start: LatLng, end: LatLng): Promise<number> {
  try {
    // OSRM Public API
    const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Routing failed');
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].distance / 1000; // Convert meters to km
    }
  } catch (error) {
    console.error('Route error:', error);
  }
  // Fallback to Haversine * 1.4 roughly if API fails
  return calculateHaversineDistance(start, end) * 1.4;
}

function calculateHaversineDistance(start: LatLng, end: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = (end.lat - start.lat) * Math.PI / 180;
  const dLng = (end.lng - start.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
