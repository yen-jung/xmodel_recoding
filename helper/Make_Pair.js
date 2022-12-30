import * as Click_down from './clickdown.js';
let ViewerUI;

class MakePair {
    constructor(surebtn,system_name,function_name){
        ViewerUI = {
            make_pairBtn: document.getElementById(make_pair),
            SureBtn: document.getElementById(surebtn),
            System_Name:document.getElementById(system_name),
            Function_Name:document.getElementById(function_name)

        }
        ViewerUI.SureBtn.addEventListener('click', event => {Give_Systerm()});

        function Give_Systerm(){
            ViewerUI.System_Name.value='';
            ViewerUI.Function_Name.value='';
            var System = ViewerUI.System_Name.value ;
            var Function = ViewerUI.Function_Name.value ;
            for(var i=0;i<Click_down.pair_of_connector.length;i++){
                for(var j=0;j<Click_down.pair_of_connector[i].children.length;j++){
                    Click_down.pair_of_connector[i].children[j].userData={SystermName:System,FunctionName:Function};
                    Click_down.pair_of_connector[i].children[j].material.emissive.set(0xffd770);
                }
            }
        }
        
    }
}

export{MakePair}