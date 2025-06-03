import { PointLight, Color } from 'https://cdn.skypack.dev/three@0.137';

export function setupLighting(scene) {
  const light = new PointLight(
    new Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(),
    80,
    200
  );
  
  light.position.set(10, 20, 10);
  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;
  
  scene.add(light);
  
  return light;
}