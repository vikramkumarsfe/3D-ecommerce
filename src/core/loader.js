import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { productList } from './product';

let productModels = [];
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

export async function addProducts(scene, productList) {
  const group = new THREE.Group();
  productModels = [];

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];

    try {
      const gltf = await loader.loadAsync(product.modelPath);
      const model = gltf.scene;

      model.position.set(i * 3 - productList.length, 0.5, 0);
      model.scale.set(5, 5, 5);
      model.name = product.name || `product-${i}`;

      // Attach reference to root group for each mesh
      model.traverse((child) => {
        if (child.isMesh) {
          child.userData.rootGroup = model;
        }
      });

      group.add(model);
      productModels.push(model);
    } catch (err) {
      console.error(`Failed to load ${product.modelPath}:`, err);
    }
  }

  scene.add(group);
  return group;
}

export function getProductModels() {
  return productModels;
}

export async function loadStoreModel(scene) {
  return new Promise((resolve, reject) => {
    loader.load(
      'public/models/store.glb',
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        resolve();
      },
      (xhr) => {
        console.log(`Model loading: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        reject(error);
      }
    );
  });
}

export async function refreshProducts(scene) {
  const models = getProductModels();
  models.forEach(model => scene.remove(model));
  await addProducts(scene, productList);
}
