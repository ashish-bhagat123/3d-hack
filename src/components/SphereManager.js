import {
  SphereGeometry,
  Mesh,
  MeshStandardMaterial
} from 'https://cdn.skypack.dev/three@0.137';
import * as CANNON from 'cannon-es';

export class SphereManager {
  constructor(scene, world, envmap) {
    this.scene = scene;
    this.world = world;
    this.envmap = envmap;
    this.spheres = [];
    this.sphereBodies = [];
  }

  createSphere(radius, position, color = 0xff0000) {
    const sphereGeometry = new SphereGeometry(radius);
    const material = new MeshStandardMaterial({
      color,
      envMap: this.envmap,
    });
    const sphereMesh = new Mesh(sphereGeometry, material);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;

    const sphereBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(radius),
      material: this.world.defaultMaterial,
      angularDamping: 0.8,
      linearDamping: 0.5,
      collisionResponse: true,
    });

    sphereBody.position.copy(position);
    sphereBody.sleepSpeedLimit = 0.2;
    sphereBody.sleepTimeLimit = 0.5;
    sphereBody.ccdSpeedThreshold = 10;
    sphereBody.ccdSweptSphereRadius = radius * 0.9;

    this.world.addBody(sphereBody);
    this.scene.add(sphereMesh);

    this.spheres.push(sphereMesh);
    this.sphereBodies.push(sphereBody);

    return { mesh: sphereMesh, body: sphereBody };
  }

  update() {
    for (let i = 0; i < this.spheres.length; i++) {
      this.spheres[i].position.copy(this.sphereBodies[i].position);
      this.spheres[i].quaternion.copy(this.sphereBodies[i].quaternion);
    }
  }
}