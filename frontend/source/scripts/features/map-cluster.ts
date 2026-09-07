import { lowerOverlayStack, raiseOverlayStack } from './map-overlay-stack';

// Create DOM for a cluster badge (.map-cluster) with hoverable, clickable member list
export function createClusterElement(
  features: t_ClustererFeature[],
  onMemberClick: (feature: t_ClustererFeature) => void,
): HTMLElement {
  const el = document.createElement('div');
  el.className = 'map-cluster';

  const count = features.length;
  const minPrice = Math.min(...features.map((f) => f.properties.price));
  const priceMln = (minPrice / 1_000_000).toFixed(1);

  // One-line badge + hover popup listing all members
  el.innerHTML = `
    <div class="map-cluster__badge">
      <span class="map-cluster__count">${count}</span>
      <span class="map-cluster__price">from ${priceMln} mln</span>
    </div>
    <div class="map-cluster__hover">
      <ul class="map-cluster__list"></ul>
    </div>
  `;

  const list = el.querySelector('.map-cluster__list');
  if (list) {
    for (const feature of features) {
      const item = document.createElement('li');
      item.className = 'map-cluster__item';
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.innerHTML = `
        <span class="map-cluster__item-name">${feature.properties.name}</span>
        <span class="map-cluster__item-price">${feature.properties.caption}</span>
      `;

      // Zoom to this member; do not bubble to cluster zoom-all
      const selectMember = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        onMemberClick(feature);
      };

      item.addEventListener('mousedown', (event) => event.stopPropagation());
      item.addEventListener('mouseup', (event) => event.stopPropagation());
      item.addEventListener('click', selectMember);
      item.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          selectMember(event);
        }
      });

      list.appendChild(item);
    }
  }

  // Lift whole marker host chain while hover popup is open
  el.addEventListener('mouseenter', () => raiseOverlayStack(el));
  el.addEventListener('mouseleave', () => lowerOverlayStack(el));

  return el;
}
