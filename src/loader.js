import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { sceneArmory, sceneCity, sceneMetro, sceneControlRoom, sceneDog, sceneDrone, sceneBrownstone } from './script.js'



const mixers = []

const cubeMapLoader = new THREE.CubeTextureLoader()
	.setPath('/cubeMaps/')
	.load([
		'px.jpg',
		'nx.jpg',
		'py.jpg',
		'ny.jpg',
		'pz.jpg',
		'nz.jpg'
	])

    const updateAllMaterial = () => {
        sceneArmory.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = cubeMapLoader
            }
        })
    
        sceneCity.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = cubeMapLoader
            }
        })
        
        sceneMetro.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = cubeMapLoader
            }
        })

        sceneControlRoom.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = cubeMapLoader
            }
        })

        sceneDrone.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = cubeMapLoader
            }
        })

        sceneBrownstone.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMap = cubeMapLoader
            }
        })
    
    }


const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('three/examples/jsm/libs/draco/')
console.log(dracoLoader);
const manager = new THREE.LoadingManager(
    () => {
	
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
	}
);
const gltfLoader = new GLTFLoader(manager)
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
	'/model/drone.glb',
	(gltf) => {
		gltf.scene.scale.set(0.25, 0.25, 0.25)
		gltf.scene.position.y = 1
		sceneDrone.add(gltf.scene)

		updateAllMaterial()
	}
)


gltfLoader.load(
	'/model/armory.glb',
	(gltf) => {
		// gltf.scene.scale.set(0.25, 0.25, 0.25)
		gltf.scene.rotateY(90)
		gltf.scene.position.y = -1
		gltf.scene.position.z = 2

		sceneArmory.add(gltf.scene)

		updateAllMaterial()
	}
)

gltfLoader.load(
    '/model/city-animated.glb',
    (gltf) => {
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
        gltf.scene.rotateY(160);

        gltf.scene.position.y = -4;
        gltf.scene.position.x = 25;
        gltf.scene.position.z = -7;

		const mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.setLoop(THREE.LoopRepeat);
			action.play();
		});

		// Store the mixer
		mixers.push(mixer);
        sceneCity.add(gltf.scene);

        updateAllMaterial();
    }
);

gltfLoader.load(
    '/model/metro.glb',
    (gltf) => {
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
        gltf.scene.rotateY(160.3);

        gltf.scene.position.y = -4;
        gltf.scene.position.x = 12;
        gltf.scene.position.z = 10;

		const mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.setLoop(THREE.LoopRepeat);
			action.play();
		});

		// Store the mixer
		mixers.push(mixer);
        sceneMetro.add(gltf.scene);

        updateAllMaterial();
    }
);

gltfLoader.load(
    '/model/control_room.glb',
    (gltf) => {
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
        gltf.scene.rotateY(30);

        gltf.scene.position.y = -4;
        gltf.scene.position.x = 1;
        gltf.scene.position.z = -1;

		const mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.setLoop(THREE.LoopRepeat);
			action.play();
		});

		// Store the mixer
		mixers.push(mixer);
        sceneControlRoom.add(gltf.scene);

        updateAllMaterial();
    }
);

gltfLoader.load(
    '/model/brownstone.glb',
    (gltf) => {
        // gltf.scene.scale.set(0.25, 0.25, 0.25)
        gltf.scene.rotateY(30);

        gltf.scene.position.y = -4;
        gltf.scene.position.x = 1;
        gltf.scene.position.z = -20;

		const mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.setLoop(THREE.LoopRepeat);
			action.play();
		});

		// Store the mixer
		mixers.push(mixer);
        sceneBrownstone.add(gltf.scene);

        updateAllMaterial();
    }
);


function onTransitionEnd( event ) {

	event.target.remove();
	
}

export function getMixers() {
    return mixers;
}