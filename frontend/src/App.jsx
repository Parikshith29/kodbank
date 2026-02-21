import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
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
