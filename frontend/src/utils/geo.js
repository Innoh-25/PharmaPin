// Utility helpers for normalizing geographic coordinates from pharmacy objects
export function getLatLngFromPharmacy(pharmacy) {
  if (!pharmacy) return null;

  // 1) Check GeoJSON-like location.coordinates -> [lng, lat]
  if (pharmacy.location && Array.isArray(pharmacy.location.coordinates)) {
    const [lng, lat] = pharmacy.location.coordinates;
    if (typeof lat === 'number' && typeof lng === 'number') {
      // Treat [0,0] as unset/default
      if (lat === 0 && lng === 0) {
        // continue to other checks
      } else {
        return { lat, lng };
      }
    }
  }

  // 2) Address coordinates may be stored as object { lat, lng } or { latitude, longitude }
  const addrCoords = pharmacy.address && pharmacy.address.coordinates;
  if (addrCoords && typeof addrCoords === 'object') {
    const lat = addrCoords.lat ?? addrCoords.latitude ?? (Array.isArray(addrCoords) ? addrCoords[1] : undefined);
    const lng = addrCoords.lng ?? addrCoords.longitude ?? (Array.isArray(addrCoords) ? addrCoords[0] : undefined);
    if (typeof lat === 'number' && typeof lng === 'number') {
      if (lat === 0 && lng === 0) {
        // ignore
      } else {
        return { lat, lng };
      }
    }
  }

  // 3) Flat fields on pharmacy object: latitude / longitude or lat / lng
  const latField = pharmacy.latitude ?? pharmacy.lat;
  const lngField = pharmacy.longitude ?? pharmacy.lng;
  if (typeof latField === 'number' && typeof lngField === 'number') {
    if (latField === 0 && lngField === 0) return null;
    return { lat: latField, lng: lngField };
  }

  // Nothing usable found
  return null;
}

export function hasValidCoordinates(pharmacy) {
  return !!getLatLngFromPharmacy(pharmacy);
}
