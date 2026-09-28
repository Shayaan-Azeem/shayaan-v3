import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, OrthographicCamera, Vector3 } from 'three';
import { projectedCenter } from '../public/murph-e/model/framing.js';

function screenBounds(model, camera) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  model.traverseVisible(object => {
    const positions = object.geometry?.attributes.position;
    if (!positions) return;
    for (let i = 0; i < positions.count; i++) {
      const p = new Vector3().fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld).project(camera);
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    }
  });
  return { minX, maxX, minY, maxY };
}

test('camera framing centers asymmetric assemblies through movement and viewport changes', () => {
  const model = new Group(), moving = new Group();
  const material = new MeshBasicMaterial();
  const cabinet = new Mesh(new BoxGeometry(0.8, 2, 0.8), material);
  cabinet.position.y = 1;
  const artwork = new Mesh(new BoxGeometry(0.7, 0.9, 0.03), material);
  artwork.position.set(0, 0.5, 0.45);
  moving.add(artwork); model.add(cabinet, moving);
  const camera = new OrthographicCamera(-2, 2, 2, -2, 0.01, 50);
  for (const progress of [0, 0.4, 1, 0.4, 0]) {
    moving.position.set(progress * 0.65, 0, progress * 0.25);
    const angle = -0.65 + progress * 0.16;
    camera.position.set(Math.sin(angle) * 7, 4, Math.cos(angle) * 7);
    camera.lookAt(0.08, 1.27, 0.12); camera.updateMatrixWorld();
    const center = projectedCenter(model, camera);
    for (const aspect of [672 / 688, 350 / 760, 900 / 450]) {
      camera.left = center.x - 2 * aspect; camera.right = center.x + 2 * aspect;
      camera.top = center.y + 2; camera.bottom = center.y - 2;
      camera.updateProjectionMatrix();
      const bounds = screenBounds(model, camera);
      assert.ok(Math.abs(bounds.minX + bounds.maxX) < 1e-7, 'equal horizontal margins');
      assert.ok(Math.abs(bounds.minY + bounds.maxY) < 1e-7, 'equal vertical margins');
      assert.ok(Math.max(...Object.values(bounds).map(Math.abs)) < 1, 'all parts fit');
    }
  }
  cabinet.geometry.dispose(); artwork.geometry.dispose(); material.dispose();
});
