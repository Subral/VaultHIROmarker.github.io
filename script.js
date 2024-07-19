import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
window.onload = function () {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(2, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const markerRoot = new THREE.Group();
    scene.add(markerRoot);

    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
         sourceWidth: window.innerWidth,
        sourceHeight: window.innerHeight,
        displayWidth: window.innerWidth,
        displayHeight: window.innerHeight,
    });

    arToolkitSource.init(function onReady() {
        setTimeout(onResize, 1000);
    });

    window.addEventListener('resize', onResize);

    function onResize() {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement);
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
        }
    }

    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://rawcdn.githack.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
        detectionMode: 'mono',
        maxDetectionRate: 30,
    });


     arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
            type: 'pattern',
            patternUrl: 'https://rawcdn.githack.com/AR-js-org/AR.js/master/data/data/patt.hiro',
        });


    const loader = new GLTFLoader();
    loader.load(
        'assets/models/Parrot.glb',
        function (gltf) {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(2,2,2);
            markerRoot.add(model);
        },
        function (error) {
            console.error('An error happened', error);
        }
    );

      loader.load(
        'assets/models/Flamingo.glb',
        function (gltf) {
            const model1 = gltf.scene;
            model1.scale.set(1, 1, 1);
            model1.position.set(0,2,-3);
            markerRoot.add(model1);
        },
        function (error) {
            console.error('An error happened', error);
        }
    );

      loader.load(
        'assets/models/Stork.glb',
        function (gltf) {
            const model2 = gltf.scene;
            model2.scale.set(1, 1, 1);
            model2.position.set(4, 2, -4);
            markerRoot.add(model2);
        },
        function (error) {
            console.error('An error happened', error);
        }
    );

    function animate() {
        requestAnimationFrame(animate);

        if (arToolkitSource.ready !== false) {
            arToolkitContext.update(arToolkitSource.domElement);
        }
        renderer.render(scene, camera);
    }

    animate();
};
