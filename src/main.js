import { initScene } from './core/scene.js';
import { loadStoreModel, addProducts} from './core/loader.js';
import { onWindowResize } from './utils/resize.js';
import { CombinedControls } from './classes/controlFinal.js';
import { DragDrop } from './classes/dragDrop.js';
import { deleteProductByName, productList } from './core/product.js';

let scene, camera, renderer, canvas, light, group;
({ scene, camera, renderer, canvas, light } = initScene());
const controls = new CombinedControls(camera, renderer.domElement, scene);
// const drag = new DragDrop(scene, camera, renderer, light, null, controls);

let drag; 

async function init() {
  await loadStoreModel(scene);

  group = await addProducts(scene, productList); // Get the group and await properly
  
  // Now that we have the group, initialize DragDrop
  drag = new DragDrop(scene, camera, renderer, light, group, controls);

  
  window.addEventListener('resize', () => onWindowResize(camera, renderer));
  document.getElementById('enterButton').addEventListener('click', () => {
    // controls.enterStore();
  });
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (controls.mode === 'pointer') {
    controls.updateMovement();
  }

  const deleteBtn = document.getElementById('deleteBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      deleteProductByName('Product 3'); // or any name
      await refreshProducts(scene);
    });
  } else {
    console.warn('Delete button not found in DOM.');
  }

  controls.update();
  renderer.render(scene, camera);
}

init();
