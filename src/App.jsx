import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Sparkles, Users, Share2, Compass, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";
import SignUp from "./SignUp.jsx";
import LandingPage from './LandingPage';
import SpiralTransition from './components/SpiralTransition';
import Dashboard from './Dashboard';
import Login from './Login';
import ProfileSettings from './ProfileSettings';
import ResetPassword from './ResetPassword';
import SetNewPassword from './SetNewPassword';
import { UserProvider } from './UserContext';

const features = [
  {
    icon: <Users className="w-8 h-8 text-indigo-400" />,
    title: "Connect with Friends",
    desc: "Find and connect with people who share your interests.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-indigo-400" />,
    title: "Share Moments",
    desc: "Post updates, photos, and stories instantly.",
  },
  {
    icon: <Compass className="w-8 h-8 text-indigo-400" />,
    title: "Discover Content",
    desc: "Explore trending topics and communities.",
  },
];

const AppContent = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    setIsTransitioning(true);
    setTargetRoute(route);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (targetRoute) {
      navigate(targetRoute);
      setTargetRoute(null);
    }
  };

  return (
    <div className="relative">
      <SpiralTransition 
        isActive={isTransitioning} 
        onComplete={handleTransitionComplete} 
      />
      
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage onNavigate={handleNavigation} />} 
        />
        <Route 
          path="/signup" 
          element={<SignUp onNavigate={handleNavigation} />} 
        />
        <Route 
          path="/login" 
          element={<Login onNavigate={handleNavigation} />} 
        />
        <Route 
          path="/dashboard" 
          element={<Dashboard onNavigate={handleNavigation} />} 
        />
        <Route 
          path="/profile-settings" 
          element={<ProfileSettings onNavigate={handleNavigation} />} 
        />
        <Route
          path="/reset-password"
          element={<ResetPassword onNavigate={handleNavigation} />}
        />
        <Route
          path="/set-new-password"
          element={<SetNewPassword onNavigate={handleNavigation} />}
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App; 