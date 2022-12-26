import * as THREE from "./node_modules/three/build/three.module.js";
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from './node_modules/three/examples/jsm/controls/DragControls.js';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "./node_modules/three/build/three.module.js";
import { Helper } from './helper/helper.js';
import { Window_resize } from './helper/Window_resize.js';
import * as Public_tool from './helper/public_tool.js';
import * as Click_down from './helper/click_down.js';
import { Upload_file } from './helper/upload_file.js';
import { ViewCube } from "./ViewCube.js";
let camera, scene, renderer;
let controller;
let group, controls;
let objects = [];
let loadedScene = null;


const ViewerUI = {
  fileInput: document.getElementById('avatar')
}


 //load GLTF
 function loadModel(url) {
	
  if (loadedScene) {
    scene.remove(loadedScene);
    loadedScene = null;
    loadedMeshes.length = 0;
  }
  const gltfLoad=new GLTFLoader;
  gltfLoad.load(url, function (gltf){
    
    loadedScene = gltf.scene;
    scene.add(gltf.scene); 
  
    });
}

// ViewerUI.fileInput.addEventListener('click', function(evt) {
//   let file = evt.target.files[0];
//   console.log(123)
//   if (file) {
//   let reader = new FileReader();
//   reader.onload = function(e) {
//     loadModel(e.target.result);
//   }
//   reader.onerror = function(err) {
//     ViewerUI.loaderInfo.innerHTML = 'Error reading file! See console for more info.';
//     console.error(err);
//   }
//   reader.readAsDataURL(file);
//   }
// });
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

function setControl() {
  controller = new OrbitControls(camera, renderer.domElement);
  controller.screenSpacePanning = true;
  controller.mouseButtons = { LEFT: null, MIDDLE: MOUSE.PAN, RIGHT: null };
}

init();
function init() {
  InitScene();
  CreateCamera();
  InitRender();
  setControl();
  group = new THREE.Group();
  scene.add(group);
  let window_resize = new Window_resize(camera, renderer);
  let helper = new Helper(scene, camera, renderer);
  // let uploadfile = new Upload_file('fileInput', scene);
  document.addEventListener('mousemove', event => { Public_tool.Get_MousePosition(event, camera, scene) });
  document.addEventListener('click', event => { Public_tool.Get_MousePosition(event, camera, scene) });
   controls = new DragControls([...objects], camera, renderer.domElement);
  // controls.addEventListener('drag', render);
  document.addEventListener('click',event=> {Click_down.InitDragControls(event,controls,scene)});
  const gltfLoad = new GLTFLoader;
  // gltfLoad.load('空.gltf', function (gltfScene) {
  //   scene.add(gltfScene.scene);
  // });
  let viewCube = new ViewCube(camera, renderer, controller);
 
  window.addEventListener( 'keydown',Click_down.onKeyDown );
  window.addEventListener( 'keyup', Click_down.onKeyUp );
  var input = document.getElementById( 'input' );
	input.addEventListener( 'change', function( event ) {
		
		var file = this.files[ 0 ];
		var reader = new FileReader();
		
		reader.addEventListener( 'load', function ( event ) {

			var contents = event.target.result;

			var geometry = new STLLoader().parse( contents );
			var material = new THREE.MeshStandardMaterial();
			var mesh = new THREE.Mesh( geometry, material );
			
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			
			scene.add( mesh );

		}, false );
		
		if ( reader.readAsBinaryString !== undefined ) {

			reader.readAsBinaryString( file );

		} else {

			reader.readAsArrayBuffer( file );

		}
		
	} );

  
  render();
}
