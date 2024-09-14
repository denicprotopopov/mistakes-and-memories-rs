import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'; // For the pixelation shader

// Custom pixelation shader
const PixelShader = {
    uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2() },
        pixelSize: { value: 8.0 }  // Default pixel size
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float pixelSize;
        uniform vec2 resolution;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        void main() {
            vec2 dxy = pixelSize / resolution;
            vec2 coord = dxy * floor(vUv / dxy);
            gl_FragColor = texture2D(tDiffuse, coord);
        }
    `
};

export class SceneManager {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.scenes = {};
        this.activeScene = null;
        this.effectComposer = new EffectComposer(renderer);
        this.mouseX = 0;
        this.mouseY = 0;

        this.initMouseMovement();
        this.initResizeHandling();  // Handle window resize
    }

    // Add a scene and its corresponding animate function
    addScene(name, scene, animateFn, usePixelation = false, pixelSize = 8) {
        this.scenes[name] = {
            scene,
            animateFn,
            usePixelation,
            pixelSize  // Store the pixel size per scene
        };
    }

    // Set the active scene and adjust post-processing accordingly
    setActiveScene(name) {
        if (this.scenes[name]) {
            const { scene, usePixelation, pixelSize } = this.scenes[name];

            // Clean all existing passes before adding new ones
            this.disposeAll();

            // Create new render pass for the current scene
            const renderPass = new RenderPass(scene, this.camera);
            this.effectComposer.addPass(renderPass);

            // Add custom pixelation pass if requested for this scene
            if (usePixelation) {
                const pixelShaderPass = new ShaderPass(PixelShader);
                pixelShaderPass.uniforms['resolution'].value.set(
                    window.innerWidth,
                    window.innerHeight
                );
                pixelShaderPass.uniforms['pixelSize'].value = pixelSize;
                this.effectComposer.addPass(pixelShaderPass);
            }

            this.activeScene = this.scenes[name];
        } else {
            console.warn(`Scene ${name} not found`);
        }
    }

    // Properly dispose of all existing passes in the EffectComposer
    disposeAll() {
        for (let i = this.effectComposer.passes.length - 1; i >= 0; i--) {
            const pass = this.effectComposer.passes[i];
            if (pass.dispose) {
                pass.dispose();  // Dispose of the pass
            }
            this.effectComposer.removePass(pass);  // Remove the pass from composer
        }
        console.log('Disposed of all passes. Current passes length:', this.effectComposer.passes.length);
    }

    // Render the active scene
    render() {
        if (this.activeScene) {
            if (this.activeScene.animateFn) {
                this.activeScene.animateFn();
            }
            // Apply camera movement based on mouse position
            this.updateCameraPosition();
            this.effectComposer.render();
        }
    }

    // Initialize mouse/touch movement tracking
    initMouseMovement() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        });
    }

    // Update camera position based on mouse/touch input
    updateCameraPosition() {
        const maxOffset = 0.5;  // Maximum camera offset
        const offsetX = this.mouseX * maxOffset;
        const offsetY = this.mouseY * maxOffset;

        // Move the camera, but keep looking at the center of the scene
        this.camera.position.x = offsetX;
        this.camera.position.y = offsetY;
        this.camera.lookAt(0, 0, 0);  // Always look at the center
    }

    // Initialize resize handling
    initResizeHandling() {
        window.addEventListener('resize', () => this.onWindowResize());
    }

    // Handle window resize: update camera aspect and renderer size
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update the camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Update the renderer size
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update the EffectComposer as well
        this.effectComposer.setSize(width, height);
    }
}
