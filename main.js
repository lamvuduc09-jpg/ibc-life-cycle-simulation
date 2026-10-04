import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// ==========================
// 1. SCENE
// ==========================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xbfd8e8);


// ==========================
// 2. CAMERA
// ==========================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(5, 4, 6);


// ==========================
// 3. RENDERER
// ==========================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);


// ==========================
// 4. CAMERA CONTROL
// ==========================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.target.set(0, 1, 0);

// ==========================
// 5. LIGHT
// ==========================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);


const sunLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

sunLight.position.set(5, 10, 5);

scene.add(sunLight);


// ==========================
// 6. GROUND
// ==========================

const groundGeometry = new THREE.PlaneGeometry(
    20,
    20
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// ==========================
// 7. TEST OBJECT
// ==========================


// ==========================
// LOAD IBC 3D MODEL
// ==========================
let ibcModel = null;
const loader = new GLTFLoader();


    loader.load(
    './models/ibc.glb',

    function (gltf) {

        const ibc = gltf.scene;
        ibcModel = ibc;
        // Scale IBC
ibc.scale.set(2, 2, 2);

// Tính kích thước của model
const box = new THREE.Box3().setFromObject(ibc);

// Tìm điểm thấp nhất của model
const minY = box.min.y;

// Đưa đáy IBC đúng xuống mặt đất Y = 0
ibc.position.y -= minY;

// Đặt IBC vào giữa scene
ibc.position.x = 0;
ibc.position.z = 0;

// Thêm vào scene
scene.add(ibc);

        console.log("IBC loaded successfully!");
    },

    function (xhr) {
        console.log(
            (xhr.loaded / xhr.total * 100) + "% loaded"
        );
    },

    function (error) {
        console.error("Error loading IBC:", error);
    }
);
// ==========================
// IBC CLICK INTERACTION
// ==========================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', function (event) {

    // Chuyển vị trí chuột sang tọa độ Three.js
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Bắn tia từ camera qua vị trí chuột
    raycaster.setFromCamera(mouse, camera);

    if (ibcModel) {

        const intersects = raycaster.intersectObject(
            ibcModel,
            true
        );

        // Nếu click trúng IBC
        if (intersects.length > 0) {

            document.getElementById(
                'info-panel'
            ).style.display = 'block';

        }
    }
});


// ==========================
// CLOSE INFORMATION PANEL
// ==========================

document
    .getElementById('close-panel')
    .addEventListener('click', function (event) {

        event.stopPropagation();

        document.getElementById(
            'info-panel'
        ).style.display = 'none';

    });
// ==========================
// 8. GRID
// ==========================

const grid = new THREE.GridHelper(
    20,
    20
);

scene.add(grid);


// ==========================
// 9. ANIMATION
// ==========================

function animate() {

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

renderer.setAnimationLoop(animate);


// ==========================
// 10. WINDOW RESIZE
// ==========================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);