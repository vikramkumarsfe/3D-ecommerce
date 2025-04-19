const enterButton = document.getElementById('enterButton');
const enterContainer = document.getElementById('enterContainer');
const sidePanel = document.getElementById('sidePanel');
const addBtn = document.getElementById('addProduct');
const deleteBtn = document.getElementById('deleteProduct');


// Scene init or pointer lock controls can go here
enterButton.addEventListener('click', () => {
  enterContainer.style.display = 'none';
  console.log("Store entered!");
  // e.g., initialize your scene or enable controls
});

// Panel controls
export function openPanel() {
  sidePanel.classList.add('expanded');
}

export function closePanel() {
  sidePanel.classList.remove('expanded');
}

export function togglePanel() {
  sidePanel.classList.toggle('expanded');
}

// Example use: press 'e' to open side panel
window.addEventListener('keydown', (e) => {
  if (e.key === 'e') {
    openPanel();
  }
});

// Add product functionality
addBtn.addEventListener('click', () => {
  console.log("Add Product Clicked");
  // your 3D add object logic here
});

// Delete product functionality
deleteBtn.addEventListener('click', () => {
  console.log("Delete Product Clicked");
  // your 3D delete object logic here
});


//cldoe panel
