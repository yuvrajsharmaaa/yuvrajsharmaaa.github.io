// Import dependencies
import * as THREE from 'three';
import { gsap } from 'gsap';

// Main.js - Fixed to work with CDN imports

// Initialize renderer with proper settings
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Detect if mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Get canvas container
var container = document.getElementById('canvas-container');
if (!container) {
  console.error('Canvas container not found!');
} else {
  // Clear any existing canvas
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(renderer.domElement);
}

if (window.innerWidth > 800) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.needsUpdate = true;
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
// Adjust camera position based on device
if (isMobile) {
  camera.position.set(0, 15, 20); // Move camera further back on mobile
} else {
  camera.position.set(0, 10, 10);
}
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, -1);

var scene = new THREE.Scene();
var city = new THREE.Object3D();
var smoke = new THREE.Object3D();
var town = new THREE.Object3D();

var createCarPos = true;
var uSpeed = isMobile ? 0.1 : 0.5; // Slower rotation on mobile

// Use a teal color like in the image (0x00e5e5)
var setcolor = 0x00e5e5;

scene.background = new THREE.Color(0x001F2E);
scene.fog = new THREE.Fog(0x001F2E, 10, 16);

function mathRandom(num = 0) {
  var numValue = -Math.random() * num + Math.random() * num;
  return numValue;
}

// Function to create different building colors
function getBuildingColor() {
  // Return primarily black buildings with occasional dark variants
  if (Math.random() > 0.85) {
    return 0x111111;
  }
  return 0x000000;
}

function init() {
  var segments = 2;
  
  // Reduce number of buildings on mobile
  var buildingCount = isMobile ? 40 : 120;
  
  // Create buildings with better layout
  for (var i = 1; i < buildingCount; i++) {
    // Vary building heights and shapes more dramatically
    var height = 0.8 + Math.abs(mathRandom(0.5));
    var width = 1 + mathRandom(0.5);
    var depth = 0.8 + Math.abs(mathRandom(0.5));
    
    var geometry = new THREE.BoxGeometry(width, height, depth, segments, segments, segments);

    var material = new THREE.MeshStandardMaterial({
      color: getBuildingColor(),
      wireframe: false,
      opacity: 0.9,
      roughness: 0.6,
      metalness: 0.2,
      flatShading: true,
      side: THREE.DoubleSide
    });

    var wmaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide
    });

    var cube = new THREE.Mesh(geometry, material);
    var floor = new THREE.Mesh(geometry, material);
    var wfloor = new THREE.Mesh(geometry, wmaterial);

    cube.add(wfloor);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotationValue = 0.1 + Math.abs(mathRandom(isMobile ? 4 : 8)); // Reduce rotation on mobile

    floor.scale.y = 0.05;
    
    // Create taller buildings with better scaling
    var buildingHeight = 0.1 + Math.abs(mathRandom(4)) * 2;
    cube.scale.y = buildingHeight;

    // Better distribution of buildings in a grid pattern
    var gridSize = 12;
    var gridSpacing = 1.2;
    var row = Math.floor(i / gridSize) - Math.floor(gridSize / 2);
    var col = (i % gridSize) - Math.floor(gridSize / 2);
    
    // Add slight random offset to grid positions
    cube.position.x = col * gridSpacing + mathRandom(0.3);
    cube.position.z = row * gridSpacing + mathRandom(0.3);

    floor.position.set(cube.position.x, 0, cube.position.z);

    town.add(floor);
    town.add(cube);
  }

  // Reduce particles on mobile
  var particleCount = isMobile ? 100 : 300;
  for (var h = 1; h < particleCount; h++) {
    // Atmospheric particles
    var gmaterial = new THREE.MeshToonMaterial({color: 0xFFFF00, side: THREE.DoubleSide});
    var gparticular = new THREE.CircleGeometry(0.01, 3);
    var aparticular = 5;

    var particular = new THREE.Mesh(gparticular, gmaterial);
    particular.position.set(mathRandom(aparticular), mathRandom(aparticular), mathRandom(aparticular));
    particular.rotation.set(mathRandom(), mathRandom(), mathRandom());
    smoke.add(particular);
  }

  // Ground plane
  var pmaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    roughness: 10,
    metalness: 0.6,
    opacity: 0.9,
    shininess: 50,
    transparent: true
  });
  var pgeometry = new THREE.PlaneGeometry(60, 60);
  var pelement = new THREE.Mesh(pgeometry, pmaterial);
  pelement.rotation.x = -90 * Math.PI / 180;
  pelement.position.y = -0.001;
  pelement.receiveShadow = true;

  city.add(pelement);
}

var mouse = new THREE.Vector2();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouse.x = event.touches[0].pageX - window.innerWidth / 2;
    mouse.y = event.touches[0].pageY - window.innerHeight / 2;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouse.x = event.touches[0].pageX - window.innerWidth / 2;
    mouse.y = event.touches[0].pageY - window.innerHeight / 2;
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchstart', onDocumentTouchStart, false);
window.addEventListener('touchmove', onDocumentTouchMove, false);

// Adjust lighting for mobile
var ambientLight = new THREE.AmbientLight(0xFFFFFF, isMobile ? 3 : 4);
var lightFront = new THREE.SpotLight(0xFFFFFF, isMobile ? 15 : 20, 10);
var lightBack = new THREE.PointLight(0xFFFFFF, 0.5);

lightFront.rotation.x = 45 * Math.PI / 180;
lightFront.rotation.z = -45 * Math.PI / 180;
lightFront.position.set(5, 5, 5);
lightFront.castShadow = true;
lightFront.shadow.mapSize.width = 6000;
lightFront.shadow.mapSize.height = lightFront.shadow.mapSize.width;
lightFront.penumbra = 0.1;
lightBack.position.set(0, 6, 0);
smoke.position.y = 2;

// Added colored point lights for enhanced atmosphere
var tealLight = new THREE.PointLight(0x00ffff, 2, 12);
tealLight.position.set(-5, 3, -5);
scene.add(tealLight);

scene.add(ambientLight);
city.add(lightFront);
scene.add(lightBack);
scene.add(city);
city.add(smoke);
city.add(town);

// Make grid helper less visible
var gridHelper = new THREE.GridHelper(60, 20, 0x009999, 0x004444);
gridHelper.position.y = -0.1;
city.add(gridHelper);

// Create cars function using GSAP
var createCars = function(cScale = 2, cPos = 20, cColor = 0xFFFF00) {
  var cMat = new THREE.MeshToonMaterial({color: cColor, side: THREE.DoubleSide});
  var cGeo = new THREE.BoxGeometry(1, cScale/40, cScale/40);
  var cElem = new THREE.Mesh(cGeo, cMat);
  var cAmp = 3;

  if (createCarPos) {
    createCarPos = false;
    cElem.position.x = -cPos;
    cElem.position.z = (mathRandom(cAmp));

    gsap.to(cElem.position, {
      x: cPos, 
      duration: 3, 
      repeat: -1, 
      yoyo: true, 
      delay: mathRandom(3)
    });
  } else {
    createCarPos = true;
    cElem.position.x = (mathRandom(cAmp));
    cElem.position.z = -cPos;
    cElem.rotation.y = 90 * Math.PI / 180;

    gsap.to(cElem.position, {
      z: cPos, 
      duration: 5, 
      repeat: -1, 
      yoyo: true, 
      delay: mathRandom(3),
      ease: "power1.inOut"
    });
  }

  cElem.receiveShadow = true;
  cElem.castShadow = true;
  cElem.position.y = Math.abs(mathRandom(5));
  city.add(cElem);
};

// Reduce number of cars on mobile
var generateLines = function() {
  for (var i = 0; i < (isMobile ? 30 : 60); i++) {
    createCars(0.1, 20);
  }
};

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Ensure city exists before animating
  if (city) {
    var rotationSpeed = uSpeed * (isMobile ? 0.0005 : 0.002);
    city.rotation.y += rotationSpeed;
    
    if (isMobile) {
      city.rotation.x += mouse.y * 0.00002;
      city.rotation.z += mouse.x * 0.00002;
    } else {
      city.rotation.x += mouse.y * 0.0001;
      city.rotation.z += mouse.x * 0.0001;
    }
    
    city.position.y = Math.sin(Date.now() * (isMobile ? 0.0002 : 0.001)) * (isMobile ? 0.002 : 0.01);
  }
  
  renderer.render(scene, camera);
}

// Initialize and start animation
window.addEventListener('load', function() {
  init();
  generateLines();
  animate();
});

// Handle window resize
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false); 