import * as THREE from "../node_modules/three/build/three.module.js";
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import * as Public_tool from './public_tool.js';
import * as index from '../index.js';
import { SelectionBox } from '../node_modules/three/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from '../node_modules/three/examples/jsm/interactive/SelectionHelper.js';
import { LineMaterial } from '../node_modules/three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from '../node_modules/three/examples/jsm/lines/LineGeometry.js';

let ViewerUI;
let scene,camera,renderer;
let connector = false;
let  _component= false;
let _bound=false;
let  _line= false;
let component;
let mouse_position;
let r = 90;
const degree = r * Math.PI / 180;
let selectionBox = new SelectionBox(camera, scene);
let helperbox;
let sp = [];
let ep = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let intersects;
let type;

class AddObject {
    constructor(_scene, _connector,addComponent,bound,_renderer,_camera,line) {
        scene = _scene;
        renderer=_renderer;
        camera=_camera;
        ViewerUI = {
            connectorBtn: document.getElementById(_connector),
            addComponentBtn: document.getElementById(addComponent),
            boundBtn:document.getElementById(bound),
            lineBtn:document.getElementById(line)
        }
        ViewerUI.connectorBtn.addEventListener('click', event => { connector = true;activate() });
        ViewerUI.addComponentBtn.addEventListener('click', event => { _component = true;activate() });
        ViewerUI.lineBtn.addEventListener('click', event => {Create_Line()});
        document.addEventListener('mousemove',event => { onPointerMove(event)});
        ViewerUI.boundBtn.addEventListener('click',event => {_bound=true; helperbox = new SelectionHelper(renderer, 'selectBox'); activate();return type});
        document.addEventListener('pointerdown', event => { GetStartpoint(event)});
        document.addEventListener('pointerup', event => { GetEndpoint(event)});
      
        // activate();

        function dispose(){
            document.removeEventListener('click', event => { clickDown() });
           
            document.removeEventListener('keydown', event => { onKeyDown(event)});
        }
        function activate() {
            document.addEventListener('click', event => { clickDown() });
           
            document.addEventListener('keydown', event => { onKeyDown(event)});
        }


        function clickDown(type) {
            if (connector&&Public_tool.intersects.length > 0 && Public_tool.intersects[0].object.name != 'helper' && Public_tool.intersects[0].object.name != 'Axes') {
                CreateConector();
            }
            else if (_component==true&&Public_tool.intersects.length > 0  && Public_tool.intersects[0].object.name != 'helper' && Public_tool.intersects[0].object.name != 'Axes') {
                AddCompoent();
            }
        }
        function CreateConector() {
            if (Public_tool.intersects[0] !== null) {
                if (Public_tool.intersects.length > 0) {
                    var geometry = new THREE.SphereGeometry(0.2, 16, 16);
                    var material = new THREE.MeshPhongMaterial({
                        color: 0xff0000
                    });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.userData.uuid = mesh.uuid;
                    mesh.position.set(Public_tool.intersects[0].point.x, 20, Public_tool.intersects[0].point.z);
                    scene.add(mesh);
                }
            }
        }
        function AddCompoent(){
            if (Public_tool.intersects[0] !== null) {
                if (Public_tool.intersects.length > 0) {
                    const gltfLoad = new GLTFLoader;
                    gltfLoad.load('乾盤管.gltf', function (gltfScene) {
                        Public_tool.IsGroup(gltfScene.scene);
                        component=gltfScene.scene.children[0];
                        component.scale.set(0.00328, 0.00328, 0.00328);
                        component.position.set(mouse_position.x,mouse_position.y,mouse_position.z);
                        component.rotation.z=degree;
                        component.rotation.x=degree;
                        scene.add(component); 
                      });
                }
            }  
        }
        function onKeyDown(e) {
            if (e.key === "Escape"){
                _bound=false;
                if(helperbox){
                  helperbox.dispose();
                }
                dispose();
                connector=false;
                _component=false;
            }
        }
        function onPointerMove(){
            for(let i=0;i<Public_tool.intersects.length;i++){
                if(_component==true&&component&&Public_tool.intersects[i].object.name.includes('RC')){
                    Public_tool.intersects[i].object.geometry.computeBoundingBox();
                    var bound_max= Public_tool.intersects[i].object.geometry.boundingBox.max;
                    var bound_min= Public_tool.intersects[i].object.geometry.boundingBox.min;
                    var bounding_sub=bound_max.sub(bound_min);
                    let vector;
                    if(bounding_sub.x>bounding_sub.z){
                        component.rotation.z=2*degree;
                        component.rotation.x=-degree;
                        scene.add(component); 
                        vector=new THREE.Vector3().copy(Public_tool.intersects[i].point).floor().addScalar(0.5);
                        vector.set(vector.x, vector.y, vector.z+bounding_sub.z/2);
                    }else{
                        component.rotation.z=-degree;
                        component.rotation.x=-degree;
                        scene.add(component);
                        vector=new THREE.Vector3().copy(Public_tool.intersects[i].point).floor().addScalar(0.5);
                        vector.set(vector.x+bounding_sub.x/2, vector.y, vector.z);
                    }
                    component.position.set( vector.x, vector.y, vector.z);
                    mouse_position=component.position;
                    break;
                }
            }
        }
        function createBound(ep,sp) {
            let l = ep[0] - sp[0];
            let w = ep[2] - sp[2];
            const cube = new THREE.BoxGeometry(Math.abs(l), 20, Math.abs(w));
            const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xbffebf, transparent: true, opacity: 0.8 });
            const bound = new THREE.Mesh(cube, cubeMaterial);
            bound.name = "cube";
            var c1 = (ep[0] - sp[0]) / 2;
            var c2 = (ep[2] - sp[2]) / 2;
            bound.position.set(sp[0] + c1, sp[1] / 2, sp[2] + c2);
            bound.castShadow = true;
            bound.receiveShadow = true;
            scene.add(bound);
            return type;
          }
          function GetStartpoint(event){
            if(_bound ){
              selectionBox.startPoint.set((event.clientX / window.innerWidth) * 2 - 1,- (event.clientY / window.innerHeight) * 2 + 1,0.5);
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
              mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
              raycaster.setFromCamera(mouse, camera);
              intersects = raycaster.intersectObjects(scene.children, true);
              sp = [];
              sp.push(intersects[0].point.x, 20, intersects[0].point.z);
            }
          }
          function GetEndpoint(event){
            if (_bound ) {
              selectionBox.endPoint.set((event.clientX / window.innerWidth) * 2 - 1,- (event.clientY / window.innerHeight) * 2 + 1,0.5);
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
              mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
              raycaster.setFromCamera(mouse, camera);
              intersects = raycaster.intersectObjects(scene.children, true);
              ep=[];
              ep.push(intersects[0].point.x, 20, intersects[0].point.z);
              createBound(ep,sp);
            }
          }

          function Create_Line(){
            const material = new THREE.LineBasicMaterial( { color: 0x24afb2,linewidth: 12 } );
            const points = [];
            points.push( new THREE.Vector3( 1, 20, -5 ) );
            points.push( new THREE.Vector3( 5, 20, -5 ) );
            points.push( new THREE.Vector3( 5, 15, -15 ) );
            points.push( new THREE.Vector3( 50, 20, -10 ) );
            points.push( new THREE.Vector3( 80, 20, -30 ) );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            scene.add( line );
          }
          
    }
}

export { AddObject,connector,type}