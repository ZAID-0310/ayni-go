const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export async function nombreDeLugar(lat, lng) {
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&language=es&country=pe&types=address,street,neighborhood,locality&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding ' + res.status);
  const data = await res.json();
  const p = data.features?.[0]?.properties;
  if (!p) return null;
  return p.name_preferred || p.name || p.full_address || null;
}