export const productList = [
  { name: 'Product 3', modelPath: 'models\\piano_shoes.glb' },
  { name: 'Product 4', modelPath: 'models\\white.glb' },
  { name: 'Product 4', modelPath: 'models\\white.glb' },
  { name: 'Product 4', modelPath: 'models\\white.glb' },
  { name: 'Product 4', modelPath: 'models\\white.glb' },
  { name: 'Product 4', modelPath: 'models\\cloths.glb' },
  { name: 'Product 4', modelPath: 'models\\cloths.glb' },
  { name: 'Product 4', modelPath: 'models\\cloths.glb' },
  { name: 'Product 4', modelPath: 'models\\cloths.glb' }
];

// Delete product by name
export function deleteProductByName(productName) {
  const index = productList.findIndex(p => p.name === productName);
  if (index !== -1) {
    productList.splice(index, 1); // us index se 1 item hata do
    console.log(`Deleted product: ${productName}`);
  } else {
    console.warn(`Product not found: ${productName}`);
  }
}
