function UpLoad(token,projectname,filename){
    var uploadFile={
        token:token,
        projectName:projectname,
        fileName:filename
    }

    const request = axios.post(
        'http://203.64.97.140:3000/Model/Download_FromUrl',uploadFile,{headers:{'Content-Type':'application/json'}}
    )
    
    return request;
}

function DownLoad(token,projectname,filename,file){
    var downloadFile={
        token:token,
        projectName:projectname,
        fileName:filename,
        files:file
    }

    const request = axios.post(
        'http://203.64.97.140:3000/Model/Upload',downloadFile,{headers:{'Content-Type':'multipart/form-data'}}
    )
    
    return request;
}
export{UpLoad,DownLoad};