
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Generate from './pages/Generate'
import Result from './pages/Result'
import DynastyInfo from './pages/DynastyInfo'
import { HistorySidebar } from './components/HistorySidebar'

function App() {
  useEffect(() => {
    const eventName = import.meta.env.VITE_EVENT_NAME
    if (eventName) {
      document.title = eventName
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/result" element={<Result />} />
        <Route path="/info" element={<DynastyInfo />} />
      </Routes>
      <HistorySidebar />
    </>
  )
}

export default App
