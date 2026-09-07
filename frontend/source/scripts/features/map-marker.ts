import { lowerOverlayStack, raiseOverlayStack } from './map-overlay-stack';

// Demo property rows for the detail card (deterministic from name)
function buildGenericProps(properties: t_FeatureProperties): { label: string; value: string }[] {
  let hash = 0;
  for (let i = 0; i < properties.name.length; i += 1) {
    hash = (hash + properties.name.charCodeAt(i) * (i + 1)) % 997;
  }

  const area = 900 + (hash % 1100);
  const ceiling = 6 + (hash % 5);
  const docks = 2 + (hash % 7);
  const warehouseClass = ['A', 'B+', 'B'][hash % 3];
  const year = 2008 + (hash % 16);

  return [
    { label: 'Address', value: properties.addr },
    {
      label: 'District',
      value: properties.district.charAt(0).toUpperCase() + properties.district.slice(1),
    },
    { label: 'Price', value: properties.caption },
    { label: 'Area', value: `${area.toLocaleString('en-US')} m²` },
    { label: 'Ceiling', value: `${ceiling} m` },
    { label: 'Loading docks', value: String(docks) },
    { label: 'Class', value: warehouseClass },
    { label: 'Built', value: String(year) },
  ];
}

// Build detail property list markup
function buildPropsMarkup(properties: t_FeatureProperties): string {
  return buildGenericProps(properties)
    .map(
      (row) => `
      <div class="map-marker__prop">
        <dt class="map-marker__prop-label">${row.label}</dt>
        <dd class="map-marker__prop-value">${row.value}</dd>
      </div>`,
    )
    .join('');
}

// Only one detail popup open at a time across markers
let openMarkerEl: HTMLElement | null = null;

// Close any open marker detail popup
export function closeOpenMarkerPopup(): void {
  if (!openMarkerEl) {
    return;
  }

  openMarkerEl.classList.remove('map-marker--open');
  lowerOverlayStack(openMarkerEl);
  openMarkerEl = null;
}

// Dismiss detail when pointer goes outside the open marker
function onOutsidePointerDown(event: PointerEvent): void {
  if (!openMarkerEl) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  // Clicks on the pin or open card stay inside this marker
  if (openMarkerEl.contains(target)) {
    return;
  }

  closeOpenMarkerPopup();
}

document.addEventListener('pointerdown', onOutsidePointerDown, true);

// Toggle detail popup on a marker; closes the previous open one
export function toggleMarkerDetail(el: HTMLElement): void {
  const alreadyOpen = el.classList.contains('map-marker--open');
  closeOpenMarkerPopup();

  if (!alreadyOpen) {
    el.classList.add('map-marker--open');
    raiseOverlayStack(el, '10001');
    openMarkerEl = el;
  }
}

// Create DOM for a single map marker (.map-marker) — ring pin + hover + detail
export function createMarkerElement(properties: t_FeatureProperties): HTMLElement {
  const el = document.createElement('div');
  el.className = 'map-marker';

  // Pin always visible; hover = basic; detail = wider card with image + props
  el.innerHTML = `
    <div class="map-marker__hover">
      <p class="map-marker__title">${properties.name}</p>
      <p class="map-marker__price">${properties.caption}</p>
    </div>
    <div class="map-marker__detail">
      <img class="map-marker__image" src="/images/warehouse.svg" alt="" width="320" height="180" />
      <div class="map-marker__detail-body">
        <p class="map-marker__title">${properties.name}</p>
        <p class="map-marker__price">${properties.caption}</p>
        <dl class="map-marker__props">
          ${buildPropsMarkup(properties)}
        </dl>
      </div>
    </div>
    <div class="map-marker__pin"></div>
  `;

  // Keep hover popup above neighboring markers while pointer is over this pin
  el.addEventListener('mouseenter', () => {
    if (!el.classList.contains('map-marker--open')) {
      raiseOverlayStack(el);
    }
  });
  el.addEventListener('mouseleave', () => {
    if (!el.classList.contains('map-marker--open')) {
      lowerOverlayStack(el);
    }
  });

  // Clicks inside the open card should not toggle it closed via marker onClick
  const detail = el.querySelector('.map-marker__detail');
  detail?.addEventListener('mousedown', (event) => event.stopPropagation());
  detail?.addEventListener('click', (event) => event.stopPropagation());

  return el;
}
