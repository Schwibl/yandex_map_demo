// Create DOM for single map marker
export function createMarkerElement(properties: t_FeatureProperties): HTMLElement {
  const el = document.createElement('div');
  el.className = 'map-marker';
  el.innerHTML = `
    <div class="map-marker__card">
      <p class="map-marker__title">${properties.name}</p>
      <p class="map-marker__price">${properties.caption}</p>
    </div>
    <div class="map-marker__pin"></div>
  `;
  return el;
}

// Create DOM for cluster badge
export function createClusterElement(count: number, minPrice: number): HTMLElement {
  const el = document.createElement('div');
  el.className = 'map-cluster';
  const priceMln = (minPrice / 1_000_000).toFixed(1);
  el.innerHTML = `
    <span class="map-cluster__count">${count}</span>
    <span class="map-cluster__price">from ${priceMln} mln</span>
  `;
  return el;
}
