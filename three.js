import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { OrbitControls } from 'OrbitControls';
import { GUI } from "GUI";
import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js";

function main() {

    const canvas = document.querySelector('#c');

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas: canvas,
		alpha: true,
		logarithmicDepthBuffer: true,
	  });
	renderer.setSize(window.innerWidth, window.innerHeight);

	const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const fov = 50;
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

	const AmbientLight  = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(AmbientLight);
	
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(5, 10, 7.5);
	scene.add(directionalLight);
	

	const skyColor = 0xB1E1FF;  // light blue
	const groundColor = 0xB97A20;  // brownish orange
	const intensity = 1;
	const skyLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
	scene.add(skyLight);

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

	
	// Define geometry outside the loop to reuse it for all cubes
    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const materials = [
        'fire.jpg', 'gas.jpg', 'ice.jpg', 'rock.jpg', 'water.jpg', 'lightning.jpg'
    ].map(texture => new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(texture)
    }));

    const cubes = materials.map((material, index) => {
        const cube = new THREE.Mesh(boxGeometry, material);
        cube.position.set(index * 2 - 5, 1.5, 0);  // Adjusted `up` directly here
		cube.position.z += 6
		cube.position.y += 2
		cube.position.x += 2
        scene.add(cube);
        return cube;
    });



    function resizeRendererToDisplaySize(renderer) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = renderer.domElement.width !== width || renderer.domElement.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        return needResize;
    }


	{

		const sonic_loaderObj = new OBJLoader();

		const sonic_loaderMtl = new MTLLoader();
		sonic_loaderMtl.load('Sonic_Model.mtl', (sonic_mtl) => {
			sonic_mtl.preload(); // Ensure materials are ready before applying them		
			// Use the prepared materials to load the model
			sonic_loaderObj.setMaterials(sonic_mtl);
			sonic_loaderObj.load('Sonic_Model.obj', (sonic_root) => {
				sonic_root.position.set(-5, 2, 0); // Adjust position as needed
				sonic_root.rotation.y = Math.PI / 2; // Rotate to face the side
				scene.add(sonic_root); // Add to the scene
			});
		});
		

	}

	{
		const shadow_loaderObj = new OBJLoader();

		const shadow_loaderMtl = new MTLLoader();
		shadow_loaderMtl.load('shadow.mtl', (shadow_mtl) => {
			shadow_mtl.preload(); // Ensure materials are ready before applying them
			// Use the prepared materials to load the model
			shadow_loaderObj.setMaterials(shadow_mtl);
			shadow_loaderObj.load('shadow.obj', (shadow_root) => {
				shadow_root.position.set(-6, 2, -6); // Adjust position as needed
				shadow_root.scale.set(0.2, 0.2, 0.2); // Scale down the model
				scene.add(shadow_root); // Add to the scene
			});
		});
		

	}

	{

		const silver_loaderObj = new OBJLoader();

		const silver_loaderMtl = new MTLLoader();
		silver_loaderMtl.load('silverCyclesDist.mtl', (silver_mtl) => { // Corrected to the matching MTL file
			silver_mtl.preload(); // Ensure materials are ready before applying them
		
			// Set the side property of materials to be double-sided, if applicable
			if (silver_mtl.materials.Ears) silver_mtl.materials.Ears.side = THREE.DoubleSide;
			if (silver_mtl.materials.Eyeballs) silver_mtl.materials.Eyeballs.side = THREE.DoubleSide;
			if (silver_mtl.materials.Eyeliner_side) silver_mtl.materials.Eyeliner_side.side = THREE.DoubleSide;
			if (silver_mtl.materials.Fur) silver_mtl.materials.Fur.side = THREE.DoubleSide;
			if (silver_mtl.materials.GlowStuff) silver_mtl.materials.GlowStuff.side = THREE.DoubleSide;
			if (silver_mtl.materials.Invisible) silver_mtl.materials.Invisible.side = THREE.DoubleSide;
			if (silver_mtl.materials.Hands) silver_mtl.materials.Hands.side = THREE.DoubleSide;
			if (silver_mtl.materials.Mouth) silver_mtl.materials.Mouth.side = THREE.DoubleSide;
			if (silver_mtl.materials.Nose) silver_mtl.materials.Nose.side = THREE.DoubleSide;
			if (silver_mtl.materials.Rings) silver_mtl.materials.Rings.side = THREE.DoubleSide;
			if (silver_mtl.materials.Teeth) silver_mtl.materials.Teeth.side = THREE.DoubleSide;
			if (silver_mtl.materials.shoe_black) silver_mtl.materials.shoe_black.side = THREE.DoubleSide;
			if (silver_mtl.materials.shoe_tips) silver_mtl.materials.shoe_tips.side = THREE.DoubleSide;
			if (silver_mtl.materials.shoe_white) silver_mtl.materials.shoe_white.side = THREE.DoubleSide;
			if (silver_mtl.materials.shou_ruby) silver_mtl.materials.shou_ruby.side = THREE.DoubleSide;
			if (silver_mtl.materials.skin) silver_mtl.materials.skin.side = THREE.DoubleSide;
			if (silver_mtl.materials.soles) silver_mtl.materials.soles.side = THREE.DoubleSide;
		
			// Use the prepared materials to load the model
			silver_loaderObj.setMaterials(silver_mtl);
			silver_loaderObj.load('silverCyclesDist.obj', (silver_root) => {
				silver_root.position.set(-4.5, 2.7, 6); // Adjust position as needed
				silver_root.scale.set(0.2, 0.2, 0.2); // Scale down the model
				silver_root.rotation.y = Math.PI /2;
				scene.add(silver_root); // Add to the scene
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
	const numberOfRings = 7;

	const rings = []; // Array to store the ring meshes

	// Create multiple rings
	for (let i = 0; i < numberOfRings; i++) {
		const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		const torus = new THREE.Mesh(torusGeometry, material);

		// Set position and rotation
		torus.position.x = i * 1.5; // Adjust position to avoid overlap, incrementally positioning rings
		torus.position.y += 3;
		torus.position.x -= 3;
		torus.rotation.y = Math.PI / 2;

		// Add each torus to the scene and store in the array
		scene.add(torus);
		rings.push(torus);
	}

	

			// Material for the emeralds
		const emerald_material = new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.5, roughness: 0.25 });

		// Number of emeralds you want to create
		const numberOfEmeralds = 7;

		const emeralds = []; // Array to store the emerald meshes

		// Create multiple emeralds
		for (let i = 0; i < numberOfEmeralds; i++) {
			// Using OctahedronGeometry for a simple, gem-like shape
			const emeraldGeometry = new THREE.OctahedronGeometry(0.5, 0); // Second parameter is detail level
			emeraldGeometry.scale(1, 1.5, 1); // Scale geometry to make the emeralds elongated

			const emerald = new THREE.Mesh(emeraldGeometry, emerald_material);

			// Set position and rotation
			emerald.position.x = i * 1.5 - 3; // Adjust position to avoid overlap, incrementally positioning emeralds
			emerald.position.y += 3;
			emerald.position.z -= 6;

			// Optionally adjust rotation to make the emeralds face interesting directions
			emerald.rotation.x = Math.PI / 4;
			emerald.rotation.y = Math.PI / 6;

			// Add each emerald to the scene and store in the array
			scene.add(emerald);
			emeralds.push(emerald);
		

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
		stats.begin();
		time *= 0.001;
	
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

		emeralds.forEach((emerald, ndx) => {
			const speed = 0.2 + ndx * 0.1;
			emerald.rotation.x = time * speed;
			emerald.rotation.y = time * speed;
		});
	
		renderer.render(scene, camera);
		stats.end();
		requestAnimationFrame(render);
	}
	
	
	

    requestAnimationFrame(render);




}

main();
