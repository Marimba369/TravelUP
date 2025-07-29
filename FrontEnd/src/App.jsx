import "./App.css"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import AddAgency from "./pages/Addagency"

function App() {
  return (
    <div>
      <Navbar />
        <Routes>

          <Route path="/addagency" element={<AddAgency />} />

          <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </div>
  );
}

export default App
