/**
 * Professional Loaders Usage Examples for PortForge
 *
 * These loaders provide a highly professional and "next level" experience
 * that matches the brutalist design aesthetic of the application.
 */

// =============================================================================
// 1. ENTRY LOADER - App Initialization
// =============================================================================
// Used in App.jsx for initial app loading
// Shows sophisticated morphing animations and progress tracking

import { EntryLoader } from './components/loaders';

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  if (!appLoaded) {
    return <EntryLoader onComplete={() => setAppLoaded(true)} />;
  }

  return <YourAppContent />;
}

// =============================================================================
// 2. NAVIGATION LOADER - Page Transitions
// =============================================================================
// Used for smooth page transitions and route changes

import { NavigationLoader } from './components/loaders';

function Dashboard() {
  const [loading, setLoading] = useState(false);

  const handleNavigation = async () => {
    setLoading(true);
    // Perform async operation
    await someAsyncFunction();
    setLoading(false);
    navigate('/new-page');
  };

  return (
    <div>
      {loading && <NavigationLoader message="Loading Dashboard" />}

      <button onClick={handleNavigation}>
        Go to Profile
      </button>
    </div>
  );
}

// Variants available:
// <NavigationLoader variant="default" /> - Full screen with sliding panels
// <NavigationLoader variant="minimal" /> - Top progress bar
// <NavigationLoader variant="overlay" /> - Modal overlay

// =============================================================================
// 3. CENTRAL LOADER - Long Operations
// =============================================================================
// Used for API calls, data processing, file uploads, etc.

import { CentralLoader } from './components/loaders';

function SyncComponent() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setSyncing(true);
    setProgress(0);

    // Simulate progress updates
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setSyncing(false);
  };

  return (
    <div>
      {syncing && (
        <CentralLoader
          message="Syncing GitHub Data"
          subtitle="Fetching repositories and analyzing code"
          progress={progress}
          size="large"
        />
      )}

      <button onClick={handleSync} disabled={syncing}>
        {syncing ? 'Syncing...' : 'Sync GitHub'}
      </button>
    </div>
  );
}

// Available props:
// - message: Main loading text
// - subtitle: Secondary description
// - progress: Number (0-100) for progress bar
// - showProgress: Boolean to show/hide progress
// - size: "small" | "medium" | "large"
// - variant: "default" | "compact" | "fullscreen"

// =============================================================================
// 4. PRACTICAL INTEGRATION EXAMPLES
// =============================================================================

// In a form submission
function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.submitForm(data);
      // Success handling
    } catch (error) {
      // Error handling
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitting && (
        <CentralLoader
          message="Sending Message"
          subtitle="Please wait while we process your request"
          variant="compact"
        />
      )}

      {/* Form fields */}
      <button type="submit" disabled={submitting}>
        Send Message
      </button>
    </form>
  );
}

// For data fetching
function ProjectsList() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CentralLoader
        message="Loading Projects"
        subtitle="Fetching your portfolio data"
        variant="fullscreen"
      />
    );
  }

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

// =============================================================================
// 5. ADVANCED USAGE - Custom Hooks
// =============================================================================

// Custom hook for loading states
function useLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = (initialProgress = 0) => {
    setLoading(true);
    setProgress(initialProgress);
  };

  const updateProgress = (newProgress) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const stopLoading = () => {
    setLoading(false);
    setProgress(0);
  };

  return {
    loading,
    progress,
    startLoading,
    updateProgress,
    stopLoading,
  };
}

// Usage in component
function DataProcessor() {
  const { loading, progress, startLoading, updateProgress, stopLoading } = useLoader();

  const processData = async () => {
    startLoading();

    // Step 1
    updateProgress(25);
    await step1();

    // Step 2
    updateProgress(50);
    await step2();

    // Step 3
    updateProgress(75);
    await step3();

    // Complete
    updateProgress(100);
    setTimeout(stopLoading, 500);
  };

  return (
    <div>
      {loading && (
        <CentralLoader
          message="Processing Data"
          subtitle="This may take a few moments"
          progress={progress}
        />
      )}

      <button onClick={processData} disabled={loading}>
        Process Data
      </button>
    </div>
  );
}

export {
  EntryLoader,
  NavigationLoader,
  CentralLoader,
  useLoader
};