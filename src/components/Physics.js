import * as CANNON from 'cannon-es';

export function setupPhysicsWorld() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
  });

  world.allowSleep = true;
  world.solver.iterations = 20;
  world.solver.tolerance = 0.01;

  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.7,
      restitution: 0.05,
      contactEquationStiffness: 1e10,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e10,
      frictionEquationRelaxation: 3
    }
  );
  world.defaultContactMaterial = defaultContactMaterial;

  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  let lastCallTime;
  const timeStep = 1 / 60;

  return {
    world,
    defaultMaterial,
    update() {
      const time = performance.now() / 1000;
      if (!lastCallTime) {
        world.step(timeStep, timeStep, 10);
      } else {
        const dt = time - lastCallTime;
        world.step(timeStep, dt, 10);
      }
      lastCallTime = time;
    }
  };
}