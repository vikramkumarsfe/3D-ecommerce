import * as THREE from 'three';

export class DragDrop {
  constructor(scene, camera, renderer, light, group, controls) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.light = light;
    this.group = group;
    this.controls = controls;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragPlane = new THREE.Plane();
    this.selectedObject = null;
    this.draggableObjects = [];
    this.keyStates = {};
    this.MOVE_SPEED = 0.1;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.init();
  }

  init() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(directionalLight);

    this.createDraggableObjects();

    this.controls.orbitControls.dampingFactor = 0.05;
    this.controls.orbitControls.enableDamping = true;

    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    window.addEventListener('keydown', (e) => {
      this.keyStates[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keyStates[e.code] = false;
    });
  }

  createDraggableObjects() {
    if (!this.group) {
      console.error("Group is not loaded yet!");
      return;
    }

    this.group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        this.draggableObjects.push(child);
      }
    });
  }

  onMouseDown(event) {
    if (event.button !== 0 || this.controls.mode !== 'orbit') return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.draggableObjects);

    if (intersects.length > 0) {
      this.controls.orbitControls.enabled = false;

      const mesh = intersects[0].object;
      this.selectedObject = mesh.userData.rootGroup || mesh;

      this.selectedObject.traverse((c) => {
        if (c.isMesh) c.material.emissive.set(0x555555);
      });

      const normal = new THREE.Vector3(0, 1, 0);
      this.dragPlane.setFromNormalAndCoplanarPoint(normal, this.selectedObject.position);
      document.body.style.cursor = 'grabbing';
    }
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (this.selectedObject && this.controls.mode === 'orbit') {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersection = new THREE.Vector3();

      if (this.raycaster.ray.intersectPlane(this.dragPlane, intersection)) {
        this.selectedObject.position.x = intersection.x;
        this.selectedObject.position.z = intersection.z;
      }

      if (this.keyStates['ArrowUp']) this.selectedObject.position.y += this.MOVE_SPEED;
      if (this.keyStates['ArrowDown']) {
        this.selectedObject.position.y -= this.MOVE_SPEED;
        const minHeight = 0.5;
        if (this.selectedObject.position.y < minHeight) {
          this.selectedObject.position.y = minHeight;
        }
      }
    } else {
      this.draggableObjects.forEach(obj => obj.material.emissive.set(0x000000));

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.draggableObjects);
      if (intersects.length > 0) {
        intersects[0].object.material.emissive.set(0x333333);
      }
    }
  }

  onMouseUp() {
    if (this.selectedObject) {
      this.selectedObject.traverse((c) => {
        if (c.isMesh) c.material.emissive.set(0x000000);
      });

      this.selectedObject = null;
      this.controls.orbitControls.enabled = true;
      document.body.style.cursor = 'auto';
    }
  }
}
