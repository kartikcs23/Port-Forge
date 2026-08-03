import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { InitialLoader } from './components/InitialLoader';

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
import { Insights } from './pages/Insights';
import { ResumeCreator } from './pages/ResumeCreator';
import { CandidateAnalysis } from './pages/CandidateAnalysis';
import { EgyptianPreview } from './pages/EgyptianPreview';
import { EgyptianEditor } from './pages/EgyptianEditor';
import { ThemeEditor } from './pages/ThemeEditor';
import { BrutalistPreview } from './pages/BrutalistPreview';
import { SpacePreview } from './pages/SpacePreview';
import { MedicalPreview } from './pages/MedicalPreview';
import { ProfessionalPreview } from './pages/ProfessionalPreview';
import { CinematicPreview } from './pages/CinematicPreview';
// Dev-only testing route — statically eliminated from production builds
// (import.meta.env.DEV is false in `npm run build`, so Vite/Rollup tree-shakes
// this import and the route below out of the shipped bundle entirely).
import { DevTesting } from './pages/DevTesting';

const AuthGate = ({ children }) => (
  <>
    <SignedIn>
      {children}
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn redirectUrl="/login" />
    </SignedOut>
  </>
);

function App() {
  const isRootPath = window.location.pathname === '/';
  const [loaded, setLoaded] = useState(
    () => !isRootPath || sessionStorage.getItem('pf_loaded') === 'true'
  );

  const handleLoaderComplete = () => {
    sessionStorage.setItem('pf_loaded', 'true');
    setLoaded(true);
  };

  if (!loaded) {
    return <InitialLoader onComplete={handleLoaderComplete} />;
  }

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
        <Route path="/analyze" element={<CandidateAnalysis />} />
        <Route
          path="/dashboard"
          element={
            <AuthGate>
              <Dashboard />
            </AuthGate>
          }
        />

        <Route
          path="/profile-edit"
          element={
            <AuthGate>
              <ProfileEdit />
            </AuthGate>
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
          path="/resume"
          element={
            <>
              <SignedIn>
                <ResumeCreator />
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
            <AuthGate>
              <AdminDashboard />
            </AuthGate>
          }
        />

        {/* Temp preview route */}
        <Route path="/egyptian-preview" element={<EgyptianPreview />} />
        <Route path="/egyptian-editor" element={<EgyptianEditor />} />
        <Route path="/theme-editor" element={<ThemeEditor />} />
        <Route path="/brutalist-preview" element={<BrutalistPreview />} />
        <Route path="/space-preview" element={<SpacePreview />} />
        <Route path="/medical-preview" element={<MedicalPreview />} />
        <Route path="/professional-preview" element={<ProfessionalPreview />} />
        <Route path="/cinematic-preview" element={<CinematicPreview />} />
        {import.meta.env.DEV && <Route path="/dev-testing" element={<DevTesting />} />}

        {/* Dynamic portfolio route - after specific routes */}
        <Route path="/:slug" element={<Portfolio />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
