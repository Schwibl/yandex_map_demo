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
