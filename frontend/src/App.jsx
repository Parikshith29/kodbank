import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
      <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
