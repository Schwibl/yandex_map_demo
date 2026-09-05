import { calculateBounds, convertFeatures } from './feature-utils';
import { createClusterElement } from './map-cluster';
import { createMarkerElement } from './map-marker';

// Module refs for updateMap
let mapInstance: {
  addChild: (child: unknown) => void;
  setLocation: (opts: { bounds: number[][]; duration?: number }) => void;
  setMargin?: (margins: [number, number, number, number]) => void;
  container?: { offsetWidth: number };
} | null = null;

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

// Load Yandex Maps v3 script tag (api key from env)
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

// Fit viewport to features with sidebar-aware margins
function fitMapToFeatures(features: t_ClustererFeature[]): void {
  if (!mapInstance || features.length === 0) {
    return;
  }

  const width = mapInstance.container?.offsetWidth ?? 0;
  if (width > 0 && mapInstance.setMargin) {
    // Leave room for sidebar on the left [top, right, bottom, left]
    const leftMargin = Math.round(width / 3);
    const rightMargin = Math.round(width / 12);
    mapInstance.setMargin([0, rightMargin, 0, leftMargin]);
  }

  mapInstance.setLocation({
    bounds: calculateBounds(features),
    duration: 300,
  });
}

// updateMap — refresh clusterer + fit bounds (also on window for CMWP-style callers)
function updateMap(newFeaturesData: t_FeatureCollection): void {
  if (!clustererInstance || !mapInstance) {
    console.warn('[YMap] Cannot update map: not initialized');
    return;
  }

  const converted = convertFeatures(newFeaturesData);
  clustererInstance.update({ features: converted });
  fitMapToFeatures(converted);
}

// Init map with layers + grid clusterer
export async function initYMap(
  container: HTMLElement,
  collection: t_FeatureCollection,
  onMarkerClick: (id: string) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim();

  if (!apiKey) {
    container.innerHTML =
      '<p class="map__placeholder">Set VITE_YANDEX_MAPS_API_KEY in .env to load the map.</p>';
    return;
  }

  try {
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

    // Clusterer package is not in the base API — load from jsDelivr
    ymaps3Api.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}/dist/index.js', [
      '@yandex/ymaps3-clusterer@0.0.1',
    ]);

    const clustererModule = (await ymaps3Api.import('@yandex/ymaps3-clusterer@0.0.1')) as {
      YMapClusterer: new (opts: Record<string, unknown>) => {
        update: (opts: { features: t_ClustererFeature[] }) => void;
      };
      clusterByGrid: (opts: { gridSize: number }) => unknown;
    };

    const { YMapClusterer, clusterByGrid } = clustererModule;

    const map = new YMap(container, {
      location: { center: [37.62, 55.75], zoom: 10 },
    });

    mapInstance = map as typeof mapInstance;
    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapFeatureDataSource({ id: 'marker-source' }));
    map.addChild(new YMapLayer({ source: 'marker-source', type: 'markers', zIndex: 1800 }));

    const features = convertFeatures(collection);

    // Marker renderer — custom DOM pin
    const markerRender = (feature: t_ClustererFeature) =>
      new YMapMarker(
        {
          coordinates: feature.geometry.coordinates,
          source: 'marker-source',
          onClick: () => onMarkerClick(String(feature.id)),
        },
        createMarkerElement(feature.properties),
      );

    // Cluster renderer — count + min price badge
    const clusterRender = (coordinates: number[], clusterFeatures: t_ClustererFeature[]) => {
      const minPrice = Math.min(...clusterFeatures.map((f) => f.properties.price));
      return new YMapMarker(
        { coordinates, source: 'marker-source' },
        createClusterElement(clusterFeatures.length, minPrice),
      );
    };

    const clusterer = new YMapClusterer({
      method: clusterByGrid({ gridSize: 64 }),
      features,
      marker: markerRender,
      cluster: clusterRender,
    });

    map.addChild(clusterer);
    clustererInstance = clusterer;
    window.updateMap = updateMap;

    // Initial fit so all pins are in view
    fitMapToFeatures(features);
  } catch (error) {
    console.error('[YMap] Error initializing map:', error);
    container.innerHTML =
      '<p class="map__placeholder">Map failed to load. Check the API key and console.</p>';
  }
}

// Typed wrapper used from main.ts
export function updateMapFeatures(collection: t_FeatureCollection): void {
  updateMap(collection);
}
