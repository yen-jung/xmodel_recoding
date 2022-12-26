import * as THREE from "../node_modules/three/build/three.module.js";
import { DragControls } from '../node_modules/three/examples/jsm/controls/DragControls.js';
import * as Public_tool from './public_tool.js';

let _scene;
let enableSelection = false;
let mutiselect = false;
let objects = [];


function onKeyDown(event) {

    enableSelection = (event.keyCode === 16) ? true : false;
    mutiselect = (event.keyCode === 17) ? true : false;
}
function onKeyUp() {

    enableSelection = false;
    mutiselect = false;

}

function GetColor(object,color){
    if(object.name.includes('(WXH)')){
        for (let i = 0; i < object.parent.children.length; i++){
            object.currentHex= object.material.emissive.getHex();
            object.parent.children[i].material.emissive.set(color);
        }
    }
    else{
        object.currentHex= object.material.emissive.getHex();
        object.material.emissive.set(0xf0fff0);
    }
    
    
}

function IsDW() {
    let group=new THREE.Group();
    _scene.add(group);
    let _object=Public_tool.GetObject();
            if(IsObject()==null&&_object[0].name.includes('(WXH)')){
                const object = _object[0];
                GetColor(object,0xf0fff0);
                for (let i = 0; i < object.parent.children.length; i++) {
                    objects.push(object.parent.children[i]);
                    group.attach(object.parent);
                }
            }
        
    return group;
}

function IsStructcre(){
    let _object=Public_tool.GetObject();
    
        if(IsObject()==null&&!_object[0].name.includes('(WXH)')){
            GetColor(_object[0],0xf0fff0)
            objects.push(_object[0]);
            return _object[0];
        }
        return null;
    
}

function IsObject(){
    let _object=Public_tool.GetObject();
    if(typeof _object[0] =='undefined'&&_object[0]==null){
        return false;
    }
}
function InitDragControls(event, controls, scene) {
    event.preventDefault();
   _scene=scene;
   controls.object=[];
   const draggableObjects = controls.getObjects();
   draggableObjects.length = 0;
   
    if(IsDW().children.length>0&&!mutiselect){
        controls.transformGroup = true;
        draggableObjects.push(IsDW());
    }
    else if(IsStructcre()!=null&&!mutiselect){
        controls.transformGroup = false;
        draggableObjects.push(...objects);
    }
    if(enableSelection&&!mutiselect){
        let group=new THREE.Group();
        _scene.add(group);
        let _object=Public_tool.GetObject();
                if(_object[0].name.includes('(WXH)')){
                    for(var i=0;i<_object[0].parent.children.length;i++){
                        _object[0].parent.children[i].material.emissive.setHex(objects[0].currentHex);  
                    }
                    
                    objects=[];
                }

                else{
                    Public_tool.intersects[0].object.currentHex=0
                    Public_tool.intersects[0].object.material.emissive.setHex( Public_tool.intersects[0].object.currentHex);
                    objects=[];
                }
    }
   if(mutiselect){
        controls.object=[];
        let _group=new THREE.Group();
        Public_tool.intersects[0].object.currentHex = Public_tool.intersects[0].object.material.emissive.getHex();
        Public_tool.intersects[0].object.material.emissive.set(0xaaaaaa);
        if (Public_tool.intersects[0].object.name.includes('(WXH)')){
            Public_tool.intersects[0].object.currentHex = Public_tool.intersects[0].object.material.emissive.getHex();
            Public_tool.intersects[0].object.parent.children[i].material.emissive.set(0xaaaaaa);
            objects.push(Public_tool.intersects[0].object.parent.children[i]);
        }  else{
            objects.push(Public_tool.intersects[0].object);
          }
          for(var i=0;i<objects.length;i++){
            _group.attach(objects[i]);
      
          }
          scene.add(_group);
          controls.transformGroup = true;
          draggableObjects.push(_group);

    }
}

export { InitDragControls, onKeyUp, onKeyDown}