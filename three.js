import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { OrbitControls } from 'OrbitControls';
import { GUI } from "GUI";

function main() {

    const canvas = document.querySelector('#c');

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		alpha: true,
		logarithmicDepthBuffer: true,
	  });
	renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set( 0, 10, 20 );
	// camera.position.z = 3;

	
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	camera.lookAt(controls.target);
	controls.update();

	const scene = new THREE.Scene();

    // Light should be added to the main scene if everything is rendered together
    const color = 0xFFFFFF;
    const intensity_directional = 0.5;
    const directionalLight = new THREE.DirectionalLight(color, intensity_directional);
    directionalLight.position.set(5, 10, 7.5);
	directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
	scene.add(directionalLight.target);


	const color_for_ambient = 0xFFFFFF;
	const intensity_for_ambient = 0;
	const AmbientLight = new THREE.AmbientLight(color_for_ambient, intensity_for_ambient);
	scene.add(AmbientLight);

	const skyColor = 0xB1E1FF;  // light blue
	const groundColor = 0xB97A20;  // brownish orange
	const intensity = 1;
	const skyLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
	scene.add(skyLight);



	const cubes = [];  // array for all cubes to rotate

    // Load textures and apply to materials
    function loadColorTexture(path) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

	{
		const loader = new THREE.TextureLoader();
		const texture = loader.load(
		  "rogland_clear_night_4k.jpg",
		  () => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			texture.colorSpace = THREE.SRGBColorSpace;
			scene.background = texture;
		  });
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

		const sonic_loaderObj = new OBJLoader();
		sonic_loaderObj.load("Sonic_Model.obj", (root) => {

		});

		const sonic_loaderMtl = new MTLLoader();
		sonic_loaderMtl.load('Sonic_Model.mtl', (sonic_mtl) => {
			sonic_mtl.preload();		  
		  sonic_loaderObj.setMaterials(sonic_mtl);
		  sonic_loaderObj.load('Sonic_Model.obj', (sonic_root) => {
			sonic_root.position.y += 2;
			sonic_root.position.x -=2;
			sonic_root.rotation.y = Math.PI /2;
			scene.add(sonic_root);
		  });
		});

	}

	// Create a torus geometry
	const radius = 0.5; // Overall radius of the torus
	const tubeRadius = 0.2; // Thickness of the ring
	const radialSegments = 30; // Complexity around the radius
	const tubularSegments = 100; // Complexity around the tube

	const material = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.5, roughness: 0.4 });

	// Number of rings you want to create
	const numberOfRings = 5;

	const rings = []; // Array to store the ring meshes

	// Create multiple rings
	for (let i = 0; i < numberOfRings; i++) {
		const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		const torus = new THREE.Mesh(torusGeometry, material);

		// Set position and rotation
		torus.position.x = i * 1.5; // Adjust position to avoid overlap, incrementally positioning rings
		torus.position.y += 3;
		torus.rotation.y = Math.PI / 2;

		// Add each torus to the scene and store in the array
		scene.add(torus);
		rings.push(torus);
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
	  const texture = loader.load('checkboard.jpg', function(tex) {
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.magFilter = THREE.NearestFilter;
		tex.repeat.set(planeSize / 2, planeSize / 2);  // Adjusting repeats for proper tiling
	  });
	  
	  // Ensure the texture is fully loaded before applying it to the material
	  texture.onload = function() {
		const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
		const planeMat = new THREE.MeshPhongMaterial({
		  map: texture,
		  side: THREE.DoubleSide,
		  transparent: true,  // Enable transparency
		  opacity: 0.5,        // Set opacity level (0 = fully transparent, 1 = fully opaque)
		});
		const mesh = new THREE.Mesh(planeGeo, planeMat);
		mesh.rotation.x = Math.PI * -.5;
		scene.add(mesh);
	  };
	  

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

	  const ambLightFolder = gui.addFolder("Ambient Light");
	  ambLightFolder.add(AmbientLight, 'intensity', 0, 5, 0.01).name('Intensity_for_Ambient');
	  ambLightFolder.addColor(new ColorGUIHelper(AmbientLight, 'color'), 'value').name('color_for_ambient');

	  const dirLightFolder = gui.addFolder('Directional Light');
	  dirLightFolder.add(directionalLight, 'intensity', 0, 5, 0.01).name('Intensity_for_Directional');
	  dirLightFolder.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color_for_directional');
	  dirLightFolder.add(directionalLight.target.position, 'x', -10, 10);
	  dirLightFolder.add(directionalLight.target.position, 'z', -10, 10);
	  dirLightFolder.add(directionalLight.target.position, 'y', 0, 10);

	  const skyLightFolder = gui.addFolder('Sky/Ground Light');
	  skyLightFolder.add(skyLight, 'intensity', 0, 5, 0.01).name('Intensity_for_Sky');
	  skyLightFolder.addColor(new ColorGUIHelper(skyLight, 'color'), 'value').name('skyColor');
	  skyLightFolder.addColor(new ColorGUIHelper(skyLight, 'groundColor'), 'value').name('groundColor');


	  function render(time) {
		time *= 0.001;  // Convert time to seconds
	
		if (resizeRendererToDisplaySize(renderer)) {
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
	
		cubes.forEach((cube, ndx) => {
			const speed = 0.2 + ndx * 0.1;
			cube.rotation.x = time * speed;
			cube.rotation.y = time * speed;
		});

		rings.forEach((ring, ndx) => {
			const speed = 0.2 + ndx * 0.1;
			ring.rotation.x = time * speed;
			ring.rotation.y = time * speed;
		});
	
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
	
	

    requestAnimationFrame(render);




}

main();
