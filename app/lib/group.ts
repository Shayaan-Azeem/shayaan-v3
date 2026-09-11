/** Groups items by a string key, preserving the order each key first appears. */
export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string,
): Array<[string, T[]]> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }

  return [...groups];
}
