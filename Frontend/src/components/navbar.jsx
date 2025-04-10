import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/user';
import '../styles/navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const { isAuthenticated, logout, user, error, clearError, checkAuth } = useUserStore();
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
    };
    
    checkAuthStatus();
  }, [checkAuth]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Hide auth popup after 3 seconds
  useEffect(() => {
    if (showAuthPopup) {
      const timer = setTimeout(() => {
        setShowAuthPopup(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showAuthPopup]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthPopup(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowAuthPopup(false);
    navigate('/LoginPage');
  };

  return (
    <>
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}
      
      {showAuthPopup && (
        <div className="auth-popup">
          <div className="auth-popup-content">
            <p>You need to be logged in to access the Dashboard</p>
            <div className="auth-popup-buttons">
              <button onClick={handleLoginRedirect} className="login-redirect-button">
                Go to Login
              </button>
              <button onClick={() => setShowAuthPopup(false)} className="close-popup-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <nav className="navbar">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            Fit Journey
          </a>

          <div className="menu-icon" onClick={toggleMenu}>
            <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </div>

          <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <a 
                href="/FitJourneyDashboard" 
                className="nav-link"
                onClick={handleDashboardClick}
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">
                Contact Us
              </a>
            </li>
            {/* <li className="nav-item">
              <a href="/Aboutus" className="nav-link">
                About Us
              </a>
            </li> */}
          </ul>

          <div className={isOpen ? 'auth-buttons active' : 'auth-buttons'}>
            {isAuthenticated ? (
              <>
                <span className="user-greeting">
                  Hello, {user?.name || 'User'}
                </span>
                <button onClick={handleLogout} className="logout-button">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a href="/LoginPage" className="login-button">
                  Log In
                </a>
                <a href="/SignupPage" className="signup-button">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;