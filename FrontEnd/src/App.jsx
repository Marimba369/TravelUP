import "./App.css"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import AddAgency from "./pages/AddAgency"
import TravelRequest from "./pages/TravelRequest"
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TravelRequest" element={<TravelRequest />} />
        <Route path="/AddAgency" element={<AddAgency />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </>
  );
}

export default App
