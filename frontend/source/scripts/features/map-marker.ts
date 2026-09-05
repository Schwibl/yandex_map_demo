// Create DOM for a single map marker (.map-marker)
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
