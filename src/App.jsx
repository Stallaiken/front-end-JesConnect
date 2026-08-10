import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './Components/Menu.jsx'
import './App.css'
import Home from './Pages/Home.jsx'
import Administrativo from './Pages/Administrativo.jsx'
import Erro404 from './Pages/Erro404.jsx'
function App() {

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Visitar" element={<h1>Visitar</h1>} />
        <Route path="/Administrativo" element={<Administrativo />} />
        <Route path="*" element={<Erro404 />} />
      </Routes>
    </>
  )
}

export default App
