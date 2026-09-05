/// <reference path="./map-feature.d.ts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    ymaps3?: {
      ready: Promise<void>;
      import: (pkg: string) => Promise<Record<string, unknown>>;
      import: {
        registerCdn: (template: string, packages: string[]) => void;
        (pkg: string): Promise<Record<string, unknown>>;
      };
      YMap: new (container: HTMLElement, opts: { location: { center: number[]; zoom: number } }) => {
        addChild: (child: unknown) => void;
        setLocation: (opts: { bounds: number[][] }) => void;
      };
      YMapDefaultSchemeLayer: new (opts: Record<string, unknown>) => unknown;
      YMapFeatureDataSource: new (opts: { id: string }) => unknown;
      YMapLayer: new (opts: { source: string; type: string; zIndex: number }) => unknown;
      YMapMarker: new (opts: Record<string, unknown>, element: HTMLElement) => unknown;
    };
    updateMap?: (features: t_FeatureCollection) => void;
  }
}

export {};
