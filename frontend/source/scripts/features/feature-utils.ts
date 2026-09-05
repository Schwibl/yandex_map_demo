// Convert GeoJSON lat/lng strings to Yandex [lng, lat]
export function convertCoordinates(coordinates: [string, string]): [number, number] {
  const lat = parseFloat(coordinates[0]);
  const lng = parseFloat(coordinates[1]);
  return [lng, lat];
}

// Map raw collection to clusterer features
export function convertFeatures(collection: t_FeatureCollection): t_ClustererFeature[] {
  return collection.features.map((feature) => ({
    type: 'Feature',
    id: feature.id,
    geometry: {
      type: 'Point',
      coordinates: convertCoordinates(feature.geometry.coordinates),
    },
    properties: feature.properties,
  }));
}

// Filter features by district tag
export function filterByDistrict(collection: t_FeatureCollection, district: string | null): t_FeatureCollection {
  if (!district || district === 'all') {
    return collection;
  }

  return {
    type: 'FeatureCollection',
    features: collection.features.filter((f) => f.properties.district === district),
  };
}

// Minimum padding in degrees when all points share a coordinate
const BOUNDS_MIN_PADDING = 0.1;

// Bounding box [[swLng, swLat], [neLng, neLat]] for setLocation
export function calculateBounds(features: t_ClustererFeature[]): [[number, number], [number, number]] {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const feature of features) {
    const [lng, lat] = feature.geometry.coordinates;
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  // Avoid over-zoom on a single point or coincident pins
  if (minLng === maxLng) {
    minLng -= BOUNDS_MIN_PADDING;
    maxLng += BOUNDS_MIN_PADDING;
  }
  if (minLat === maxLat) {
    minLat -= BOUNDS_MIN_PADDING;
    maxLat += BOUNDS_MIN_PADDING;
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}
