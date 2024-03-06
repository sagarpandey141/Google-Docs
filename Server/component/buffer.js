const document = require("../model/Document");

exports.saveDocument=async(id)=>{
     try{
       if(id==null) return;
       const documentdata=await document.findOne({id:id});
       if(documentdata) return documentdata;
       return await document.create({id:id,data:""})
     } catch(error){
        console.log("error",error)
     }
}

exports.UpdateDocument=async(id,data)=>{
   return await document.findByIdAndUpdate({id:id},{data:data});
}