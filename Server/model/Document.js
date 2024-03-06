const { default: mongoose } = require("mongoose");


const Document=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    data:{
        type:String,
    }
})

module.exports=mongoose.model("document",Document);