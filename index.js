import * as THREE from "./node_modules/three/build/three.module.js";
import { Helper } from './helper/helper.js';
import { Window_resize } from './helper/Window_resize.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from './node_modules/three/examples/jsm/controls/DragControls.js';
import * as Public_tool from './helper/public_tool.js';
import * as Click_down from './helper/clickdown.js';
import * as filemanage from './helper/file.js';
import {AddObject} from './helper/Add_Object.js';
import { ViewCube } from "./ViewCube.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "./node_modules/three/build/three.module.js";
import {MakePair} from './helper/Make_Pair.js';

let camera, scene, renderer;
let controller;
let controls;
let objects = [];
let loadedScene=null;
let loadedMeshes=null
let load;


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


 function test(evt) {
    let file = evt.target.files[1];
    if (file) {
      importGLTF(file);
    let reader = new FileReader();
    reader.onload = function(e) {
      loadModel(e.target.result);
    }
    reader.onerror = function(err) {
      ViewerUI.loaderInfo.innerHTML = 'Error reading file! See console for more info.';
      console.error(err);
    }
    // reader.readAsDataURL(file);
    }
  };
// function loadModel(evt) {
 
//   let file = evt.target.files[0];

//   let buffer = new TextEncoder().encode(file);

//   const gltfLoad=new GLTFLoader;
//   gltfLoad.load(url, function (gltf){
      
//         loadedScene = gltf.scene;
//         scene.add(gltf.scene); 
      
//         });
// }
  // function test(evt){
  //   let file = evt.target.files[0];
  //   var reader = new FileReader();
  //   reader.addEventListener=('load', function ( event ){
  //     var contents = event.target.result;
  //     var loader;


  //       loader = new GLTFLoader;
      
  //     loader.load(url, function (gltf){
      
  //             loadedScene = gltf.scene;
  //             scene.add(gltf.scene); 
            
  //             });

  //   }, false );

  //   reader.readAsArrayBuffer( file );
  //   console.log(123)

  // }

  function importGLTF(file){
    const gltfLoad = new GLTFLoader();
    let t = 'mindlogic';
    filemanage.UpLoad(t, 'test', '空.gltf').then(res => {
      let pointdata = res.data;
      gltfLoad.load(pointdata, (gltf) => {
        scene.add(gltf.scene);
      })
    })
  }

  $("#make_pair").click(function() {
    var href = $(this).attr("href")
    $(href).fadeIn(250);
    $(href).children("popup-box").removeClass("transform-out").addClass("transform-in");
    
  });
  
  $(".popup-close").click(function() {
    closeWindow();
  });
  function closeWindow(){
    $(".popup-wrap").fadeOut(200);
    $(".popup-box").removeClass("transform-in").addClass("transform-out");
    event.preventDefault();
  }

  init();

  function init() {
    InitScene();
    CreateCamera();
    InitRender();
    setControl();
    let window_resize = new Window_resize(camera, renderer);
    let helper = new Helper(scene, camera, renderer);
    document.addEventListener('mousemove', event => { Public_tool.Get_MousePosition(event, camera, scene) });
    // document.addEventListener('input',event=> {loadfile(event)});

    
    window.addEventListener( 'keydown',Click_down.onKeyDown );
    window.addEventListener( 'keyup', Click_down.onKeyUp );
    
  
    let Create_Conector= new AddObject(scene,"connectorBtn");
   
    controls = new DragControls([...objects], camera, renderer.domElement);
    document.addEventListener('click',event=> {Click_down.InitDragControls(event,controls,scene)});
    
    let makepair=new MakePair('make_pair')
    
    const loader = new GLTFLoader();
    document.getElementById("clickMe").onclick = doFunction;
    function doFunction() {
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple="multiple"
      input.onchange = event => {importGLTF(event);
            };
      input.click();
      
    }

    const gltfLoad = new GLTFLoader;
    gltfLoad.load('空.gltf', function (gltfScene) {
 
    
    
    scene.add(gltfScene.scene);
  
  });
   
    
    
    
    render();
  }