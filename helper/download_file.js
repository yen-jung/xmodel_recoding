import { GLTFExporter } from '../node_modules/three/examples/jsm/exporters/GLTFExporter.js';

let ViewerUI;

class Download_file{

  constructor(export_file){
    ViewerUI = {
      downloadBtn:document.getElementById(export_file)
    }
    active();
    function active() {
        document.addEventListener('click', event => { ExportGLTF(event) })
    }
    function ExportGLTF(input){
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
    },options);
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
  
  }
}