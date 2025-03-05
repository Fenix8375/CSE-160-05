import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { OrbitControls } from 'OrbitControls';
import { GUI } from "GUI"

function main() {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		logarithmicDepthBuffer: true,
	  });
	renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 40;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set( 0, 10, 20 );

	
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	camera.lookAt(controls.target);
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'grey' );

    // Light should be added to the main scene if everything is rendered together
    const color = 0xFFFFFF;
    const intensity_directional = 1;
	const intensity_ambient = 1;
    const light = new THREE.DirectionalLight(color, intensity_directional);
	const light2 = new THREE.AmbientLight(color, intensity_ambient);
    light.position.set(-1, 2, 4);
    scene.add(light);
	scene.add(light2)


    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

	const cubes = [];  // array for all cubes to rotate

    // Load textures and apply to materials
    function loadColorTexture(path) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

	const up = 1;

    // Using one texture per cube example
    const textures = [
        'fire.jpg', 'gas.jpg', 'ice.jpg', 'rock.jpg', 'water.jpg', 'lightning.jpg'
    ].map(loadColorTexture);

	textures.forEach((texture, index) => {
		// Create material with texture
		const material = new THREE.MeshPhongMaterial({ map: texture });

		// Geometry for the cube
		const cubeSize = 1; // Define the size of the cube
		const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

		// Create a cube mesh with the geometry and textured material
		const cube = new THREE.Mesh(cubeGeo, material);

		// Position each cube so they do not overlap
		cube.position.set(index * 2 - 5, cubeSize / 2 + up, 0);

		// Add the cube to the scene
		scene.add(cube);

		// Optionally, keep track of the cubes if needed later
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


	{

		const objLoader = new OBJLoader();
		objLoader.load("omnitrix-ben10.obj", (root) => {

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
			root.position.y += 2;
			scene.add(root);
		  });
		});

	}


	class MinMaxGUIHelper {
		constructor(obj, minProp, maxProp, minDif) {
		  this.obj = obj;
		  this.minProp = minProp;
		  this.maxProp = maxProp;
		  this.minDif = minDif;
		}
		get min() {
		  return this.obj[this.minProp];
		}
		set min(v) {
		  this.obj[this.minProp] = v;
		  this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
		}
		get max() {
		  return this.obj[this.maxProp];
		}
		set max(v) {
		  this.obj[this.maxProp] = v;
		  this.min = this.min;
		}
	  }

	  function updateCamera() {
		camera.updateProjectionMatrix();
	  }
	   
	  const gui = new GUI();
	  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
	  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
	  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
	  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

	  const planeSize = 40;
	  const loader = new THREE.TextureLoader();
	  const texture = loader.load('checkboard.jpg');
	  texture.wrapS = THREE.RepeatWrapping;
	  texture.wrapT = THREE.RepeatWrapping;
	  texture.magFilter = THREE.NearestFilter;
	  texture.colorSpace = THREE.SRGBColorSpace;
	  const repeats = planeSize / 2;
	  texture.repeat.set(repeats, repeats);

	  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
	  const planeMat = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
	  });
	  const mesh = new THREE.Mesh(planeGeo, planeMat);
	  mesh.rotation.x = Math.PI * -.5;
	  scene.add(mesh);

	  class ColorGUIHelper {
		constructor(object, prop) {
		  this.object = object;
		  this.prop = prop;
		}
		get value() {
		  return `#${this.object[this.prop].getHexString()}`;
		}
		set value(hexString) {
		  this.object[this.prop].set(hexString);
		}
	  }

	  const gui2 = new GUI();
	  gui2.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	  gui2.add(light, 'intensity', 0, 5, 0.01);


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




}

main();
