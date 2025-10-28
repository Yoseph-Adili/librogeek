import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./component/navbar/nav.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app" >
     <Navbar></Navbar>
    </div>
  )
}

export default App
