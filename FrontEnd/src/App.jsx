import "./App.css"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import TravelRequest from "./pages/TravelRequest"
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css';
import Project from "./pages/Project";
import HomeFacilitator from "./pages/HomeFacilitator";
import HomeManager from "./pages/HomeManager";
import ValidateRoles from "./components/ValidateRoles"
import Login from "./components/Login"
import AuthProvider from "./components/AuthProvider"
import Agencies from "./pages/Facilitator/Agencies"
import PendingRequests from "./pages/Facilitator/PendingRequests"

function App() {
  return (
    <>
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/HomeFacilitator" element={<ValidateRoles allowedRoles ={['Facilitator']}><HomeFacilitator/> </ValidateRoles>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/facilitator/requests" element={<PendingRequests />} />
        <Route path="/HomeManager" element={<HomeManager />} />
        <Route path="/TravelRequest" element={<ValidateRoles allowedRoles ={['Facilitator']}><TravelRequest /> </ValidateRoles>}/>
        <Route path="/Agency" element={<ValidateRoles allowedRoles ={['Facilitator']}><Agencies /> </ValidateRoles>}/>
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </AuthProvider>
    </>
  );
}

export default App
