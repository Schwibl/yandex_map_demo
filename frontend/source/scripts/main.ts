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

// Switch catalogue between map and list layout modifiers
function setPageView(page: HTMLElement, mapEl: HTMLElement, mode: 'map' | 'list'): void {
  const isMap = mode === 'map';
  page.classList.toggle('catalogue-page--map-view', isMap);
  page.classList.toggle('catalogue-page--list-view', !isMap);
  mapEl.classList.toggle('map--visible', isMap);

  // Sync shared button active + pressed state
  page.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((btn) => {
    const pressed = btn.dataset.view === mode;
    btn.classList.toggle('button--active', pressed);
    btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  });
}

// Phones open the list when the map cannot load; desktop still shows the placeholder pane
function initialView(): 'map' | 'list' {
  const keyMissing = !import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim();
  if (keyMissing && window.matchMedia('(max-width: 768px)').matches) {
    return 'list';
  }
  return 'map';
}

// Bootstrap page layout shell (map + sidebar slot)
async function bootstrap(): Promise<void> {
  const root = document.querySelector<HTMLElement>('#app');
  if (!root) {
    return;
  }

  const view = initialView();
  const mapFirst = view === 'map';

  root.innerHTML = `
    <div class="catalogue-page catalogue-page--${view}-view">
      <header class="catalogue-page__header">
        <h1 class="catalogue-page__title">Warehouse map demo</h1>
        <div class="catalogue-page__view-toggles">
          <button type="button" class="button button--with-text${mapFirst ? ' button--active' : ''}" data-view="map" aria-pressed="${mapFirst ? 'true' : 'false'}">Map</button>
          <button type="button" class="button button--with-text${mapFirst ? '' : ' button--active'}" data-view="list" aria-pressed="${mapFirst ? 'false' : 'true'}">List</button>
        </div>
      </header>
      <main class="catalogue-page__layout">
        <div class="catalogue-page__sidebar"></div>
        <div class="map${mapFirst ? ' map--visible' : ''}">
          <div class="map__container"></div>
        </div>
      </main>
    </div>
  `;

  sidebarSlot = root.querySelector<HTMLElement>('.catalogue-page__sidebar');
  const mapEl = root.querySelector<HTMLElement>('.map');
  const mapContainer = root.querySelector<HTMLElement>('.map__container');
  const page = root.querySelector<HTMLElement>('.catalogue-page');

  // Wire map / list view toggles
  page?.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!page || !mapEl) {
        return;
      }
      const mode = btn.dataset.view === 'list' ? 'list' : 'map';
      setPageView(page, mapEl, mode);
    });
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
