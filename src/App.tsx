
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Generate from './pages/Generate'
import Result from './pages/Result'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}

export default App
