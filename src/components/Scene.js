import {
  WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding,
  Color, PerspectiveCamera, Scene, PMREMGenerator, PCFSoftShadowMap
} from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { setupLighting } from './Lighting';
import { setupPhysicsWorld } from './Physics';
import { setupStats } from './Stats';
import { GameManager } from './GameManager';

export class SceneManager {
  constructor() {
    this.scene = new Scene();
    this.scene.background = new Color("#FFEECC");
    
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    
    this.pmrem = new PMREMGenerator(this.renderer);
    this.pmrem.compileEquirectangularShader();
    
    this.physics = setupPhysicsWorld();
    this.lighting = setupLighting(this.scene);
    this.stats = setupStats();
    
    this.gameManager = new GameManager(
      this.scene,
      this.physics.world,
      this.renderer,
      this.camera,
      this.pmrem
    );
  }

  setupRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    document.querySelector("#app").appendChild(this.renderer.domElement);
  }

  setupCamera() {
    this.camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
    this.camera.position.set(-25.5, 46.5, 49.5);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(20, 0, 20);
    this.controls.dampingFactor = 0.05;
    this.controls.enableDamping = true;
  }

  animate() {
    this.controls.update();
    this.stats.begin();
    
    this.gameManager.update();
    this.physics.update();
    
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  start() {
    this.renderer.setAnimationLoop(() => this.animate());
  }
}