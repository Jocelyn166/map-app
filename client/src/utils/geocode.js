export async function reverseGeocode({ lat, lng, apiKey, signal }) {
  const fallback = {
    address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
    lat,
    lng,
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    const res = await fetch(url, { signal })
    const data = await res.json()

    if (!data?.results?.length) return fallback

    const street = data.results.find((r) => r.types?.includes('street_address'))
    const result = street || data.results[0]

    return { address: result.formatted_address, lat, lng }
  } catch (err) {
    if (err?.name === 'AbortError') return fallback
    console.error('Reverse geocoding failed:', err)
    return fallback
  }
}
