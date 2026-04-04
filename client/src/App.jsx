import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { ProfileEdit } from './pages/ProfileEdit';

function App() {
  return (
    <Router>
      <Routes>
        {/* Specific routes first */}
        <Route path="/" element={<div className="app-shell"><Landing /></div>} />
        <Route path="/login" element={<div className="app-shell"><Login /></div>} />
        <Route path="/register" element={<div className="app-shell"><Register /></div>} />
        <Route
          path="/dashboard"
          element={
            <div className="app-shell">
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/login" />
              </SignedOut>
            </div>
          }
        />

        <Route
          path="/profile-edit"
          element={
            <div className="app-shell">
              <SignedIn>
                <ProfileEdit />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/login" />
              </SignedOut>
            </div>
          }
        />
        
        {/* Dynamic portfolio route - after specific routes */}
        <Route path="/:slug" element={<Portfolio />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;