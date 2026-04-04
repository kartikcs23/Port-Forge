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
import { Insights } from './pages/Insights';
import { LinkedInInsights } from './pages/LinkedInInsights';

// Components
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-ink">
        <div className="flex-1">
          <Routes>
            {/* Specific routes first */}
            <Route path="/" element={<Landing />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/register/*" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
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
              path="/insights"
              element={
                <>
                  <SignedIn>
                    <Insights />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn redirectUrl="/login" />
                  </SignedOut>
                </>
              }
            />
            
            <Route
              path="/linkedin"
              element={
                <>
                  <SignedIn>
                    <LinkedInInsights />
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
        </div>

        <Footer />
      </div>
    </Router>
  );
}
      

export default App;