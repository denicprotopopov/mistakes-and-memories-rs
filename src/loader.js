import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { sceneArmory, sceneCity } from './script.js'



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
        })}


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

function onTransitionEnd( event ) {

	event.target.remove();
	
}

export function getMixers() {
    return mixers;
}