import { TextureLoader, RGBELoader } from 'https://cdn.skypack.dev/three@0.137';
import { HexGrid } from './HexGrid';
import { SphereManager } from './SphereManager';
import { InputManager } from './InputManager';

export class GameManager {
  constructor(scene, physicsWorld, renderer) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.renderer = renderer;
    
    this.init();
  }

  async init() {
    await this.loadTextures();
    
    this.hexGrid = new HexGrid(this.scene, this.physicsWorld, this.textures, this.envmap);
    await this.hexGrid.loadMapData();
    
    this.sphereManager = new SphereManager(this.scene, this.physicsWorld, this.envmap);
    this.inputManager = new InputManager(this.hexGrid, this.sphereManager, this.renderer);
  }

  async loadTextures() {
    const envmapTexture = await new RGBELoader().loadAsync("assets/envmap.hdr");
    this.envmap = this.pmrem.fromEquirectangular(envmapTexture).texture;

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