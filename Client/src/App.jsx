import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import { Container } from 'postcss'
import Editor from './component/Editor'
import { Routes ,Route, Navigate} from 'react-router-dom'
import{v4 as uuid} from "uuid"

function App() {


  return (
   <Routes>
      <Route  path='/' element={<Navigate replace to={`/docs/${uuid()}`}/>}/>
      <Route path='/docs/:id' element={ <Editor/>}/>
   </Routes>
 
  )
}

export default App
