import * as THREE from "./node_modules/three/build/three.module.js";


let camera, scene, renderer;
let controller;
let group, controls;
let objects = [];


function InitScene() {
    //創建場景
    scene = new THREE.Scene();
  
    //設定背景顏色
    scene.background = new THREE.Color(0xf0f0f0);
  
}

function CreateCamera() {
    // camera = new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2, window.innerHeight/2,window.innerHeight/-2, 1, 1000);
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000000);
    camera.position.set(100, 200, 100);
    camera.lookAt(scene.position);
    scene.add(camera);
}

function InitRender() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  }

  function render() {
    requestAnimationFrame(render);
    //渲染
    renderer.render(scene, camera);
    
    // composer.render();
  }

  

  init();

  function init() {
    InitScene();
    CreateCamera();
    InitRender();
    
    
 
  
    
    render();
  }