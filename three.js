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
		const textures = [
			'fire.jpg', 'gas.jpg', 'ice.jpg', 'rock.jpg', 'water.jpg', 'lightning.jpg'
		];
		const materials = textures.map(texture => new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load(texture)
		}));
		
		const cubeGroup = new THREE.Group();
		materials.forEach((material, index) => {
			const cube = new THREE.Mesh(boxGeometry, material);
			cube.position.set(index * 2 - 5 + 2, 3.5, 6);  // Adjusted all position calculations here
			cubeGroup.add(cube);
		});
		
		scene.add(cubeGroup);
		
	



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

	// Number of rings you want to create
	const numberOfRings = 7;

	const rings = []; // Array to store the ring meshes

	// Create multiple rings
	for (let i = 0; i < numberOfRings; i++) {
		const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		// Create a new material instance for each ring
		const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.5, roughness: 0.4 });
		const torus = new THREE.Mesh(torusGeometry, torusMaterial);
	
		torus.position.x = i * 1.5 - 3;
		torus.position.y += 3;
		torus.rotation.y = Math.PI / 2;
	
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
			const emeraldGeometry = new THREE.OctahedronGeometry(0.5, 0);
			emeraldGeometry.scale(1, 1.5, 1);
			// Create a new material instance for each emerald
			const emeraldMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.5, roughness: 0.25 });
			const emerald = new THREE.Mesh(emeraldGeometry, emeraldMaterial);
		
			emerald.position.x = i * 1.5 - 3;
			emerald.position.y += 3;
			emerald.position.z -= 6;
			emerald.rotation.x = Math.PI / 4;
			emerald.rotation.y = Math.PI / 6;
		
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

	  class PickHelper {
		constructor() {
		  this.raycaster = new THREE.Raycaster();
		  this.pickedObject = null;
		  this.pickedObjectSavedColor = 0;
		}
		pick(normalizedPosition, scene, camera, time) {
		  // restore the color if there is a picked object
		  if (this.pickedObject) {
			this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
			this.pickedObject = undefined;
		  }
	   
		  // cast a ray through the frustum
		  this.raycaster.setFromCamera(normalizedPosition, camera);
		  // get the list of objects the ray intersected
		  const intersectedObjects = this.raycaster.intersectObjects(scene.children);
		  if (intersectedObjects.length) {
			// pick the first object. It's the closest one
			this.pickedObject = intersectedObjects[0].object;
			// save its color
			this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
			// set its emissive color to flashing red/yellow
			this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
		  }
		}
	  }

	  	const pickPosition = {x: 0, y: 0};
		clearPickPosition();
		
		
		function getCanvasRelativePosition(event) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: (event.clientX - rect.left) * canvas.width  / rect.width,
			y: (event.clientY - rect.top ) * canvas.height / rect.height,
		};
		}
		
		function setPickPosition(event) {
		const pos = getCanvasRelativePosition(event);
		pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
		pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
		}
		
		function clearPickPosition() {
		// unlike the mouse which always has a position
		// if the user stops touching the screen we want
		// to stop picking. For now we just pick a value
		// unlikely to pick something
		pickPosition.x = -100000;
		pickPosition.y = -100000;
		}
		
		window.addEventListener('mousemove', setPickPosition);
		window.addEventListener('mouseout', clearPickPosition);
		window.addEventListener('mouseleave', clearPickPosition);

		window.addEventListener('touchstart', (event) => {
			// prevent the window from scrolling
			event.preventDefault();
			setPickPosition(event.touches[0]);
		  }, {passive: false});
		   
		  window.addEventListener('touchmove', (event) => {
			setPickPosition(event.touches[0]);
		  });
		   
		  window.addEventListener('touchend', clearPickPosition);



	  const pickHelper = new PickHelper();

	  function render(time) {
		stats.begin();
		time *= 0.001;
	
		if (resizeRendererToDisplaySize(renderer)) {
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
	
		cubeGroup.children.forEach((cube, ndx) => {
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
	
		pickHelper.pick(pickPosition, scene, camera, time);
		renderer.render(scene, camera);
		stats.end();
		requestAnimationFrame(render);
	}
	
	
	

    requestAnimationFrame(render);




}

main();
