
 let camera,renderer;
class Window_resize {
    constructor(_camera,_renderer) {
        camera=_camera;
        renderer=_renderer
        activate();

        function activate() {
            window.addEventListener('resize', windowResize);
        }
        function windowResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            // composer.setSize(width, height);
            // effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        };
    }
    
    }

export{Window_resize}

