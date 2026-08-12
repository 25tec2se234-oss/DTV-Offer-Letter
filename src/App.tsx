import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OfferLetterApp from './pages/OfferLetterStudio/OfferLetterApp'
import CandidatePortal from './pages/OfferLetterStudio/CandidatePortal'
import PublicVerification from './pages/OfferLetterStudio/PublicVerification'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/offer/action/:token" element={<CandidatePortal />} />
        <Route path="/offer/verify/:token" element={<PublicVerification />} />
        <Route path="/*" element={<OfferLetterApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
