// GeoJSON-like catalogue points — raw JSON uses [lat, lng] strings

// Display fields on a single warehouse pin
type t_FeatureProperties = {
  name: string;
  addr: string;
  price: number;
  district: string;
  caption: string;
};

// One feature as stored in features.json (pre-conversion)
type t_MapFeature = {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    // [lat, lng] strings — flip to [lng, lat] numbers before ymaps3
    coordinates: [string, string];
  };
  properties: t_FeatureProperties;
};

// Root payload from /data/features.json
type t_FeatureCollection = {
  type: 'FeatureCollection';
  features: t_MapFeature[];
};

// Feature shape after convertFeatures() for YMapClusterer
type t_ClustererFeature = {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    // [lng, lat] numbers for Yandex Maps v3
    coordinates: [number, number];
  };
  properties: t_FeatureProperties;
};
