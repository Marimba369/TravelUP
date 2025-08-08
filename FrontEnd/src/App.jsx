import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import TravelRequest from "./pages/Traveler/TravelRequest";
import "bootstrap/dist/css/bootstrap.min.css";
import Project from "./pages/Manager/Project";
import HomeFacilitator from "./pages/Facilitator/HomeFacilitator";
import HomeManager from "./pages/Manager/HomeManager";
import ValidateRoles from "./components/ValidateRoles";
import Login from "./components/Login";
import AuthProvider from "./components/AuthProvider";
import Agencies from "./pages/Facilitator/Agencies";
import PendingRequestsList from "./pages/Facilitator/PendingRequestsList";
import FacilitatorQuote from "./pages/Facilitator/FacilitatorQuote";

function App() {
  const location = useLocation();

  //Check if we are on the login page
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <>
      <AuthProvider>
        {/* Show navBar only if not on login page */}
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/Project" element={<Project />} />
          <Route path="/HomeFacilitator"
            element={
              <ValidateRoles allowedRoles={["Facilitator"]}>
                <HomeFacilitator />
              </ValidateRoles>
            }
          />
          <Route path="/HomeManager" element={<HomeManager />} />

          <Route
            path="/facilitator/requests"
            element={
              <ValidateRoles allowedRoles={["Facilitator"]}>
                <PendingRequestsList />
              </ValidateRoles>
            }
          />
          <Route
            path="/facilitator/quote/:requestId"
            element={
              <ValidateRoles allowedRoles={["Facilitator"]}>
                <FacilitatorQuote />
              </ValidateRoles>
            }
          />


          <Route
            path="/TravelRequest"
            element={
              <TravelRequest />
            }
          />
          <Route
            path="/Agency"
            element={
              <ValidateRoles allowedRoles={["Facilitator"]}>
                <Agencies />
              </ValidateRoles>
            }
          />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
