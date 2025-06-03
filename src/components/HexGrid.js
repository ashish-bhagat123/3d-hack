import {
  CylinderGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Vector2,
  SphereGeometry
} from 'https://cdn.skypack.dev/three@0.137';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';

const MAX_HEIGHT = 10;
const STONE_HEIGHT = MAX_HEIGHT * 0.97;
const DIRT_HEIGHT = MAX_HEIGHT * 0.7;
const GRASS_HEIGHT = MAX_HEIGHT * 0.5;
const SAND_HEIGHT = MAX_HEIGHT * 0.3;
const DIRT2_HEIGHT = MAX_HEIGHT * 0.15;

export class HexGrid {
  constructor(scene, world, textures, envmap) {
    this.scene = scene;
    this.world = world;
    this.textures = textures;
    this.envmap = envmap;
    this.hexDataMap = new Map();
    this.allHexMeshes = [];
    this.instancedMeshes = {};
    this.groupedInstanceData = {
      stone: [],
      dirt: [],
      grass: [],
      sand: [],
      dirt2: []
    };
  }

  tileToPosition(tileX, tileY) {
    return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
  }

  hexMeshMaterial(map, normalMap) {
    const matParams = {
      envMap: this.envmap,
      envMapIntensity: 0.135,
      flatShading: true,
      map
    };
    if (normalMap) {
      matParams.normalMap = normalMap;
      matParams.normalScale = new Vector2(1, 1);
    }
    return new MeshPhysicalMaterial(matParams);
  }

  tree(height, position) {
    const treeHeight = Math.random() * 1 + 1.25;

    const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
    geo.translate(position.x, height + treeHeight * 0 + 1, position.y);

    const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
    geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);

    const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
    geo3.translate(position.x, height + treeHeight * 1.25 + 1, position.y);

    return mergeBufferGeometries([geo, geo2, geo3]);
  }

  stone(height, position) {
    const px = Math.random() * 0.4;
    const pz = Math.random() * 0.4;

    const geo = new SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
    geo.translate(position.x + px, height, position.y + pz);

    return geo;
  }

  getHexNode(tileX, tileY) {
    return this.hexDataMap.get(`${tileX},${tileY}`);
  }

  worldPointToHexCoords(worldPoint) {
    let closestHexData = null;
    let minDistanceSq = Infinity;
    const pX = worldPoint.x;
    const pZ = worldPoint.z;

    for (const [key, hexData] of this.hexDataMap) {
      const dx = pX - hexData.worldPos.x;
      const dz = pZ - hexData.worldPos.y;
      const distanceSq = dx * dx + dz * dz;

      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestHexData = hexData;
      }
    }

    if (closestHexData && minDistanceSq < (1.0 * 1.0)) {
      return { tileX: closestHexData.tileX, tileY: closestHexData.tileY };
    }
    return null;
  }

  async loadMapData() {
    const mapDataResponse = await fetch("assets/map-data.json");
    return await mapDataResponse.json();
  }
}