import '../styles/main.scss';

import { filterByDistrict } from './features/feature-utils';
import { initYMap, updateMapFeatures } from './features/ymap';
import { mountMapSidebar, rerenderMapSidebar } from './blocks/map-sidebar';

// App state
let fullCollection: t_FeatureCollection = { type: 'FeatureCollection', features: [] };
let filteredCollection: t_FeatureCollection = fullCollection;
let selectedId: string | null = null;
let sidebarSlot: HTMLElement | null = null;

// Unique district list for filter chips
function getDistricts(collection: t_FeatureCollection): string[] {
  const set = new Set(collection.features.map((f) => f.properties.district));
  return Array.from(set).sort();
}

// Refresh sidebar + map from current filter
function syncUi(): void {
  if (!sidebarSlot) {
    return;
  }

  rerenderMapSidebar(sidebarSlot, {
    districts: getDistricts(fullCollection),
    features: filteredCollection,
    selectedId,
    onFilter: (district) => {
      filteredCollection = filterByDistrict(fullCollection, district);
      selectedId = null;
      updateMapFeatures(filteredCollection);
      syncUi();
    },
    onSelect: (feature) => {
      selectedId = feature?.id ?? null;
      syncUi();
    },
  });
}

// Bootstrap page layout
async function bootstrap(): Promise<void> {
  const root = document.querySelector<HTMLElement>('#app');
  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="catalogue-page catalogue-page--map-view">
      <header class="catalogue-page__header">
        <h1 class="catalogue-page__title">Warehouse map demo</h1>
        <button type="button" class="catalogue-page__toggle" data-action="toggle-map">Toggle map width</button>
      </header>
      <div class="catalogue-page__layout">
        <div class="map-sidebar-slot"></div>
        <div class="map map--visible">
          <div class="map__container"></div>
        </div>
      </div>
    </div>
  `;

  sidebarSlot = root.querySelector<HTMLElement>('.map-sidebar-slot');
  const mapContainer = root.querySelector<HTMLElement>('.map__container');
  const toggleBtn = root.querySelector<HTMLButtonElement>('[data-action="toggle-map"]');
  const page = root.querySelector<HTMLElement>('.catalogue-page');

  toggleBtn?.addEventListener('click', () => {
    page?.classList.toggle('catalogue-page--map-wide');
  });

  const response = await fetch('/data/features.json');
  fullCollection = (await response.json()) as t_FeatureCollection;
  filteredCollection = fullCollection;

  if (sidebarSlot) {
    mountMapSidebar(sidebarSlot, {
      districts: getDistricts(fullCollection),
      features: filteredCollection,
      selectedId,
      onFilter: (district) => {
        filteredCollection = filterByDistrict(fullCollection, district);
        selectedId = null;
        updateMapFeatures(filteredCollection);
        syncUi();
      },
      onSelect: (feature) => {
        selectedId = feature?.id ?? null;
        syncUi();
      },
    });
  }

  if (mapContainer) {
    await initYMap(mapContainer, filteredCollection, (id) => {
      selectedId = id;
      syncUi();
    });
  }
}

void bootstrap();
