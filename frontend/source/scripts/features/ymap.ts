import { convertFeatures } from './feature-utils';
import { createClusterElement, createMarkerElement } from './map-dom';

let clustererInstance: { update: (opts: { features: t_ClustererFeature[] }) => void } | null = null;

// Wait for ymaps3 global from CDN script
function waitForYmaps3(timeoutMs = 8000): Promise<NonNullable<typeof window.ymaps3>> {
  return new Promise((resolve, reject) => {
    if (window.ymaps3) {
      resolve(window.ymaps3);
      return;
    }

    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.ymaps3) {
        window.clearInterval(timer);
        resolve(window.ymaps3);
        return;
      }

      if (Date.now() - started > timeoutMs) {
        window.clearInterval(timer);
        reject(new Error('Timeout waiting for ymaps3'));
      }
    }, 100);
  });
}

// Load Yandex Maps v3 script tag
function loadYmapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.ymaps3) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=en_US`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));
    document.head.appendChild(script);
  });
}

// Init map with clusterer
export async function initYMap(
  container: HTMLElement,
  collection: t_FeatureCollection,
  onMarkerClick: (id: string) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

  if (!apiKey) {
    container.innerHTML = '<p class="map__placeholder">Set VITE_YANDEX_MAPS_API_KEY in .env to load the map.</p>';
    return;
  }

  await loadYmapsScript(apiKey);
  const ymaps3 = await waitForYmaps3();
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapFeatureDataSource, YMapLayer, YMapMarker } = ymaps3;

  const ymaps3Api = ymaps3 as typeof ymaps3 & {
    import: {
      registerCdn: (template: string, packages: string[]) => void;
      (pkg: string): Promise<Record<string, unknown>>;
    };
  };

  ymaps3Api.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', [
    '@yandex/ymaps3-clusterer@0.0.1',
  ]);

  const clustererModule = (await ymaps3Api.import('@yandex/ymaps3-clusterer')) as {
    YMapClusterer: new (opts: Record<string, unknown>) => {
      update: (opts: { features: t_ClustererFeature[] }) => void;
    };
    clusterByGrid: (opts: { gridSize: number }) => unknown;
  };

  const { YMapClusterer, clusterByGrid } = clustererModule;

  const map = new YMap(container, {
    location: { center: [37.62, 55.75], zoom: 10 },
  });

  map.addChild(new YMapDefaultSchemeLayer({}));
  const source = new YMapFeatureDataSource({ id: 'marker-source' });
  map.addChild(source);
  map.addChild(new YMapLayer({ source: 'marker-source', type: 'markers', zIndex: 1800 }));

  const features = convertFeatures(collection);

  const clusterer = new YMapClusterer({
    method: clusterByGrid({ gridSize: 64 }),
    features,
    marker: (feature: t_ClustererFeature) =>
      new YMapMarker(
        {
          coordinates: feature.geometry.coordinates,
          source: 'marker-source',
          onClick: () => onMarkerClick(String(feature.id)),
        },
        createMarkerElement(feature.properties),
      ),
    cluster: (coordinates: number[], clusterFeatures: t_ClustererFeature[]) => {
      const minPrice = Math.min(...clusterFeatures.map((f) => f.properties.price));
      return new YMapMarker(
        { coordinates, source: 'marker-source' },
        createClusterElement(clusterFeatures.length, minPrice),
      );
    },
  });

  map.addChild(clusterer);
  clustererInstance = clusterer;

  window.updateMap = (data: t_FeatureCollection) => {
    const converted = convertFeatures(data);
    clusterer.update({ features: converted });

    if (converted.length > 0) {
      const lngs = converted.map((f) => f.geometry.coordinates[0]);
      const lats = converted.map((f) => f.geometry.coordinates[1]);
      map.setLocation({
        bounds: [
          [Math.min(...lngs) - 0.05, Math.min(...lats) - 0.05],
          [Math.max(...lngs) + 0.05, Math.max(...lats) + 0.05],
        ],
      });
    }
  };
}

// Public update helper
export function updateMapFeatures(collection: t_FeatureCollection): void {
  window.updateMap?.(collection);
}
