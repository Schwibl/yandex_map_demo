// GeoJSON-like feature types for mock catalogue map

type t_FeatureProperties = {
  name: string;
  addr: string;
  price: number;
  district: string;
  caption: string;
};

type t_MapFeature = {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [string, string];
  };
  properties: t_FeatureProperties;
};

type t_FeatureCollection = {
  type: 'FeatureCollection';
  features: t_MapFeature[];
};

type t_ClustererFeature = {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: t_FeatureProperties;
};
