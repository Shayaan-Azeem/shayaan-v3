import { Box3, Matrix4, Vector3 } from 'three';

// Measure visible geometry in camera space so asymmetric parts stay centered.
export function projectedCenter(model, camera) {
  const bounds = new Box3(), transform = new Matrix4(), point = new Vector3();
  model.updateWorldMatrix(true, true);
  model.traverseVisible(object => {
    const geometry = object.geometry;
    if (!geometry?.attributes.position) return;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox;
    transform.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
    for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) {
      bounds.expandByPoint(point.set(x, y, z).applyMatrix4(transform));
    }
  });
  return bounds.getCenter(new Vector3());
}
