import * as THREE from "../node_modules/three/build/three.module.js";
import * as Public_tool from './public_tool.js';

let ViewerUI;
let scene;
let connector = false;

class AddObject {
    constructor(_scene, _connector) {
        scene = _scene;
        ViewerUI = {
            connectorBtn: document.getElementById(_connector)
        }
        ViewerUI.connectorBtn.addEventListener('click', event => { connector = true;activate() });
      
        // activate();

        function dispose(){
            document.removeEventListener('click', event => { clickDown() });
           
            document.removeEventListener('keydown', event => { onKeyDown(event)});
        }
        function activate() {
            document.addEventListener('click', event => { clickDown() });
           
            document.addEventListener('keydown', event => { onKeyDown(event)});
        }


        function clickDown() {
            if (connector&&Public_tool.intersects.length > 0 && Public_tool.intersects[0].object.name != 'helper' && Public_tool.intersects[0].object.name != 'Axes') {
                CreateConector();
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
        function onKeyDown(e) {
            if (e.key === "Escape"){
                dispose();
                connector=false;
                
            }
        }
    }

}

export { AddObject,connector}