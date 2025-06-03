import { TextureLoader } from 'https://cdn.skypack.dev/three@0.137';
import { RGBELoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/RGBELoader.js';
import { HexGrid } from './HexGrid';
import { SphereManager } from './SphereManager';
import { InputManager } from './components/InputManager';

export class GameManager {
  constructor(scene, physicsWorld, renderer, camera, pmremGenerator) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.renderer = renderer;
    this.camera = camera;
    this.pmremGenerator = pmremGenerator;
    
    this.init();
  }

  async init() {
    await this.loadTextures();
    
    this.hexGrid = new HexGrid(this.scene, this.physicsWorld, this.textures, this.envmap);
    await this.hexGrid.loadMapData();
    
    this.sphereManager = new SphereManager(this.scene, this.physicsWorld, this.envmap);
    this.inputManager = new InputManager(
      this.camera,
      this.renderer,
      this.physicsWorld,
      this.hexGrid,
      this.sphereManager
    );
  }

  async loadTextures() {
    const envmapTexture = await new RGBELoader().loadAsync("assets/envmap.hdr");
    this.envmap = this.pmremGenerator.fromEquirectangular(envmapTexture).texture;

    const textureLoader = new TextureLoader();
    this.textures = {
      dirt: await textureLoader.loadAsync("assets/dirt.png"),
      dirt2: await textureLoader.loadAsync("assets/dirt2.jpg"),
      grass: [
        await textureLoader.loadAsync("assets/grass1-albedo3.png"),
        await textureLoader.loadAsync("assets/grass.jpg")
      ],
      grassNormal: await textureLoader.loadAsync("assets/grass1-normal1-dx.png"),
      sand: await textureLoader.loadAsync("assets/sand.jpg"),
      water: await textureLoader.loadAsync("assets/water.jpg"),
      stone: await textureLoader.loadAsync("assets/stone.png"),
    };
  }

  update() {
    this.sphereManager.update();
    this.hexGrid.update();
  }
}