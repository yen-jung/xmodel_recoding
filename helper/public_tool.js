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

export{Get_MousePosition,GetObject,raycaster,mouse,intersects}