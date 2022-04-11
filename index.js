import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { PLYLoader } from './PLYLoader.js'

const plyListCar = [
    "./ply/input/car_417_pc.ply",
    "./ply/atlas/car_417_pc_recon.ply",
    "./ply/topnet/car_417_pc_recon.ply",
    "./ply/pointface/car_417_pc_recon.ply",
    "./ply/grnet/car_417_pc_recon.ply",
    "./ply/pctma/car_417_pc_recon.ply",
    "./ply/gt/car_417_gt.ply"
];
const plyListCoach = [
    "./ply/input/coach_614_pc.ply",
    "./ply/atlas/coach_614_pc_recon.ply",
    "./ply/topnet/coach_614_pc_recon.ply",
    "./ply/pointface/coach_614_pc_recon.ply",
    "./ply/grnet/coach_614_pc_recon.ply",
    "./ply/pctma/coach_614_pc_recon.ply",
    "./ply/gt/coach_614_gt.ply"
];
const plyListPlane = [
    "./ply/input/plane_356_pc.ply",
    "./ply/atlas/plane_356_pc_recon.ply",
    "./ply/topnet/plane_356_pc_recon.ply",
    "./ply/pointface/plane_356_pc_recon.ply",
    "./ply/grnet/plane_356_pc_recon.ply",
    "./ply/pctma/plane_356_pc_recon.ply",
    "./ply/gt/plane_356_gt.ply"
];
const plyListWatercraft = [
    "./ply/input/watercraft_12_pc.ply",
    "./ply/atlas/watercraft_12_pc_recon.ply",
    "./ply/topnet/watercraft_12_pc_recon.ply",
    "./ply/pointface/watercraft_12_pc_recon.ply",
    "./ply/grnet/watercraft_12_pc_recon.ply",
    "./ply/pctma/watercraft_12_pc_recon.ply",
    "./ply/gt/watercraft_12_gt.ply"
];
const plyList = [plyListCar, plyListCoach, plyListPlane, plyListWatercraft];
const plyNames = ["Car", "Sofa", "Plane", "Watercraft"];
const descriptionList = [
    "Input",
    "AtlasNet",
    "TopNet",
    "PointFACENet",
    "GrNet",
    "PCTMA-Net",
    "GroundTruth"
];
const scenes = [];
var canvas;
var renderer;

init();
animate();

function init() {
    canvas = document.getElementById("c");
    var content = document.getElementById('content');
    
    for (var k = 0; k < plyList.length; ++k) {
        const object = document.createElement('div');
        object.className = 'object';
        object.id = plyNames[k];
    
        for (var i = 0; i < descriptionList.length; ++i) {
            const scene = new THREE.Scene();

            const element = document.createElement('div');
            element.className = 'algorithm';
            element.id = descriptionList[i];
            object.appendChild(element);

            const sceneElement = document.createElement('div');
            sceneElement.className = 'scene';
            sceneElement.title = plyNames[k] + ' (' + descriptionList[i] + ')';
            element.appendChild(sceneElement);
    
            const descriptionElement = document.createElement('div');
            descriptionElement.className = 'caption';
            descriptionElement.innerText = descriptionList[i];
            element.appendChild(descriptionElement);
    
            scene.userData.element = sceneElement;
    
            const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
            camera.position.z = 2;
            scene.userData.camera = camera;
    
            const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
            controls.minDistance = 2;
            controls.maxDistance = 5;
            controls.enablePan = false;
            controls.enableZoom = false;
            scene.userData.controls = controls;
    
            const loader = new PLYLoader();
            loader.load(plyList[k][i], function (geometry) {
                var material = new THREE.PointsMaterial({
                    color: 0xff0000,
                    size: 0.005,
                    opacity: 1,
                    //blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    //map: generateSprite()
                });
                const points = new THREE.Points(geometry, material);
                points.scale.set(1.5, 1.5, 1.5);
                scene.add(points);
                scenes.push(scene);
            });
        }
        
        content.appendChild(object);
    }
    
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
}

function animate() {
    render();
    requestAnimationFrame(animate);
}

function render() {
    updateSize();

    const transform = `translateY(${window.scrollY}px)`;
    canvas.style.transform = transform;
    renderer.domElement.style.transform = transform;
    renderer.setClearColor(window.getComputedStyle(document.body).getPropertyValue('--color-background'));
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setClearColor(window.getComputedStyle(document.body).getPropertyValue('--color-background-01'));
    renderer.setScissorTest(true);

    scenes.forEach(function (scene) {
        scene.children[0].rotation.y = Date.now() * 0.001;
        const element = scene.userData.element;
        const rect = element.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
            return;
        }

        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);

        const camera = scene.userData.camera;

        renderer.render(scene, camera);
    });
}

function updateSize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
    }
}
