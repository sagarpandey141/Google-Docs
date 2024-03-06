const express=require("express");
const {Server}=require("socket.io")
const app=express();

const bodyparser=require("body-parser");
const PORT=4000

//db connection
const{connect}=require("./config/DbConnetion")
connect();

//component
const{saveDocument,UpdateDocument}=require("./component/buffer")

//socket io
const io=new Server(PORT,{
      cors:{
            origin:"http://localhost:5173",
            methods:['GET','POST']
      }
})

io.on('connection',socket=>{
  socket.on('get-document',async documentID=>{
    const user= await saveDocument(documentID)
    socket.join(documentID);
    socket.emit('load-document',user.data)
     socket.on('send-message',delta => {
            socket.broadcast.to(documentID).emit('recieve-changes',delta);
      })
      socket.on('save-document', async data=>{
      //      const ans= await UpdateDocument(documentID,data)
      //      console.log("ans",ans)
      })
  })
})




