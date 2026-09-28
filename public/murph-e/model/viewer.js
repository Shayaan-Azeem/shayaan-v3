import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { clamp, separation } from './motion.js';
import { createCRT } from './crt.js';

const tellParent = (type) => {
  document.body.dataset.murpheStatus = type === 'murphe-ready' ? 'ready' : 'error';
  parent.postMessage({ type }, location.origin);
};
let renderer, model, manifest, disposed = false, ready = false, progress = 0, frame = 0;
let crt, visible = true, suspended = false, animation = 0, lastPaint = 0;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const parts = [];
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.01, 50);
const center = new THREE.Vector3(0.08, 1.27, 0.12);

function draw() {
  frame = 0;
  if (!model || disposed || suspended || document.hidden) return;
  for (const part of parts) part.object.position.copy(part.offset).multiplyScalar(separation(progress, part.group));
  const angle = -0.65 + progress * 0.16;
  camera.position.set(center.x + Math.sin(angle) * 7, center.y + 2.9, center.z + Math.cos(angle) * 7);
  camera.lookAt(center);
  camera.updateMatrixWorld();
  const width = Math.max(1, innerWidth), height = Math.max(1, innerHeight), aspect = width / height;
  const size = renderer.getSize(new THREE.Vector2());
  if (size.x !== width || size.y !== height) renderer.setSize(width, height, false);
  // Fit the complete exploded bounds, keeping the framing steady as parts move.
  let extentX = 0, extentY = 0;
  const { min, max } = manifest.bounds;
  for (const x of [min[0], max[0]]) for (const y of [min[1], max[1]]) for (const z of [min[2], max[2]]) {
    const point = new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse);
    extentX = Math.max(extentX, Math.abs(point.x));
    extentY = Math.max(extentY, Math.abs(point.y));
  }
  const halfHeight = Math.max(extentY, extentX / aspect) * 1.07;
  camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
  camera.top = halfHeight; camera.bottom = -halfHeight;
  camera.updateProjectionMatrix();
  if (crt) crt.uniforms.time.value = motion.matches ? 0 : performance.now() / 1000;
  renderer.render(scene, camera);
  document.body.dataset.progress = progress.toFixed(3);
}

function schedule() { if (!frame && !disposed && !suspended) frame = requestAnimationFrame(draw); }
function animate(time) {
  animation = 0;
  if (disposed || suspended || !crt || !visible || document.hidden || motion.matches) return;
  if (time - lastPaint >= 1000 / 24) { lastPaint = time; schedule(); }
  animation = requestAnimationFrame(animate);
}
function syncAnimation() {
  cancelAnimationFrame(animation);
  animation = 0;
  schedule();
  if (crt && visible && !disposed && !suspended && !document.hidden && !motion.matches) animation = requestAnimationFrame(animate);
}
function receive(event) {
  if (event.source !== parent || event.origin !== location.origin) return;
  if (event.data?.type === 'murphe-init') {
    if (ready && !disposed) tellParent('murphe-ready');
    return;
  }
  if (event.data?.type !== 'murphe-progress') return;
  if (!Number.isFinite(event.data.progress)) return;
  progress = clamp(event.data.progress);
  visible = event.data.visible !== false;
  syncAnimation();
}
function hidePage(event) {
  if (!event.persisted) { dispose(); return; }
  // BFCache keeps this document alive; pause without destroying its WebGL state.
  suspended = true;
  cancelAnimationFrame(frame);
  cancelAnimationFrame(animation);
  frame = animation = 0;
}
function showPage(event) {
  if (!event.persisted || disposed) return;
  suspended = false;
  syncAnimation();
}
function dispose() {
  if (disposed) return;
  disposed = true;
  cancelAnimationFrame(frame);
  cancelAnimationFrame(animation);
  window.removeEventListener('message', receive);
  window.removeEventListener('resize', schedule);
  window.removeEventListener('pagehide', hidePage);
  window.removeEventListener('pageshow', showPage);
  document.removeEventListener('visibilitychange', syncAnimation);
  motion.removeEventListener('change', syncAnimation);
  const materials = new Set(), textures = new Set(), geometries = new Set();
  scene.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of [].concat(object.material || [])) materials.add(material);
  });
  if (crt) materials.add(crt);
  for (const material of materials) {
    for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    for (const uniform of Object.values(material.uniforms || {})) if (uniform.value?.isTexture) textures.add(uniform.value);
  }
  for (const texture of textures) { texture.source?.data?.close?.(); texture.dispose(); }
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
  renderer?.dispose();
  renderer?.forceContextLoss();
}

window.addEventListener('message', receive);
window.addEventListener('resize', schedule);
document.addEventListener('visibilitychange', syncAnimation);
motion.addEventListener('change', syncAnimation);
window.addEventListener('pagehide', hidePage);
window.addEventListener('pageshow', showPage);

try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.setAttribute('aria-label', 'Three-dimensional arcade assembly');
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    tellParent('murphe-error');
    dispose();
  }, { once: true });
  document.body.append(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6dbe0, 2.05));
  const key = new THREE.DirectionalLight(0xffffff, 2.25); key.position.set(-4, 7, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8ebef, 0.7); fill.position.set(4, 2, -3); scene.add(fill);
  // Start independent downloads together and collect all resources before cleanup.
  const [assemblyResult, modelResult, crtResult] = await Promise.allSettled([
    fetch('./assembly.json').then(response => {
      if (!response.ok) throw new Error('Assembly data unavailable');
      return response.json();
    }),
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('./arcade-machine-diagram.glb'),
    createCRT(),
  ]);
  if (modelResult.status === 'fulfilled') { model = modelResult.value.scene; scene.add(model); }
  if (crtResult.status === 'fulfilled') crt = crtResult.value;
  else console.warn('CRT image unavailable:', crtResult.reason);
  if (assemblyResult.status === 'rejected') throw assemblyResult.reason;
  if (modelResult.status === 'rejected') throw modelResult.reason;
  manifest = assemblyResult.value;
  if (crt) model.traverse(object => {
    if (object.isMesh && (object.name.startsWith('Curved_CRT_glass') || object.parent?.name.startsWith('Curved_CRT_glass'))) object.material = crt;
  });
  if (disposed) { disposed = false; dispose(); }
  else {
    model.traverse(object => {
      if (object.userData?.explodedOffset) parts.push({ object, group: object.userData.group, offset: new THREE.Vector3(...object.userData.explodedOffset) });
      if (object.isMesh) for (const material of [].concat(object.material)) {
        material.polygonOffset = true; material.polygonOffsetFactor = 1; material.polygonOffsetUnits = 1;
      }
    });
    draw();
    syncAnimation();
    ready = true;
    tellParent('murphe-ready');
  }
} catch (error) {
  console.error('Murph-E diagram:', error);
  tellParent('murphe-error');
  dispose();
}
