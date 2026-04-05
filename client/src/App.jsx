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
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { FAQ } from './pages/FAQ';
import { Notifications } from './pages/Notifications';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Specific routes first */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/login" />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/profile-edit"
          element={
            <>
              <SignedIn>
                <ProfileEdit />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/login" />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/admin"
          element={
            <>
              <SignedIn>
                <AdminDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/login" />
              </SignedOut>
            </>
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