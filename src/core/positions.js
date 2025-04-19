import * as THREE from 'three';

function addProductAtPosition(camera, scene, path='/path') {
    let positions = [];
    let markers = [];
    let raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    

    positions = [(1,1,1), (2, 2, 2)]

    const geometry = new THREE.SphereGeometry(1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
      transparent: true,
      opacity: 0.7 
    })

    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    marker.userData.positionIndex = i;
    scene.add(marker);
    markers.push(marker);
}

