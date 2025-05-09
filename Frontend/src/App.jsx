// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import AdminUserManagement from "./Admin/AdminUserManagement.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import AdminPanel from "./Admin/AdminPanel.jsx";
import DietPlanManagement from "./Admin/DietPlanManagement.jsx";
import WorkoutManagement from "./Admin/WorkoutManagement.jsx";

const FooterHandler = () => {
  const location = useLocation();
  const noFooterPaths = [
    "/AdminPanel",
    "/AdminDashboard",
    "/WorkoutManagement",
    "/AdminUserManagement",
    "/DietPlanManagement",
  ];

  return (
    !noFooterPaths.some((path) => location.pathname.startsWith(path)) && (
      <Footer />
    )
  );
};

const NavbarHandler = () => {
  const location = useLocation();
  const noNavbarPaths = [
    "/AdminPanel",
    "/AdminDashboard",
    "/WorkoutManagement",
    "/AdminUserManagement",
    "/DietPlanManagement",
  ];

  return (
    !noNavbarPaths.some((path) => location.pathname.startsWith(path)) && (
      <Navbar />
    )
  );
};
function App() {
  // Fix: Use import.meta.env instead of import.meta.env.REACT_APP_*
  // Vite uses import.meta.env.VITE_* for environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <NavbarHandler />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Aboutus />} />
            <Route path="/SignupPage" element={<SignupPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected routes */}
            <Route
              path="/FitJourneyDashboard"
              element={
                <ProtectedRoute>
                  <FitJourneyDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/WorkoutForm" 
              element={
                <ProtectedRoute>
                  <WorkoutForm />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/SetGoals"
              element={
                <ProtectedRoute>
                  <SetGoals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } 
            />
            {/* Admin routes should also be protected */}
            <Route 
              path="/AdminUserManagement" 
              element={
                <ProtectedRoute>
                  <AdminUserManagement />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/AdminDashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/AdminPanel" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/DietPlanManagement" 
              element={
                <ProtectedRoute>
                  <DietPlanManagement />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/WorkoutManagement" 
              element={
                <ProtectedRoute>
                  <WorkoutManagement />
                </ProtectedRoute>
              }
            />
            {/* Remove catch-all route to allow normal 404 behavior */}
          </Routes>
          <FooterHandler/>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;