import * as THREE from "three";
import { OBJLoader } from "OBJLoader";
import { MTLLoader } from 'MTLLoader';

function main() {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
	renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 150;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    // Light should be added to the main scene if everything is rendered together
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }

    const cubes = [];  // array for all cubes to rotate

    // Load textures and apply to materials
    function loadColorTexture(path) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    // Using one texture per cube example
    const textures = [
        'fire.jpg', 'gas.jpg', 'ice.jpg', 'rock.jpg', 'water.jpg', 'lightning.jpg'
    ].map(loadColorTexture);

    textures.forEach((texture, index) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = index * 2 - 5; // Adjust position to prevent overlap
        cubes.push(cube);
    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) => {
            const speed = .2 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

	{

		const objLoader = new OBJLoader();
		objLoader.load("omnitrix-ben10.obj", (root) => {
			scene.add(root);
		});

		const mtlLoader = new MTLLoader();
		mtlLoader.load('omnitrix-ben10.mtl', (mtl) => {
		  mtl.preload();
		  mtl.materials.Omnitrix_Black.side = THREE.DoubleSide;
		  mtl.materials.Omnitrix_Core.side = THREE.DoubleSide;
		  mtl.materials.Omnitrix_Grey.side = THREE.DoubleSide;
		  mtl.materials.Omnitrix_Lens.side = THREE.DoubleSide;
		  mtl.materials.Omnitrix_Lights.side = THREE.DoubleSide;
		  mtl.materials.Omnitrix_Screen.side = THREE.DoubleSide;
		  mtl.materials.Omnitrix_Tubes.side = THREE.DoubleSide;
		  objLoader.setMaterials(mtl);
		  objLoader.load('omnitrix-ben10.obj', (root) => {
			scene.add(root);
		  });
		});

	}




}

main();
