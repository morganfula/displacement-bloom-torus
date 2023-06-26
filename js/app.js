import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';

export default class Sketch {
	constructor(options) {
		this.time = 0;
		this.container = options.dom;
		this.scene = new THREE.Scene();

		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		this.camera = new THREE.PerspectiveCamera(
			70,
			this.width / this.height,
			0.01,
			1000
		);
		this.camera.position.z = 3;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.width, this.height);
		this.container.appendChild(this.renderer.domElement);

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));

		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(this.width, this.height),
			1.4,
			0.0001,
			0.01
		);

		this.composer.addPass(this.bloomPass);

		//enable controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.resize();
		this.setupResize();
		this.addObjects();
		this.render();
	}

	setupResize() {
		window.addEventListener('resize', this.resize.bind(this));
	}

	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}

	addObjects() {
		this.geometry = new THREE.TorusGeometry(1, 0.3, 1000, 1000);
		this.material = new THREE.MeshNormalMaterial();

		// Shader Marterial
		this.material = new THREE.ShaderMaterial({
			fragmentShader: fragment,
			vertexShader: vertex,
			side: THREE.DoubleSide,
			// wireframe: true,
			uniforms: {
				uTime: { value: 0 },
			},
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
	}

	render() {
		this.material.uniforms.uTime.value += 0.05;
		this.mesh.rotation.x = this.time / 2000;
		this.mesh.rotation.y = this.time / 1000;

		this.renderer.render(this.scene, this.camera);

		this.composer.render();

		window.requestAnimationFrame(this.render.bind(this));
	}
}

new Sketch({
	dom: document.getElementById('container'),
});
