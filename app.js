const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0).normalize();
scene.add(directionalLight);

// Function to create planets with textures
function createPlanet(textureURL, size, position, name) {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({ map: textureLoader.load(textureURL) });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(position.x, position.y, position.z);
  planet.name = name;
  scene.add(planet);
  return planet;
}

// Create the sun and planets
createPlanet('assets/sun_texture.jpg', 0.7, { x: 0, y: 0, z: 0 }, 'Sun');
const mercury = createPlanet('assets/mercury_texture.jpg', 0.3, { x: 1, y: 0, z: 0 }, 'Mercury');
const venus = createPlanet('assets/venus_texture.jpg', 0.5, { x: 1.5, y: 0, z: 0 }, 'Venus');
const earth = createPlanet('assets/earth_texture.jpg', 0.5, { x: 2, y: 0, z: 0 }, 'Earth');
const mars = createPlanet('assets/mars_texture.jpg', 0.4, { x: 2.5, y: 0, z: 0 }, 'Mars');
const jupiter = createPlanet('assets/jupiter_texture.jpg', 0.6, { x: 3.5, y: 0, z: 0 }, 'Jupiter');
const saturn = createPlanet('assets/saturn_texture.jpg', 0.5, { x: 4.5, y: 0, z: 0 }, 'Saturn');
const uranus = createPlanet('assets/uranus_texture.jpg', 0.5, { x: 5.5, y: 0, z: 0 }, 'Uranus');
const neptune = createPlanet('assets/neptune_texture.jpg', 0.5, { x: 6.5, y: 0, z: 0 }, 'Neptune');

// Function to create orbit paths
function createOrbit(radius) {
  const curve = new THREE.EllipseCurve(
    0, 0, // x and y center
    radius, radius, // x and y radii
    0, 2 * Math.PI, // start and end angles
    false // counterclockwise
  );
  const points = curve.getPoints(64);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const orbit = new THREE.Line(geometry, material);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
}

// Create orbits for each planet
createOrbit(1);
createOrbit(1.5);
createOrbit(2);
createOrbit(2.5);
createOrbit(3.5);
createOrbit(4.5);
createOrbit(5.5);
createOrbit(6.5);

let angle = 0;

// Interaction with raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

const infoDiv = document.getElementById('info');

function showPlanetInfo(planet) {
  if (planet.geometry && planet.geometry.parameters) {
    infoDiv.innerHTML = `${planet.name} info: Diameter - ${planet.geometry.parameters.radius * 2}`;
    infoDiv.style.display = 'block';
  } else {
    infoDiv.style.display = 'none';
  }
}

function checkIntersections() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    showPlanetInfo(intersects[0].object);
  } else {
    infoDiv.style.display = 'none';
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  angle += 0.01;

  // Update planet positions for orbits
  mercury.position.x = Math.cos(angle) * 1;
  mercury.position.z = Math.sin(angle) * 1;

  venus.position.x = Math.cos(angle * 0.8) * 1.5;
  venus.position.z = Math.sin(angle * 0.8) * 1.5;

  earth.position.x = Math.cos(angle * 0.6) * 2;
  earth.position.z = Math.sin(angle * 0.6) * 2;

  mars.position.x = Math.cos(angle * 0.5) * 2.5;
  mars.position.z = Math.sin(angle * 0.5) * 2.5;

  jupiter.position.x = Math.cos(angle * 0.3) * 3.5;
  jupiter.position.z = Math.sin(angle * 0.3) * 3.5;

  saturn.position.x = Math.cos(angle * 0.2) * 4.5;
  saturn.position.z = Math.sin(angle * 0.2) * 4.5;

  uranus.position.x = Math.cos(angle * 0.15) * 5.5;
  uranus.position.z = Math.sin(angle * 0.15) * 5.5;

  neptune.position.x = Math.cos(angle * 0.1) * 6.5;
  neptune.position.z = Math.sin(angle * 0.1) * 6.5;

  checkIntersections();
  renderer.render(scene, camera);
}

animate();

// Add camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
camera.position.z = 10;

// Responsive design
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to create labels for planets
function createLabel(text, position) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '32px Arial';
  context.fillStyle = 'white';
  context.fillText(text, 0, 40);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(position.x, position.y + 0.5, position.z);
  scene.add(sprite);
}

// Create labels for each planet
createLabel('Mercury', mercury.position);
createLabel('Venus', venus.position);
createLabel('Earth', earth.position);
createLabel('Mars', mars.position);
createLabel('Jupiter', jupiter.position);
createLabel('Saturn', saturn.position);
createLabel('Uranus', uranus.position);
createLabel('Neptune', neptune.position);

// Fetch NEO data and create labels
const apiKey = 'DEMO_KEY'; // Replace with your actual API key
const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`; // Closing quotation mark added

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // ... (rest of your code to process NEO data)
  })
  .catch(error => console.error('Error fetching data:', error));