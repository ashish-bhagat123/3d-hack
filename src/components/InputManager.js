import { Vector2, Raycaster } from 'https://cdn.skypack.dev/three@0.137';
import * as CANNON from 'cannon-es';

export class InputManager {
  constructor(camera, renderer, world, hexGrid, sphereManager) {
    this.camera = camera;
    this.renderer = renderer;
    this.world = world;
    this.hexGrid = hexGrid;
    this.sphereManager = sphereManager;
    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
    this.isRightMouseDown = false;
    this.JUMP_FORCE = 30;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  onMouseUp(event) {
    if (event.button === 2) {
      this.isRightMouseDown = false;
    }
  }

  onMouseDown(event) {
    event.preventDefault();

    if (event.button === 2 && !this.isRightMouseDown) {
      this.isRightMouseDown = true;
      this.handleJump();
    }
  }

  handleJump() {
    const mainSphereBody = this.sphereManager.sphereBodies[0];
    const spherePos = mainSphereBody.position;
    const radius = mainSphereBody.shapes[0].radius;
    
    const rayFrom = new CANNON.Vec3(spherePos.x, spherePos.y, spherePos.z);
    const rayTo = new CANNON.Vec3(spherePos.x, spherePos.y - radius - 0.1, spherePos.z);
    const result = new CANNON.RaycastResult();
    
    this.world.raycastClosest(rayFrom, rayTo, {
      collisionFilterGroup: 1,
      collisionFilterMask: 1
    }, result);

    if (result.hasHit && result.body !== mainSphereBody) {
      mainSphereBody.applyImpulse(
        new CANNON.Vec3(0, this.JUMP_FORCE, 0),
        mainSphereBody.position
      );
      
      if (mainSphereBody.sleepState === CANNON.Body.SLEEPING) {
        mainSphereBody.wakeUp();
      }
    }
  }
}