export function clamp(value) { return Math.max(0, Math.min(1, value)); }

export function scrollProgress(top, height, panelHeight, inset = 16) {
  return clamp((inset - top) / Math.max(1, height - panelHeight));
}

export function separation(progress, group) {
  const start = group === 'display' ? 0.25 : group === 'control-board' ? 0.4 : 0;
  const t = clamp((progress - start) / (1 - start));
  return t * t * (3 - 2 * t);
}
