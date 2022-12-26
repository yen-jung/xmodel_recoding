
import { MOUSE, Object3D, Vector3 } from "./node_modules/three/build/three.module.js";
import * as THREE from "./node_modules/three/build/three.module.js";
    let re = false;
    let camera,renderer,controls;
    let camera_position,camera_rotate;
class ViewCube{
  constructor(_camera, _renderer, _controls){
      
    AddCube_Html();
    AddCube_Css();
    camera = _camera;
    renderer = _renderer;
    controls = _controls;
    var ViewCube_front = document.getElementById('ViewCube_front_button');
    var ViewCube_back = document.getElementById('ViewCube_back_button');
    var ViewCube_right = document.getElementById('ViewCube_right_button');
    var ViewCube_left = document.getElementById('ViewCube_left_button');
    var ViewCube_top = document.getElementById('ViewCube_top_button');
    var ViewCube_bottom = document.getElementById('ViewCube_bottom_button');
    ViewCube_front.addEventListener('click',e=>{ClickViewCube('front')}, true);
    ViewCube_back.addEventListener('click', e=>{ClickViewCube('back')}, true);
    ViewCube_right.addEventListener('click', e=>{ClickViewCube('right')}, true);
    ViewCube_left.addEventListener('click', e=>{ClickViewCube('left')}, true);
    ViewCube_top.addEventListener('click', e=>{ClickViewCube('top')}, true);
    ViewCube_bottom.addEventListener('click', e=>{ClickViewCube('bottom')}, true);

    var cube = document.querySelector('.ViewCube_cube');
    renderer.setAnimationLoop(() => {
    var mat = new THREE.Matrix4();
      mat.extractRotation( camera.matrixWorldInverse );
    cube.style.transform = `translateZ(-300px) ${getCameraCSSMatrix( mat )}`;
    });
    console.log(cube.style.transform);
    function getCameraCSSMatrix(matrix) {
    
      var elements = matrix.elements;
      
      return 'matrix3d(' +
        epsilon(elements[0]) + ',' +
        epsilon(-elements[1]) + ',' +
        epsilon(elements[2]) + ',' +
        epsilon(elements[3]) + ',' +
        epsilon(elements[4]) + ',' +
        epsilon(-elements[5]) + ',' +
        epsilon(elements[6]) + ',' +
        epsilon(elements[7]) + ',' +
        epsilon(elements[8]) + ',' +
        epsilon(-elements[9]) + ',' +
        epsilon(elements[10]) + ',' +
        epsilon(elements[11]) + ',' +
        epsilon(elements[12]) + ',' +
        epsilon(-elements[13]) + ',' +
        epsilon(elements[14]) + ',' +
        epsilon(elements[15]) +
        ')';
    
    }
    function epsilon( value ) {
    
      return Math.abs( value ) < 1e-10 ? 0 : value;
    
    }
    animate();
  }
}
function AddCube_Html(){
  let scene = document.createElement("div");
  scene.className = "ViewCube_scene";
  let cube = document.createElement("div");
  cube.className = "ViewCube_cube";
  let front_button = document.createElement("div");
  front_button.className = "ViewCube_cube__face cube__face--front";
  front_button.id = "ViewCube_front_button";
  front_button.textContent = "前";
  let back_button = document.createElement("div");
  back_button.className = "ViewCube_cube__face cube__face--back";
  back_button.id = "ViewCube_back_button";
  back_button.textContent = "後";
  let right_button = document.createElement("div");
  right_button.className = "ViewCube_cube__face cube__face--right";
  right_button.id = "ViewCube_right_button";
  right_button.textContent = "右";
  let left_button = document.createElement("div");
  left_button.className = "ViewCube_cube__face cube__face--left";
  left_button.id = "ViewCube_left_button";
  left_button.textContent = "左";
  let top_button = document.createElement("div");
  top_button.className = "ViewCube_cube__face cube__face--top";
  top_button.id = "ViewCube_top_button";
  top_button.textContent = "上";
  let bottom_button = document.createElement("div");
  bottom_button.className = "ViewCube_cube__face cube__face--bottom";
  bottom_button.id = "ViewCube_bottom_button";
  bottom_button.textContent = "下";
  cube.appendChild(front_button);
  cube.appendChild(back_button);
  cube.appendChild(right_button);
  cube.appendChild(left_button);
  cube.appendChild(top_button);
  cube.appendChild(bottom_button);
  scene.appendChild(cube);
  document.body.insertBefore(scene,document.body.firstChild);
}
function AddCube_Css(){
  var styleSheet = document.createElement("style");
  var style_scene =
  '.ViewCube_scene { \
    width: 100px;\
    height:100px;\
    border: 1px solid #CCC;\
    margin: 10px;\
    perspective: 400px;\
    position: absolute;\
    right: 0px;\
  }';
  var style_cube =
  '.ViewCube_cube {\
    width: 100px;\
    height: 100px;\
    position: relative;\
    transform-style: preserve-3d;\
    transform: translateZ(-300px);\
  }';
  var style_cube__face = 
  '.ViewCube_cube__face {\
    position: absolute;\
    width: 100px;\
    height: 100px;\
    border: 2px solid black;\
    line-height: 100px;\
    font-size: 30px;\
    font-weight: bold;\
    background-color:rgb(255, 255, 200);\
    text-align: center;\
  }';
  var style_cube__face_button = 
  '.cube__face button{\
    width: 100px;\
    height: 100px;\
    background: transparent;\
    background: rgba(255, 255, 200, 1);\
    border-width: 0px;\
    font-size:30px;\
    font-weight:bold\
  }';

  var style_cube_front = 
  '.cube__face--front {\
    transform: rotateY(0deg) rotateX(180deg) translateZ(-50px);\
  }'

  var style_cube_right = 
  '.cube__face--right {\
    transform: rotateY(90deg) rotateX(180deg) translateZ(-50px);\
  }'

  var style_cube_back = 
  '.cube__face--back {\
    transform: rotateY(180deg) rotateX(180deg) translateZ(-50px);\
  }'
  
  var style_cube_left = 
  '.cube__face--left {\
    transform: rotateY(-90deg) rotateX(180deg) translateZ(-50px);\
  }'
  
  var style_cube_top = 
  '.cube__face--top {\
    transform: rotateX(-90deg) rotateX(180deg) translateZ(-50px);\
  }'
  
  var style_cube_bottom = 
  '.cube__face--bottom {\
    transform: rotateX(90deg) rotateX(180deg) translateZ(-50px);\
  }'
  
  styleSheet.innerText = style_scene+style_cube+style_cube__face+style_cube__face_button+style_cube_front+style_cube_right+style_cube_back+style_cube_left+style_cube_top+style_cube_bottom;
  document.head.appendChild(styleSheet);
}
function animate() {
    requestAnimationFrame(animate);
    if(re){
      controls.enabled = false;
      let x = camera.position.x;
      let y = camera.position.y;
      let z = camera.position.z;
      let speedx = (x - camera_position.x)/10;
      let speedy = (y - camera_position.y)/10;
      let speedz = (z - camera_position.z)/10;
      let bR = false,bP = false;
      //相機位置
      if(Vector3IsEqual(camera.position,camera_position))
      {
        bP = true;
      }
      else {
        camera.position.set(x-speedx,y-speedy,z-speedz);
        controls.update();
      }
      let Rx = controls.target.x;
      let Ry = controls.target.y;
      let Rz = controls.target.z;
      let speedRx = Rx/10;
      let speedRy = Ry/10;
      let speedRz = Rz/10;
      //相機角度
      if(Vector3IsEqual(controls.target,controls.target0)){
        bR = true;
      }
      else{
        controls.target.set(Rx-speedRx,Ry-speedRy,Rz-speedRz);
        controls.update();
      }
      if(bR && bP){
        re = false;
        controls.enabled = true;
      }
    }
    function Vector3IsEqual(value,value2){
        let x = Math.abs(value.x-value2.x);
        let y = Math.abs(value.y-value2.y);
        let z = Math.abs(value.z-value2.z);
        if(x<1e-2&&y<1e-2&&z<1e-2){
          return true;
        }
        else {
          return false;
        }
      }
  }
  function ClickViewCube(value) {
  
    //controls.target.set(controls.target0.x,controls.target0.y,controls.target0.z);
    switch (value) {
      case "front":
        re = true;
        camera_position = new Vector3(0,0,60)
        break;
      case "back":
        re = true;
        camera_position = new Vector3(0,0,-60)
        break;
      case "right":
        re = true;
        camera_position = new Vector3(60,0,0)
        break;
      case "left":
        re = true;
        camera_position = new Vector3(-60,0,0)
        break;
      case "top":
        re = true;
        camera_position = new Vector3(0,60,0)
        break;
      case "bottom":
        re = true;
        camera_position = new Vector3(0,-60,0)
        break;
    }
  }
  export {ViewCube}