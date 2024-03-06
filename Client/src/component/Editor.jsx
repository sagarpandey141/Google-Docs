import { Box, Container } from '@mui/material';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useState } from 'react';
import '../App.css'
import {io} from "socket.io-client"
import { useParams } from 'react-router-dom';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
   ['clean'],
];

const Editor = () => {
   
  const[quill,setQuill]=useState();
  const[socket,setSocket]=useState();
  const{id}=useParams();

  useEffect(() => {
    const quillServer = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions }});
    quillServer.disable();
    quillServer.setText("Loading The Document....");
    setQuill(quillServer);
}, []);

  
//backend connection ( socket )
  useEffect(()=>{
   const socket= io("http://localhost:4000")
   
   setSocket(socket);

   return()=>{
      socket.disconnect();
   }
  },[])
  
  // send live text change  to backend 
  useEffect(()=>{
  if(quill===null && socket===null) return;

   const handleChange=(delta,oldDeta,source)=>{
    if(source!=='user') return;
    socket.emit('send-message',delta)
  }

    quill && quill.on('text-change',handleChange)
    return()=>{
      quill && quill.off('text-change',handleChange)
    }
  },[quill,socket])
   
  useEffect(()=>{
    if(quill===null && socket===null) return;
    socket && socket.once('load-document', document=>{
       quill.enable();
       quill.setContents(document)
    })
    socket && socket.emit('get-document',id)
  },[quill,socket,id])
  
  useEffect(()=>{
    if(quill===null && socket===null) return;
    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
  }, 2000);
   return()=>{
    clearInterval(interval);
   }
  },[quill,socket])

  //receive changes backend for broadcasting
  useEffect(()=>{
    if(quill===null && socket===null) return;

    const handleChange=(delta)=>{
     quill.updateContents(delta)
   }
   socket && socket.on("recieve-changes",handleChange)
  },[quill,socket])

  return (
   
         <Box id='container' className="container" ></Box>
  
  );
};

export default Editor;
