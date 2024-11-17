import * as THREE from '../build/three.module.js'
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from '../examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from '../examples/jsm/helpers/RectAreaLightHelper.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        divContainer.appendChild(renderer.domElement);
        
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        // camera.position.z = 2;
        camera.position.set(7, 7, 0);
        camera.lookAt(0, 0, 0);

        this._camera = camera;
    }

    _setupLight() {
        const auxLight = new THREE.DirectionalLight(0xffffff, 0.5);
        auxLight.position.set(0, 5, 0);
        auxLight.target.position.set(0, 0, 0);
        this._scene.add(auxLight.target);
        this._scene.add(auxLight);
/*
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(0, 5, 0);
        light.target.position.set(0, 0, 0);
        this._scene.add(light.target);

        // 그림자 짤림 현상 수정
        light.shadow.camera.top = light.shadow.camera.right = 6
        light.shadow.camera.bottom = light.shadow.camera.left = -6
*/
/*
        const light = new THREE.PointLight(0xffffff, 10);
        light.position.set(0, 5, 0);
*/
        const light = new THREE.SpotLight(0xffffff, 150);
        light.position.set(0, 5, 0);
        light.target.position.set(0, 0, 0);
        light.angle = THREE.MathUtils.degToRad(30);
        light.penumbra = 0.2;
        this._scene.add(light.target)

        // 그림자 품질 향상, 기본 = 512
        light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;

        // 그림자 외곽 블러링
        light.shadow.radius = 1;

        const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        this._scene.add(cameraHelper);
        
        this._scene.add(light);
        this._light = light;
        light.castShadow = true;
    }

    _setupModel() {
        // add ground
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = THREE.MathUtils.degToRad(-90);
        ground.receiveShadow = true;
        this._scene.add(ground);

        // add big sphere
        // const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64, 2, 3);
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2
        });
        const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
        // bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
        bigSphere.position.y = 1.6
        bigSphere.receiveShadow = true;
        bigSphere.castShadow = true;
        this._scene.add(bigSphere);

        // add torus, add torusPivot
        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0.5,
            metalness: 0.9
        });

        for (let i = 0; i < 8; i++) {
            const torusPivot = new THREE.Object3D();
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
            torus.position.set(3, 0.5, 0);
            torusPivot.add(torus);
            torus.receiveShadow = true;
            torus.castShadow = true;
            this._scene.add(torusPivot);
        }

        // add smallSphere, smallSperePivot
        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#e74c3c",
            roughness: 0.2,
            metalness: 0.5
        });
        const smallSpherePivot = new THREE.Object3D();
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot";
        smallSphere.position.set(3, 0.5, 0);
        smallSphere.receiveShadow = true;
        smallSphere.castShadow = true;
        this._scene.add(smallSpherePivot);
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001;
        const smallSperePivot = this._scene.getObjectByName("smallSpherePivot");
        if(smallSperePivot) {
            smallSperePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);

            if(this._light.target) {
                const smallSphere = smallSperePivot.children[0];
                smallSphere.getWorldPosition(this._light.target.position);

                if(this._lightHelper) {
                    this._lightHelper.update();
                }
            }

            if (this._light instanceof THREE.PointLight) {
                const smallSphere = smallSperePivot.children[0];
                smallSphere.getWorldPosition(this._light.position);
            }
        }
    }
}

window.onload = function() {
    new App();
}