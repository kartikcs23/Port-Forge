import React, { useState } from 'react';
import { EntryLoader, NavigationLoader, CentralLoader } from '../components/loaders';

/**
 * LoaderDemo — Showcase all professional loaders
 * Use this to test and see all loader variants
 */
export const LoaderDemo = () => {
  const [activeLoader, setActiveLoader] = useState(null);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setActiveLoader(null), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const loaders = [
    {
      name: 'Entry Loader',
      component: <EntryLoader onComplete={() => setActiveLoader(null)} />,
      description: 'App initialization with morphing logo and progress'
    },
    {
      name: 'Navigation Loader (Default)',
      component: <NavigationLoader message="Loading Page" variant="default" />,
      description: 'Full-screen page transitions with sliding panels'
    },
    {
      name: 'Navigation Loader (Minimal)',
      component: <NavigationLoader message="Loading" variant="minimal" />,
      description: 'Top progress bar for subtle transitions'
    },
    {
      name: 'Navigation Loader (Overlay)',
      component: <NavigationLoader message="Processing" variant="overlay" />,
      description: 'Modal overlay for focused operations'
    },
    {
      name: 'Central Loader (Default)',
      component: (
        <CentralLoader
          message="Processing Data"
          subtitle="This may take a moment"
          progress={progress}
          size="large"
        />
      ),
      description: 'Professional loader with progress tracking'
    },
    {
      name: 'Central Loader (Compact)',
      component: (
        <CentralLoader
          message="Saving"
          variant="compact"
        />
      ),
      description: 'Bottom-right notification style loader'
    },
    {
      name: 'Central Loader (Fullscreen)',
      component: (
        <CentralLoader
          message="Initializing"
          subtitle="Setting up your workspace"
          variant="fullscreen"
        />
      ),
      description: 'Full-screen immersive loading experience'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-ink mb-8 border-b-4 border-ink pb-4">
          Professional Loaders Demo
        </h1>

        <p className="text-muted font-bold uppercase tracking-widest mb-8">
          Click any button to see the loader in action. These are highly professional,
          next-level animations that match PortForge's brutalist design.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loaders.map((loader, index) => (
            <div key={index} className="bg-surface border-2 border-ink p-6 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-shadow">
              <h3 className="text-xl font-black uppercase tracking-tight text-ink mb-2">
                {loader.name}
              </h3>
              <p className="text-sm text-muted font-bold uppercase tracking-widest mb-4">
                {loader.description}
              </p>
              <button
                onClick={() => {
                  setActiveLoader(index);
                  if (loader.name.includes('Central Loader (Default)')) {
                    simulateProgress();
                  } else if (!loader.name.includes('Entry Loader')) {
                    setTimeout(() => setActiveLoader(null), 3000);
                  }
                }}
                className="w-full bg-accent text-white px-4 py-2 font-bold uppercase tracking-widest text-sm border-2 border-accent shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all"
              >
                Show Loader
              </button>
            </div>
          ))}
        </div>

        {/* Active Loader Overlay */}
        {activeLoader !== null && loaders[activeLoader].component}
      </div>
    </div>
  );
};