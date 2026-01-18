import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";

let scene, camera, renderer, particles;
let geometry, material;
const clock = new THREE.Clock();

init();
animate();

function init() {
  const container = document.getElementById("three-bg");

  // SCENE
  scene = new THREE.Scene();

  // CAMERA (slightly closer than last)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 4; // medium distance

  // RENDERER
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // GEOMETRY
  geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const count = 8000;

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.PI * 2 * Math.random();
    const r = 1.4 + Math.random() * 0.15; // slightly bigger radius

    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    // LIGHT GRAPE COLOR
    colors.push(
      0.8 + Math.random() * 0.1, // red
      0.5 + Math.random() * 0.1, // green
      0.9 + Math.random() * 0.05 // blue
    );
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  // MATERIAL
  material = new THREE.PointsMaterial({
    size: 0.018, // slightly bigger particles
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  window.addEventListener("resize", onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  const pos = geometry.attributes.position.array;

  for (let i = 0; i < pos.length; i += 3) {
    pos[i] += 0.0012 * Math.sin(time + pos[i + 1] * 4);
    pos[i + 1] += 0.0012 * Math.sin(time + pos[i + 2] * 4);
    pos[i + 2] += 0.0012 * Math.sin(time + pos[i] * 4);
  }

  geometry.attributes.position.needsUpdate = true;

  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0004;

  renderer.render(scene, camera);
}
