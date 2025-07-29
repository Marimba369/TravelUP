import "./App.css"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import AddAgency from "./pages/AddAgency"

function App() {
  return (
    <>
      <Navbar/>
      <Routes>

        <Route path="/AddAgency" element={<AddAgency />} />

        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </>
  );
}

export default App
