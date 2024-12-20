// import * as THREE from '/build/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.118.0/build/three.module.js';
import { OrbitControls } from "/examples/jsm/controls/OrbitControls.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true }); // alpha는 기본값이 false
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        //renderer.setClearColor("#ff0000", 0.1); // 두번째 인자의 기본값은 1
        //scene.background = new THREE.Color("#9b59b6");
        //scene.fog = new THREE.Fog("#9b59b6", 0, 150);
        //scene.fog = new THREE.FogExp2("#9b59b6", 0.01);

        this._setupCamera();
        this._setupLight();
        this._setupBackground();
        //this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    // https://www.humus.name/index.php?page=Textures&start=56
    _setupBackground() {
        const loader = new THREE.CubeTextureLoader();
        loader.load([
            "../data/Maskonaive2/posx.jpg",
            "../data/Maskonaive2/negx.jpg", 
            "../data/Maskonaive2/posy.jpg",
            "../data/Maskonaive2/negy.jpg",
            "../data/Maskonaive2/posz.jpg",
            "../data/Maskonaive2/negz.jpg"
        ], cubeTexture => {
            this._scene.background = cubeTexture;
            this._setupModel();
        });
    }

    _setupModel() {
        const geometry = new THREE.SphereBufferGeometry(1);

        const pmremG = new THREE.PMREMGenerator(this._renderer);
        const renderTarget = pmremG.fromCubemap(this._scene.background);
        // .fromEquirectangular(this._scene.background); // 똑 같은데?
        
        const material1 = new THREE.MeshStandardMaterial({
            color: "#2ecc71",
            roughness: 0,
            metalness: 1,
            envMap: renderTarget.texture
        });

        const material2 = new THREE.MeshStandardMaterial({
            color: "#e74c3c",
            roughness: 0,
            metalness: 1,
            envMap: renderTarget.texture
        });

        const rangeMin = -20.0, rangeMax = 20.0;
        const gap = 10.0;
        let flag = true;
        for (let x = rangeMin; x <= rangeMax; x += gap) {
            for (let y = rangeMin; y <= rangeMax; y += gap) {
                for (let z = rangeMin*10; z <= rangeMax; z += gap) {
                    flag = !flag;

                    const mesh = new THREE.Mesh(geometry, flag ? material1 : material2);

                    mesh.position.set(x, y, z);

                    this._scene.add(mesh);
                }
            }
        }
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 40;

        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1.0;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 1, 1);
        this._scene.add(light);
    }

    update(time) {
        time *= 0.001; // second unit
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);

        const backgroundTexture = this._scene.background;
        if(backgroundTexture) {
            const divAspect = width / height;
            const img = backgroundTexture.image;
            const bgAspect = img.width / img.height;
            const aspect = bgAspect / divAspect;

            backgroundTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
            backgroundTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
            backgroundTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
            backgroundTexture.repeat.y = aspect > 1 ? 1 : aspect;
        }
    }
}

window.onload = function () {
    new App();
}