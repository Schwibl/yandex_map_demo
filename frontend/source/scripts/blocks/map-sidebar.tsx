import { render } from 'preact';
import { useState } from 'preact/hooks';

// Props from main.ts shared state
type t_SidebarProps = {
  districts: string[];
  features: t_FeatureCollection;
  onFilter: (district: string | null) => void;
  onSelect: (feature: t_MapFeature | null) => void;
  selectedId: string | null;
};

// Preact island — district chips, list, selection card (no map API here)
function MapSidebar({ districts, features, onFilter, onSelect, selectedId }: t_SidebarProps) {
  const [activeDistrict, setActiveDistrict] = useState<string>('all');

  const selected = features.features.find((f) => f.id === selectedId) ?? null;

  return (
    <aside class="map-sidebar">
      <h2 class="map-sidebar__title">Catalogue</h2>
      <div class="map-sidebar__filters">
        <button
          type="button"
          class={`map-sidebar__chip ${activeDistrict === 'all' ? 'map-sidebar__chip--active' : ''}`}
          onClick={() => {
            setActiveDistrict('all');
            onFilter(null);
          }}
        >
          All
        </button>
        {districts.map((d) => (
          <button
            type="button"
            key={d}
            class={`map-sidebar__chip ${activeDistrict === d ? 'map-sidebar__chip--active' : ''}`}
            onClick={() => {
              setActiveDistrict(d);
              onFilter(d);
            }}
          >
            {d}
          </button>
        ))}
      </div>
      <ul class="map-sidebar__list">
        {features.features.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              class={`map-sidebar__item ${selectedId === f.id ? 'map-sidebar__item--active' : ''}`}
              onClick={() => onSelect(f)}
            >
              <span class="map-sidebar__item-name">{f.properties.name}</span>
              <span class="map-sidebar__item-price">{f.properties.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {selected ? (
        <div class="map-sidebar__card">
          <h3 class="map-sidebar__card-title">{selected.properties.name}</h3>
          <p class="map-sidebar__card-addr">{selected.properties.addr}</p>
          <p class="map-sidebar__card-price">{selected.properties.caption}</p>
        </div>
      ) : null}
    </aside>
  );
}

// First mount into catalogue-page__sidebar slot
export function mountMapSidebar(slot: HTMLElement, props: t_SidebarProps): void {
  render(<MapSidebar {...props} />, slot);
}

// Re-render after filter / selection changes
export function rerenderMapSidebar(slot: HTMLElement, props: t_SidebarProps): void {
  render(<MapSidebar {...props} />, slot);
}
