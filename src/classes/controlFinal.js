import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canJump = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let prevTime = performance.now();

export class CombinedControls {
  constructor(camera, domElement, scene) {
    this.camera = camera;
    this.domElement = domElement;
    this.scene = scene;

    this.pointerControls = new PointerLockControls(camera, domElement);
    this.orbitControls = new OrbitControls(camera, domElement);

    this.scene.add(this.pointerControls.object); // Fix for deprecated 'object'
    this.mode = 'orbit';
    this.enabled = true;
    this.shouldEnterPointer = false; // Flag for waiting for click after WASD

    this.initListeners();
  }

  initListeners() {
    // Listen for click to enter pointer lock mode after WASD press
    this.domElement.addEventListener('click', () => {
      if (this.shouldEnterPointer) {
        this.shouldEnterPointer = false; // Reset flag
        this.switchToPointer(); // Switch to pointer lock mode
      } else if (this.mode === 'pointer') {
        this.switchToOrbit(); // Switch back to orbit mode
      }
    });

    // Listen for keydown to detect WASD and set flag
    document.addEventListener('keydown', (e) => {
      if (this.mode === 'orbit' && ['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        this.shouldEnterPointer = true; // Flag that user needs to click for pointer lock
      }

      switch (e.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyD': moveRight = true; break;
        case 'Space':
          if (canJump) velocity.y += 350;
          canJump = false;
          break;
      }
    });

    // Listen for keyup to stop movement
    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyD': moveRight = false; break;
      }
    });

    // PointerLockControls unlock event to switch to Orbit mode
    this.pointerControls.addEventListener('unlock', () => {
      this.switchToOrbit();
    });
  }

  switchToPointer() {
    // Switch to Pointer Lock mode (disable OrbitControls and lock pointer)
    this.orbitControls.enabled = false;
    this.pointerControls.lock();
    this.mode = 'pointer';
    document.body.style.cursor = 'none';
  }

  switchToOrbit() {
    // Switch to OrbitControls mode (unlock pointer and reset target)
    this.pointerControls.unlock();
    const currentPos = this.camera.position.clone();
    const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const targetPos = currentPos.clone().add(lookDir);

    this.orbitControls.enabled = true;
    this.orbitControls.target.copy(targetPos);
    this.mode = 'orbit';
    document.body.style.cursor = 'auto';
    this.orbitControls.update();
  }

  updateMovement() {
    if (this.mode !== 'pointer') return;

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    this.pointerControls.moveRight(-velocity.x * delta);
    this.pointerControls.moveForward(-velocity.z * delta);
    this.pointerControls.object.position.y += velocity.y * delta;

    if (this.pointerControls.object.position.y < 10) {
      velocity.y = 0;
      this.pointerControls.object.position.y = 10;
      canJump = true;
    }

    prevTime = time;
    this.orbitControls.target.copy(this.pointerControls.object.position);
  }

  update() {
    if (!this.enabled) return;

    if (this.mode === 'orbit') {
      this.orbitControls.update();
    } else if (this.mode === 'pointer') {
      this.updateMovement();
    }
  }
}
