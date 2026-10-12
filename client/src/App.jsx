import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import MainLayout from './components/MainLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MainLayout />
  )
}

export default App
