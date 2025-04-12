// Initialize Three.js scene with proper configuration
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  alpha: true, // Enable transparency
  antialias: true // Smoother edges
});

// Setup renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Create a more interesting geometry
const geometry = new THREE.IcosahedronGeometry(1.5, 2);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x7fcfff,
  metalness: 0.3,
  roughness: 0.2,
  emissive: 0x004444
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Add proper lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

camera.position.z = 5;

// Add starfield background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xFFFFFF,
  size: 0.02
});
const starsVertices = [];
for (let i = 0; i < 1000; i++) {
  starsVertices.push(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.005;
  stars.rotation.y += 0.0005;
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();