import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let ViewerUI;
let loadedScene = null;
class Upload_file {

    constructor(upload_file, scene) {
        ViewerUI = {
            uploadBtn: document.getElementById(upload_file)
        }
        active();
        function active() {
            document.addEventListener('input', event => { Load_file(event) })
             
        }
        function loadModel(url){
            // resetAll();
            if(loadedScene){
                scene.remove(loadedScene);
                loadedScene = null;
                loadedMeshes.length = 0;
            }
            const gltfLoad=new GLTFLoader;
            gltfLoad.load(url, function (gltf){
                loadedScene = gltf.scene;
                scene.add(gltf.scene); 
            })
        }
        function Load_file(event) {
            const file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    loadModel(e.target.result);
                  }
                  reader.onerror = function(err) {
                    ViewerUI.loaderInfo.innerHTML = 'Error reading file! See console for more info.';
                    console.error(err);
                  }
                  reader.readAsDataURL(file);
            }
         
        }

    }
}

export { Upload_file }