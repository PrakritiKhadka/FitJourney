// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/navbar.jsx";
import Footer from "./components/Footer.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FitJourneyDashboard from "./pages/FitJourneyDashboard.jsx";
import WorkoutForm from "./pages/WorkoutForm.jsx";
import SetGoals from "./pages/SetGoals.jsx";
import Profile from "./pages/Profile.jsx";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallbackPage from "./pages/AuthCallbackPage.jsx";
import Progress from "./pages/Progress.jsx";

function App() {
  // Fix: Use import.meta.env instead of import.meta.env.REACT_APP_*
  // Vite uses import.meta.env.VITE_* for environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Aboutus />} />
            <Route path="/SignupPage" element={<SignupPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route
              path="/FitJourneyDashboard"
              element={<FitJourneyDashboard />}
            />
            <Route path="/WorkoutForm" element={<WorkoutForm />} />
            <Route
              path="/SetGoals"
              element={
                  <SetGoals />
              }
            />
            <Route
              path="/Profile"
              element={
                  <Profile />
              }
            />
                        <Route path="/progress" element={<Progress />} />

            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;