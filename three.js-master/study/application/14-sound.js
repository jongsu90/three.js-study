import * as THREE from '/build/three.module.js';
import { OrbitControls } from "/examples/jsm/controls/OrbitControls.js"
import { PositionalAudioHelper } from "/examples/jsm/helpers/PositionalAudioHelper.js"

class App {
    constructor() {
        this._setupThreeJs();
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupEvents();        
    }

    _setupThreeJs() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.z = 10;
        this._camera = camera;
    }

    _setupLight() {
        this._scene.add(new THREE.AmbientLight(0xffffff, 0.2));

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-0.8, 1, -0.5);
        this._scene.add(light);
    }

    _setupModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});
        const cube = new THREE.Mesh(geometry, material);
        
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load("../data/sound/Forest Lullabye - Asher Fulero.mp3", (buffer) => {
            const listener = new THREE.AudioListener();
            this._camera.add(listener);

            const audio = new THREE.PositionalAudio(listener);
            audio.offset = 1;
            // 소리 감쇠가 발생하지 않는 거리
            audio.setRefDistance(5);

            const coneInnerAngle = 90;
            const coneOuterAngle = 300; 
            // coneOuterGain = 0 ~ 1
            const coneOuterGain = 0; 
            audio.setDirectionalCone(coneInnerAngle, coneOuterAngle, coneOuterGain);

            // 5 크기로 helper 생성
            const helper = new PositionalAudioHelper(audio, 5);
            audio.add(helper);

            audio.setBuffer(buffer);
            cube.add(audio);
            this._scene.add(cube);

            window.onclick = () => {
                if(!audio.isPlaying) audio.play();
            };
        });
    }

    _setupControls() {
        this._orbitControls = new OrbitControls(this._camera, this._divContainer);
    }

    _setupEvents() {
        window.onresize = this.resize.bind(this);
        this.resize();

        this._clock = new THREE.Clock();
        requestAnimationFrame(this.render.bind(this));
    }

    update() {
        const delta = this._clock.getDelta();
        this._orbitControls.update();
    }

    render() {
        this._renderer.render(this._scene, this._camera);   
        this.update();

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}