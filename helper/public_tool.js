import * as THREE from "../node_modules/three/build/three.module.js";

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let intersects;
let objects=[];
function Get_MousePosition(event,camera,scene){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse,camera);
    intersects=raycaster.intersectObjects(scene.children,true);
}
function GetObject(){ 
  objects=[]
    for(var i=0;i<intersects.length;i++){
      let object=intersects[i].object;
      if(object&&object.name!='helper'&&object.name!='Axes'){
        objects.push(object);
      }
    }
    return objects;
}

function IsGroup(group) {
  for (var i = 0; i < group.children.length; i++) {
    let _mesh = group.children[i];
    if (_mesh.type == "Mesh") {
      _mesh.geometry.computeBoundingBox();
      var center = new THREE.Vector3();
      _mesh.geometry.boundingBox.getCenter(center);
      if (_mesh.position.x == 0 && _mesh.position.y == 0 && _mesh.position.z == 0) {
        _mesh.position.set(center.x, center.y, center.z);
        _mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

      }
    } else if (_mesh.type == "Group") {
     
      IsGroup(_mesh);
      
    }
    //若含有Object3D表示為元件，元件中的Object3D並未有boundingBox因此需要自行長中心點
    else if (_mesh.type == "Object3D") {
      let min_x = Number.MAX_SAFE_INTEGER;
      let min_y = Number.MAX_SAFE_INTEGER;
      let min_z = Number.MAX_SAFE_INTEGER;
      let max_x = Number.MIN_SAFE_INTEGER;
      let max_y = Number.MIN_SAFE_INTEGER;
      let max_z = Number.MIN_SAFE_INTEGER;
      for (let j = 0; j < _mesh.children.length; j++) {
        let m = _mesh.children[j];
        if (m.type == "Mesh") {
          let _boundingBox = m.geometry.boundingBox
          if (_boundingBox.min.x < min_x) {
            min_x = _boundingBox.min.x
          }
          if (_boundingBox.min.y < min_y) {
            min_y = _boundingBox.min.y
          }
          if (_boundingBox.min.z < min_z) {
            min_z = _boundingBox.min.z
          }
          if (_boundingBox.max.x > max_x) {
            max_x = _boundingBox.max.x
          }
          if (_boundingBox.max.y > max_y) {
            max_y = _boundingBox.max.y
          }
          if (_boundingBox.max.z > max_z) {
            max_z = _boundingBox.max.z
          }
        }
      }
      let c = new THREE.Vector3((min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2);
      //計算完中心點，要將所有group中的元件一起對中心點做偏移
      for (let j = 0; j < _mesh.children.length; j++) {
        let m = _mesh.children[j];
        if (m.type == "Mesh") {
          if (m.position.x == 0 && m.position.y == 0 && m.position.z == 0) {
            m.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));

          }
        }
      }
    }
  }
}

export{Get_MousePosition,GetObject,IsGroup,raycaster,mouse,intersects}