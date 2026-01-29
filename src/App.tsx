
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Generate from './pages/Generate'
import Result from './pages/Result'
import DynastyInfo from './pages/DynastyInfo'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/result" element={<Result />} />
      <Route path="/info" element={<DynastyInfo />} />
    </Routes>
  )
}

export default App
