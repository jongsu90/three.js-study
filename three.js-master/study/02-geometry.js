import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import { FontLoader } from '../examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from "../examples/jsm/geometries/TextGeometry.js"

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
        camera.position.z = 15;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    // _setupModel() {
    //     class CustomSinCurve extends THREE.Curve {
    //         constructor(scale) {
    //             super();
    //             this.scale = scale;
    //         }
    //         getPoint(t) {
    //             const tx = t * 3 - 1.5;
    //             const ty = Math.sin(2 * Math.PI * t);
    //             const tz = 0;
    //             return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = path.getPoints(30);
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }

    // _setupModel() {
    //     const shape = new THREE.Shape();

    //     shape.moveTo(1, 1);
    //     shape.lineTo(1, -1);
    //     shape.lineTo(-1, -1);
    //     shape.lineTo(-1, 1);
    //     shape.closePath();

    //     const geometry = new THREE.ShapeGeometry(shape);

    //     const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151});
    //     const cube = new THREE.Mesh(geometry, fillMaterial);

    //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.LineSegments(
    //         new THREE.WireframeGeometry(geometry), lineMaterial
    //     );

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group);
    //     this._cube = group;
    // }

    // _setupModel() {
    //     class CustomSinCurve extends THREE.Curve {
    //         constructor(scale) {
    //             super();
    //             this.scale = scale;
    //         }
    //         getPoint(t) {
    //             const tx = t * 3 - 1.5;
    //             const ty = Math.sin(2 * Math.PI * t);
    //             const tz = 0;
    //             return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);
    //     const geometry = new THREE.TubeGeometry(path, 40, 0.8, 8, true);

    //     const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
    //     const cube = new THREE.Mesh(geometry, fillMaterial);

    //     const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    //     const line = new THREE.LineSegments(
    //         new THREE.WireframeGeometry(geometry), lineMaterial
    //     );

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group);
    //     this._cube = group;
    // }

    // _setupModel() {
    //     const shape = new THREE.Shape();
    //     shape.moveTo(1, 1);
    //     shape.lineTo(1, -1);
    //     shape.lineTo(-1, -1);
    //     shape.lineTo(-1, 1);
    //     shape.closePath();

    //     const geometry = new THREE.BufferGeometry();
    //     const points = shape.getPoints();
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({coloe: 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }

    // _setupModel() {
    //     const points = [];
    //     for (let i = 0; i < 10; ++i) {
    //         points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
    //     }

    //     const geometry = new THREE.LatheGeometry(points, 32, 0, Math.PI);

    //     const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
    //     const cube = new THREE.Mesh(geometry, fillMaterial);

    //     const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    //     const line = new THREE.LineSegments(
    //         new THREE.WireframeGeometry(geometry), lineMaterial
    //     );

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group);
    //     this._cube = group;
    // }

    _setupModel() {
        const fontLoader = new FontLoader();
        async function loadFont(that) {
            const url = "../examples/fonts/helvetiker_regular.typeface.json";
            const font = await new Promise((resolve, reject) => {
                fontLoader.load(url, resolve, undefined, reject);
            })

            const geometry = new TextGeometry("GIS", {
                font: font, // fontLoader를 통해서 얻어온 객체
                size: 5, // 텍스트 메쉬의 크기이다. 기본값은 100 이다.
                height: 1.5, // 깊이 값이다. 기본값은 50 이다.
                curveSegments: 4, // 하나의 커브를 구성하는 정점의 갯수이다. 기본값은 12이다.
                // setting for ExtrudeGeometry
                bevelEnabled: true, // 베벨링 처리를 할 것인지의 여부. 기본값은 true이다. true로 설정해주어야 다음 설정값이 적용된다.
                bevelThickness: 0.7, // 베벨링에 대한 두께 값이다. 기본값은 6이다.
                bevelSize : 0.7,  // shape의 외곽선으로부터 얼마나 멀리 베벨링 할 것인지에 대한 거리. 기본값은 2이다.
                bevelOffset : 0,  // 텍스트 윤곽선 베벨에서 시작하는 거리이다. * 이 값을 반드시 지정해줘야 한다.
                bevelSegments: 2 // 베벨링 단계 수. 기본값은 3이다.
            });
    
            const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
            const cube = new THREE.Mesh(geometry, fillMaterial);
    
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
            const line = new THREE.LineSegments(
                new THREE.WireframeGeometry(geometry), lineMaterial
            );
    
            const group = new THREE.Group();
            group.add(cube);
            group.add(line);
    
            that._scene.add(group);
            that._cube = group;
        }
        loadFont(this);
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
        // time *= 0.001;
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}