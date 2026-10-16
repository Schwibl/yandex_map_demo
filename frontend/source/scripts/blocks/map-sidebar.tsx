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

// District keys in the JSON are lowercase; the chip shows a label
function districtLabel(district: string): string {
  return district.charAt(0).toUpperCase() + district.slice(1);
}

// "4 warehouses" — singular only when the filter leaves one row
function warehouseCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'warehouse' : 'warehouses'}`;
}

// Shared button class list for filter chips (domain verbs keep text)
function chipClass(isActive: boolean): string {
  return [
    'button',
    'button--chip',
    'button--transparent',
    'button--with-text',
    isActive ? 'button--active' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

// Shared button + layout hook for catalogue list rows
function itemClass(isActive: boolean): string {
  return [
    'button',
    'button--transparent',
    'button--with-text',
    'map-sidebar__item',
    isActive ? 'button--active' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

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
          class={chipClass(activeDistrict === 'all')}
          aria-pressed={activeDistrict === 'all' ? 'true' : 'false'}
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
            class={chipClass(activeDistrict === d)}
            aria-pressed={activeDistrict === d ? 'true' : 'false'}
            onClick={() => {
              setActiveDistrict(d);
              onFilter(d);
            }}
          >
            {districtLabel(d)}
          </button>
        ))}
      </div>
      <p class="map-sidebar__count" aria-live="polite">
        {warehouseCountLabel(features.features.length)}
      </p>
      <ul class="map-sidebar__list">
        {features.features.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              class={itemClass(selectedId === f.id)}
              aria-pressed={selectedId === f.id ? 'true' : 'false'}
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
