import * as THREE from '/build/three.module.js';
import { OrbitControls } from "/examples/jsm/controls/OrbitControls.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupVideo();
        //this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupVideo() {
        const video = document.createElement("video");

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
            const constraints = {  
                video: { width: 1280, height: 720 } 
            };

            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                video.srcObject = stream;
                video.play();

                const videoTexture = new THREE.VideoTexture(video);
                this._videoTexture = videoTexture;

                this._setupModel();
            }).catch( function ( error ) {
                console.error( '카메라에 접근할 수 없습니다.', error );
            });
        } else {
            console.error( 'MediaDevices 인터페이스 사용 불가' );
        }
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.MeshPhongMaterial({
            map: this._videoTexture,
            //color: 0x44a88
        });

        const cube = new THREE.Mesh(geometry, material);
        this._scene.add(cube);
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
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
    }
}

window.onload = function () {
    new App();
}