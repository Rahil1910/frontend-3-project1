import { useState } from 'react'
import './App.css'
import SetTimer from './components/timer';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SetTimer></SetTimer>
    </>
  )
}

export default App
