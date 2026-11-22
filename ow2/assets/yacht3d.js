// Menachem's Yacht, rebuilt block by block from the server world, spinning on the homepage.
// Hovering grows it a little and slows the spin.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const box = document.getElementById('yacht3d');
const link = box && box.closest('a');
if (box) start().catch(() => box.classList.add('fallback'));

async function start() {
  const data = await (await fetch('/assets/yacht-model.json')).json();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  box.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 2000);
  scene.add(new THREE.AmbientLight(0xffffff, 0.9)); scene.add(new THREE.HemisphereLight(0xffffff, 0x8899bb, 3.0));
  const sun = new THREE.DirectionalLight(0xffffff, 1.8); sun.position.set(60, 120, 40); scene.add(sun);

  const ship = new THREE.Group();
  scene.add(ship);
  const pal = data.pal.map(c => new THREE.Color(c));
  const geos = {
    cube: new THREE.BoxGeometry(1, 1, 1),
    slab: new THREE.BoxGeometry(1, 0.5, 1).translate(0, -0.25, 0),
    carpet: new THREE.BoxGeometry(1, 0.08, 1).translate(0, -0.46, 0),
    glass: new THREE.BoxGeometry(1, 1, 1),
  };
  const m = new THREE.Matrix4();
  for (const kind of ['cube', 'slab', 'carpet', 'glass']) {
    const list = data[kind]; if (!list || !list.length) continue;
    const mat = kind === 'glass' ? new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.45 }) : new THREE.MeshLambertMaterial();
    const mesh = new THREE.InstancedMesh(geos[kind], mat, list.length);
    list.forEach(([x, y, z, c], i) => { m.makeTranslation(x, y + 0.5, z); mesh.setMatrixAt(i, m); mesh.setColorAt(i, pal[c]); });
    ship.add(mesh);
  }
  const bb = new THREE.Box3().setFromObject(ship), size = bb.getSize(new THREE.Vector3()), mid = bb.getCenter(new THREE.Vector3());
  ship.children.forEach(c => c.position.sub(mid));
  const radius = Math.max(size.x, size.z) * 0.62;
  camera.position.set(0, radius * 0.5, radius * 1.9);
  camera.lookAt(0, -size.y * 0.05, 0);

  function fit() {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(fit).observe(box); fit();

  let hover = false, speed = 0.45, scale = 1;
  const on = () => hover = true, off = () => hover = false;
  (link || box).addEventListener('mouseenter', on); (link || box).addEventListener('mouseleave', off);
  (link || box).addEventListener('focus', on); (link || box).addEventListener('blur', off);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now();
  ship.rotation.y = -0.6;
  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    speed += ((hover ? 0.12 : 0.45) - speed) * Math.min(1, dt * 4);
    scale += ((hover ? 1.18 : 1) - scale) * Math.min(1, dt * 6);
    if (!still) ship.rotation.y += speed * dt;
    ship.scale.setScalar(scale);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  box.classList.add('ready');
}
