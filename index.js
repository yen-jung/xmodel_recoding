import * as THREE from "./node_modules/three/build/three.module.js";
import { Helper } from './helper/helper.js';
import { Window_resize } from './helper/Window_resize.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from './node_modules/three/examples/jsm/exporters/GLTFExporter.js';
import { DragControls } from './node_modules/three/examples/jsm/controls/DragControls.js';
import * as Public_tool from './helper/public_tool.js';
import * as Click_down from './helper/clickdown.js';
import * as filemanage from './helper/file.js';
import {AddObject} from './helper/Add_Object.js';
import { ViewCube } from "./ViewCube.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "./node_modules/three/build/three.module.js";
import {MakePair} from './helper/Make_Pair.js';
import {GUI} from "./node_modules/dat.gui/build/dat.gui.module.js";

let camera, scene, renderer;
let controller;
let controls;
let objects = [];
let allobjects=[];
let loadedScene=null;
let loadedMeshes=null
let load;
let Create_Conector;
let type='';
let pointLight = new THREE.PointLight(0xffffff, 0.2);

let params={
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false
}
let clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
];

const ViewerUI = {
  exportFile:document.getElementById('exportBtn'),
  boundBtn:document.getElementById('boundary'),
  lineBtn:document.getElementById('add_line'),
  pairBtn:document.getElementById('make_pair'),
  ComponentBtn:document.getElementById('addComponentBtn'),
  connectorBtn:document.getElementById('connectorBtn'),
  clipBtn:document.getElementById('add_clip')
}

function InitScene() {
    //創建場景
    scene = new THREE.Scene();
  
    //設定背景顏色
    scene.background = new THREE.Color(0xf0f0f0);
  
}

function CreateCamera() {
    camera = new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2, window.innerHeight/2,window.innerHeight/-2, 1, 1000);
    // camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000000);
    camera.position.set(100, 200, 100);
    camera.lookAt(scene.position);
    scene.add(camera);
    camera.add(pointLight);

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

  function exportGLTF(input){
    const exporter =new GLTFExporter();
    const options = {
      trs: true,
      onlyVisible: true,
      binary: true,
      maxTextureSize: 8192
    };

    
    exporter.parse(input, function (result){
      if (result instanceof ArrayBuffer) {
  
        saveArrayBuffer(result, 'scene.glb');
  
    } else {
  
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, 'scene.gltf');
  
    }
  
  }, options);
  }
  const link = document.createElement( 'a' );
  link.style.display = 'none';
  document.body.appendChild( link ); 
  function save(blob,fileName){
    link.href=URL.createObjectURL(blob);
    link.download=fileName;
    link.click();
  }
  
  function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
  }
  
  function saveArrayBuffer(buffer,filename){
    save(new Blob([buffer],{ type: 'application/octet-stream' }),filename)
  }
  
  
  ViewerUI.exportFile.onclick =function exportScene1() {
  
    exportGLTF( scene );
  
  }
  function IsRotate(obj){
    for(var i=0; i<obj.children.length;i++){
      if(obj.children[i].rotation.x!=0){
        obj.children[i].rotation.x=0;
        obj.children[i].rotation.y=0;
        obj.children[i].rotation.z=0;
      }
    }
  }

  ViewerUI.clipBtn.onclick= function test(){
    document.getElementById("myDropdown").classList.toggle("show");
    
}

  $("#make_pair").click(function() {
    var href = $(this).attr("href")
    $(href).fadeIn(250);
    $(href).children("popup-box").removeClass("transform-out").addClass("transform-in");
    
  });
  
  $(".popup-close").click(function() {
    closeWindow();
  });
  function closeWindow(event){
    $(".popup-wrap").fadeOut(200);
    $(".popup-box").removeClass("transform-in").addClass("transform-out");
    event.preventDefault();
  }

  
  init();


  ViewerUI.boundBtn.onclick=function NowType(){
    type='add_bound';
  }
  ViewerUI.lineBtn.onclick=function NowType(){
    type='add_bound';
  }
  ViewerUI.pairBtn.onclick=function NowType(){
    type='add_bound';
  }
  ViewerUI.ComponentBtn.onclick=function NowType(){
    type='add_bound';
  }
  ViewerUI.connectorBtn.onclick=function NowType(){
    type='add_bound';
  }

  function keydown(e){
    if (e.key === "Escape"){
      type='';
    }
  }
  function init() {
    InitScene();
    CreateCamera();
    InitRender();
    setControl();
    let window_resize = new Window_resize(camera, renderer);
    let helper = new Helper(scene, camera, renderer);
    document.addEventListener('mousemove', event => { Public_tool.Get_MousePosition(event, camera, scene)});
    // document.addEventListener('input',event=> {loadfile(event)});
    window.addEventListener( 'keydown',Click_down.onKeyDown);
    window.addEventListener( 'keyup', Click_down.onKeyUp );
    window.addEventListener( 'keydown',event=> {keydown(event)});

    const gltfLoad = new GLTFLoader;
    gltfLoad.load('空.gltf', function (gltfScene) {
    // gltfScene.scene.scale.set(0.00328, 0.00328, 0.00328);
    Public_tool.IsGroup(gltfScene.scene);
    
    IsRotate(gltfScene.scene);
    scene.add(gltfScene.scene);
  });
  
    renderer.localClippingEnabled = true;
    let group = new THREE.Group();
    for (let i = 0; i <= 30; i += 2) {
      let geometry = new THREE.SphereGeometry(i / 30, 48, 24);
      let material = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
        side: THREE.DoubleSide,
        clippingPlanes: clipPlanes,
        // 更改剪裁平面的行为，以便仅剪切其交叉点，而不是它们的并集。默认值为 false。
        // 设置为true后剪切交集而不是并集
        clipIntersection: params.clipIntersection
      });

      group.add(new THREE.Mesh(geometry, material));
    }
    scene.add(group);
    
    let helpers = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(clipPlanes[0], 20, 0xff0000));
    helpers.add(new THREE.PlaneHelper(clipPlanes[1], 20, 0x00ff00));
    helpers.add(new THREE.PlaneHelper(clipPlanes[2], 20, 0x0000ff));
    helpers.visible = false;
    scene.add(helpers);
    let gui = new GUI();

    gui.add(params, 'clipIntersection').name('clip intersection').onChange(value=>{

      /*for(let item in group.children){
        item.material.clipIntersection = value;
      }*/

      let children = allobjects.children;
      
      for (let i = 0; i < children.length; i++) {
        children[i].material.clipIntersection = value;
      }

    });
    gui.add(params, 'planeConstant', -1, 10).step(0.1).name('plane constant').onChange(value=>{

      for (let i = 0; i < clipPlanes.length; i++) {
        clipPlanes[i].constant = value;
      }
    });

    gui.add(params, 'showHelpers').name('show helpers').onChange(value=>{
      helpers.visible = value;
    });

    Create_Conector= new AddObject(scene,"connectorBtn","addComponentBtn","boundary",renderer,camera,"add_line");
    controls = new DragControls([...objects], camera, renderer.domElement);
    document.addEventListener('click',event=> 
      { console.log(Public_tool.GetObject()[0])
        if(type!='add_bound'){
        Click_down.InitDragControls(event,controls,scene);
        }
      });
  
    let makepair=new MakePair('surebtn','system_name','function_name')
    
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

    
   
    
    
    
    render();
  }

  export{type}