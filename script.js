const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
sunLight.position.set(500, 1000, 500);
scene.add(sunLight);

function createGridTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2d8a4e';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#38a85e';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
}

const groundTexture = createGridTexture();
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(2000, 2000);

const planeGeo = new THREE.PlaneGeometry(200000, 200000);
const planeMat = new THREE.MeshLambertMaterial({ map: groundTexture });
const ground = new THREE.Mesh(planeGeo, planeMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const airplane = new THREE.Group();
scene.add(airplane);

const bodyGeo = new THREE.ConeGeometry(0.8, 5, 16);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
const fuselage = new THREE.Mesh(bodyGeo, bodyMat);
fuselage.rotation.x = Math.PI / 2;
airplane.add(fuselage);

const wingGeo = new THREE.BoxGeometry(8, 0.05, 1.5);
const wingMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const wings = new THREE.Mesh(wingGeo, wingMat);
wings.position.set(0, 0, 0.5);
airplane.add(wings);

airplane.position.set(0, 1.5, 0);

camera.position.set(0, 0.4, -0.1);
airplane.add(camera);

let throttle = 0;
let forwardSpeed = 0;
let pitchSpeed = 0;
let yawSpeed = 0;

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === 'ArrowUp') {
        throttle = Math.min(100, throttle + 10);
    }
    if (e.key === 'ArrowDown') {
        throttle = Math.max(0, throttle - 10);
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
});

window.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        pitchSpeed += e.movementY * 0.000005;
        yawSpeed -= e.movementX * 0.000005;
    }
});

function update() {
    if (keys['w']) throttle = Math.min(100, throttle + 0.5);
    if (keys['s']) throttle = Math.max(0, throttle - 0.5);

    let leftBrake = keys['v'] ? 0.0 : 1.0;
    let rightBrake = keys['m'] ? 0.0 : 1.0;

    let wheelTurn = 0;
    if (keys['b']) wheelTurn += 0.008;
    if (keys['n']) wheelTurn -= 0.008;

    const maxSpeed = 600;
    const targetSpeed = (throttle / 100) * maxSpeed;
    const brakeFactor = (leftBrake + rightBrake) / 2;

    forwardSpeed += (targetSpeed * brakeFactor - forwardSpeed) * 0.05;

    const isGrounded = airplane.position.y <= 1.51;

    if (isGrounded) {
        airplane.position.y = 1.5;
        airplane.rotation.x = 0;
        airplane.rotation.z = 0;

        if (pitchSpeed < 0 && forwardSpeed < 100) {
            pitchSpeed = 0;
        }

        yawSpeed += wheelTurn * (forwardSpeed / 200);

        if (leftBrake !== rightBrake) {
            yawSpeed += (rightBrake - leftBrake) * 0.002 * (forwardSpeed / 100);
        }
    } else {
        airplane.position.y += Math.sin(airplane.rotation.x) * forwardSpeed * 0.02;
    }

    pitchSpeed *= 0.90;
    yawSpeed *= 0.90;

    airplane.rotateX(pitchSpeed);
    airplane.rotateY(yawSpeed);

    airplane.translateZ(-forwardSpeed * 0.02);

    ground.position.x = airplane.position.x;
    ground.position.z = airplane.position.z;

    const pitchDegrees = Math.round((airplane.rotation.x * 180) / Math.PI);
    const altitude = Math.round(airplane.position.y - 1.5);

    document.getElementById('throttle').textContent = Math.round(throttle);
    document.getElementById('speed').textContent = Math.round(forwardSpeed);
    document.getElementById('alt-val').textContent = altitude;
    document.getElementById('pitch-val').textContent = pitchDegrees;
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
