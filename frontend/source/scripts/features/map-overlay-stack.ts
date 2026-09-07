// Raise/lower Yandex marker host chain so hover popups stack above siblings

type t_StackEntry = { node: HTMLElement; prev: string };

const raisedByRoot = new WeakMap<HTMLElement, t_StackEntry[]>();

// Lift marker DOM + parents so overlays paint above neighboring markers
export function raiseOverlayStack(el: HTMLElement, zIndex = '10000'): void {
  lowerOverlayStack(el);

  const raised: t_StackEntry[] = [];
  let node: HTMLElement | null = el;
  let depth = 0;

  while (node && depth < 8) {
    raised.push({ node, prev: node.style.zIndex });
    node.style.zIndex = zIndex;
    node = node.parentElement;
    depth += 1;
  }

  raisedByRoot.set(el, raised);
}

// Restore z-index values set by raiseOverlayStack
export function lowerOverlayStack(el: HTMLElement): void {
  const raised = raisedByRoot.get(el);
  if (!raised) {
    return;
  }

  for (const { node, prev } of raised) {
    node.style.zIndex = prev;
  }

  raisedByRoot.delete(el);
}
