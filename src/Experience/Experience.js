import * as THREE from 'three'

export class Experience {
    constructor(canvas) {
        this.canvas = canvas
        this.scene = new THREE.Scene()
        console.log(this.scene)
    }
}