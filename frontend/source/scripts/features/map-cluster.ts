// Create DOM for a cluster badge (.map-cluster)
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
