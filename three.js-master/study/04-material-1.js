import * as THREE from '../build/three.module.js'
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
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
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        const vertices = [
            -1, 1, 0,
            1, 1, 0,
            -1, -1, 0,
            1, -1, 0
        ]
  
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

        // const material = new THREE.LineBasicMaterial({
        //     color: 0xff0000
        // });

        const material = new THREE.LineDashedMaterial({
            color: 0xffff00,
            dashSize: 0.2,
            gapSize: 0.1,
            scale: 1
        });

        // const line = new THREE.Line(geometry, material);
        // const line = new THREE.LineSegments(geometry, material);
        const line = new THREE.LineLoop(geometry, material);
        line.computeLineDistances();
        this._scene.add(line);
    }

    // _setupModel() {
    //     const vertices = [];
    //     for (let i = 0; i < 10000; i++) {
    //         const x = THREE.MathUtils.randFloatSpread(5);
    //         const y = THREE.MathUtils.randFloatSpread(5);
    //         const z = THREE.MathUtils.randFloatSpread(5);

    //         vertices.push(x, y, z);
    //     }

    //     const geometry = new THREE.BufferGeometry();
    //     geometry.setAttribute(
    //         "position",
    //         new THREE.Float32BufferAttribute(vertices, 3)
    //     )

    //     const sprite = new THREE.TextureLoader().load(
    //         "../examples/textures/sprites/disc.png"
    //     );

    //     const material = new THREE.PointsMaterial({
    //         map: sprite,
    //         alphaTest: 0.5,
    //         color: 0xff0000,
    //         size: 0.1,
    //         sizeAttenuation: true
    //     });

    //     const points = new THREE.Points(geometry, material);
    //     this._scene.add(points);
    // }

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
    }
}

window.onload = function() {
    new App();
}