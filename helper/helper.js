
import * as THREE from "../node_modules/three/build/three.module.js";
let scene;
class Helper{
    constructor(_scene){
        scene=_scene;
        
        InitHelper();
        InitLight();
        function InitHelper() {
            let axes = new THREE.AxesHelper(100);
            axes.name = "Axes";
            scene.add(axes);

            //輔助網格
            const helper = new THREE.GridHelper(2000, 100)
            helper.position.y = -199;
            helper.material.opacity = 0.25;
            helper.material.transparent = true;
            helper.name = 'helper';
            scene.add(helper);
          }
          function InitLight() {
            let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
            scene.add(ambientLight);
            // 簡單的 spotlight 
            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40, 80, -10);
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 2000;
            spotLight.shadow.mapSize.height = 2000;
            scene.add(spotLight);
          }
         
    }


}
export{Helper}
