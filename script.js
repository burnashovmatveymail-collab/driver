const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0x87ceeb, 0.0005);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 300, 100);
scene.add(dirLight);

const planeGeo = new THREE.PlaneGeometry(100000, 100000);
const planeMat = new THREE.MeshLambertMaterial({ color: 0x2e8b57 });
const ground = new THREE.Mesh(planeGeo, planeMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grid = new THREE.GridHelper(100000, 1000, 0x1e5b37, 0x1e5b37);
grid.position.y = 0.1;
scene.add(grid);

const airplane = new THREE.Group();
scene.add(airplane);

const cockpitGeo = new THREE.BoxGeometry(1.2, 1.2, 3);
const cockpitMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
const cockpitMesh = new THREE.Mesh(cockpitGeo, cockpitMat);
cockpitMesh.position.set(0, 0, 0);
airplane.add(cockpitMesh);

const wingGeo = new THREE.BoxGeometry(10, 0.1, 1.5);
const wingMat = new THREE.MeshLambertMaterial({ color: 0x777777 });
const wings = new THREE.Mesh(wingGeo, wingMat);
wings.position.set(0, 0, 0.5);
airplane.add(wings);

airplane.position.set(0, 1.5, 0);

camera.position.set(0, 0.4, 0.2);
airplane.add(camera);

let throttle = 0;
let forwardSpeed = 0;
let pitchSpeed = 0;
let yawSpeed = 0;
let rollSpeed = 0;

let wheelTurn = 0;
let leftBrake = 1;
let rightBrake = 1;

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});

window.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        pitchSpeed += e.movementY * 0.00008;
        yawSpeed -= e.movementX * 0.00008;
    }
});

function updatePhysics() {
    if (keys['w']) throttle = Math.min(100, throttle + 0.5);
    if (keys['s']) throttle = Math.max(0, throttle - 0.5);

    leftBrake = keys['v'] ? 0.2 : 1.0;
    rightBrake = keys['m'] ? 0.2 : 1.0;

    wheelTurn = 0;
    if (keys['b']) wheelTurn += 0.02;
    if (keys['n']) wheelTurn -= 0.02;

    const targetSpeed = (throttle / 100) * 120;
    const brakeEffect = (leftBrake + rightBrake) / 2;
    forwardSpeed += (targetSpeed * brakeEffect - forwardSpeed) * 0.02;

    const isGrounded = airplane.position.y <= 1.51;

    if (isGrounded) {
        airplane.position.y = 1.5;
        if (pitchSpeed < 0 && forwardSpeed < 40) {
            pitchSpeed = 0;
        }
        
        yawSpeed += wheelTurn * (forwardSpeed / 100);
        
        if (leftBrake !== rightBrake) {
            yawSpeed += (rightBrake - leftBrake) * 0.01 * (forwardSpeed / 50);
        }
    } else {
        airplane.position.y += Math.sin(airplane.rotation.x) * forwardSpeed * 0.05;
    }

    pitchSpeed *= 0.92;
    yawSpeed *= 0.92;

    airplane.rotateX(pitchSpeed);
    airplane.rotateY(yawSpeed);

    airplane.translateZ(-forwardSpeed * 0.05);

    ground.position.x = airplane.position.x;
    ground.position.z = airplane.position.z;
    grid.position.x = airplane.position.x;
    grid.position.z = airplane.position.z;

    document.getElementById('throttle').textContent = Math.round(throttle);
    document.getElementById('speed').textContent = Math.round(forwardSpeed * 3);
    document.getElementById('alt').textContent = Math.round(airplane.position.y - 1.5);
}

function animate() {
    requestAnimationFrame(animate);
    updatePhysics();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
