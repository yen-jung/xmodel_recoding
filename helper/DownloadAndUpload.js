import * as index from '../index.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from '../node_modules/three/examples/jsm/exporters/GLTFExporter.js';
import * as filemanage from './file.js';
let ViewerUI;
let link;
class DownloadAndUpload {
  constructor(exportFile_windows, importFile_windows, exportFile_DataBase, importFile_DataBase) {
    ViewerUI = {
      exportFilebtn_windows: document.getElementById(exportFile_windows),
      importFilebtn_windows: document.getElementById(importFile_windows),
      exportFilebtn_DataBase: document.getElementById(exportFile_DataBase),
      importFilebtn_DataBase: document.getElementById(importFile_DataBase)
    };
    
    link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    activate();

  }
}

function activate() {
  // ViewerUI.exportFilebtn_windows.addEventListener('click', event=>{exportGLTF()});
  ViewerUI.importFilebtn_windows.addEventListener('click', event=>{importGLTF(event)});
  // ViewerUI.exportFilebtn_DataBase.addEventListener('click', function exportScene1() {
  //   exportGLTF(index.scene);
  // })

  // ViewerUI.importFilebtn_DataBase.addEventListener('click', function exportScene1() {
  //   exportGLTF(index.scene);
  // })

}
//下載GLTF
function exportGLTF() {
  const exporter = new GLTFExporter();
  const input=index.scene;
  const options = {
    trs: true,
    onlyVisible: true,
    binary: true,
    maxTextureSize: 8192
  };
  exporter.parse(input, function (result) {
    if (result instanceof ArrayBuffer) {
      save(new Blob([result], { type: 'application/octet-stream' }), 'scene.glb')
    } else {
      let t = 'mindlogic';
      const output = JSON.stringify(result, null, 2);
      filemanage.DownLoad(t, 'test', 'scene.gltf', new Blob([output], { type: 'text/plain' }))
      save(new Blob([output], { type: 'text/plain' }), 'scene.gltf');
    }
  }, options);
}

function save(blob, fileName) {
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

//load GLTF

function importGLTF(event){
  let file = event.target.files[0];
  const gltfLoad = new GLTFLoader();
  let t = 'mindlogic';
  filemanage.UpLoad(t, 'test', file.name).then(res => {
    let pointdata = res.data;
    gltfLoad.load(pointdata, (gltf) => {
      index.scene.add(gltf.scene);
    })
  })
}
export{DownloadAndUpload}