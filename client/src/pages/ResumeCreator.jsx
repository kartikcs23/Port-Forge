import React, { useEffect, useMemo, useState } from 'react';
import { Download, Pencil } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePortfolio } from '../hooks/usePortfolio';
import api from '../utils/axios';
import { ClassicTemplate } from '../components/resumeTemplates/ClassicTemplate';
import { ModernTemplate } from '../components/resumeTemplates/ModernTemplate';
import { CompactTemplate } from '../components/resumeTemplates/CompactTemplate';
import { ResumeEditor } from '../components/resume/ResumeEditor';
import { DUMMY_RESUME, DUMMY_PROJECTS } from '../data/dummyResume';

const TEMPLATES = [
  {
    key: 'classic',
    label: 'Classic',
    sub: "Jake's Resume style",
    description: 'The template CS/software engineering students recommend most — single-column, zero graphics, built to pass ATS parsing cleanly.',
    Component: ClassicTemplate,
  },
  {
    key: 'modern',
    label: 'Modern',
    sub: 'Accent-driven',
    description: 'Same ATS-safe single-column structure, with color used for hierarchy instead of relying only on bold/italic.',
    Component: ModernTemplate,
  },
  {
    key: 'compact',
    label: 'Compact',
    sub: 'Two-column',
    description: 'Sidebar for contact/skills/education, wider main column for experience. Fits more on one page — best once you\'re past initial ATS screening.',
    Component: CompactTemplate,
  },
];

const PRINT_STYLES = `
  @media print {
    .no-print { display: none !important; }
    body { background: white !important; }
    #resume-page { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
    @page { margin: 0.6in; }
  }
`;

const TemplateChooser = ({ selectedKey, onSelect, dense }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${dense ? '' : 'gap-4'}`}>
    {TEMPLATES.map((t) => (
      <button
        key={t.key}
        onClick={() => onSelect(t.key)}
        className={`text-left border-2 shadow-[3px_3px_0px_0px_#141822] transition-colors ${dense ? 'p-4' : 'p-6'} ${
          selectedKey === t.key ? 'border-accent bg-accent/10' : 'border-border bg-card hover:bg-secondary/50'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`font-black uppercase tracking-tight text-white ${dense ? 'text-sm' : 'text-lg'}`}>{t.label}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">{t.sub}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">{t.description}</p>
      </button>
    ))}
  </div>
);

/**
 * ResumeCreator — Renders a resume in one of a few selectable templates.
 * Flow: preview (default) → "Edit Resume" → choose a template → editor
 * interface → back to preview with your edits applied. Before you've
 * written any resume content, the preview shows a fully-populated "John
 * Doe" example for whichever template is selected, so you can judge a
 * template's look before committing to filling anything in.
 *
 * "Download" is the browser's native print-to-PDF (Ctrl+P → Save as PDF) —
 * no extra dependencies, and it looks right because the resume itself is
 * styled for print.
 */
export const ResumeCreator = () => {
  const { projects, fetchProjects } = usePortfolio();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templateKey, setTemplateKey] = useState('classic');
  const [mode, setMode] = useState('preview'); // 'preview' | 'choose-template' | 'edit'

  // The content actually rendered/printed. Starts null (uninitialized);
  // seeded once from real profile data if present, else the dummy example.
  // Once the user saves an edit, it always reflects their edited draft.
  const [resumeData, setResumeData] = useState(null);
  const [resumeProjects, setResumeProjects] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/profile/me');
        if (res.data.success) setProfile(res.data.data.profile);
      } finally {
        setLoading(false);
      }
    })();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Top projects to feature: the user's pinned picks in their chosen order
  // (same authority as the public portfolio); falls back to top-scored
  // projects if nothing is pinned yet.
  const topProjects = useMemo(() => {
    const visible = projects.filter((p) => !p.hidden);
    const pinned = visible.filter((p) => p.pinned).sort((a, b) => (a.pinnedOrder ?? 0) - (b.pinnedOrder ?? 0));
    if (pinned.length > 0) return pinned.slice(0, 5);
    return [...visible].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
  }, [projects]);

  const hasRealContent = profile && (profile.name || profile.headline || profile.experience?.length || profile.skills?.length);

  // Seed resumeData once profile/projects have loaded, unless the user has
  // already saved an edit (don't clobber their draft on a background refetch).
  useEffect(() => {
    if (loading || resumeData) return;
    if (hasRealContent) {
      setResumeData(profile);
      setResumeProjects(topProjects.length ? topProjects : DUMMY_PROJECTS);
    } else {
      setResumeData(DUMMY_RESUME);
      setResumeProjects(DUMMY_PROJECTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasRealContent, topProjects]);

  const isDummy = !hasRealContent && resumeData === DUMMY_RESUME;

  const handlePrint = () => window.print();

  const handleChooseTemplate = (key) => {
    setTemplateKey(key);
    setMode('edit');
  };

  const handleSaveEdit = async (data, editedProjects) => {
    try {
      await api.put('/api/profile/update', data);
    } catch (err) {
      console.error('Failed to save profile changes to backend:', err);
    }
    setResumeData(data);
    setResumeProjects(editedProjects);
    setMode('preview');
  };

  if (loading || !resumeData) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 pt-28 pb-16 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Loading your profile...
        </main>
      </div>
    );
  }

  const ActiveTemplate = TEMPLATES.find((t) => t.key === templateKey)?.Component || ClassicTemplate;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <style>{PRINT_STYLES}</style>

      <div className="no-print">
        <Navbar />
      </div>

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <div className="no-print mb-8 flex flex-col gap-4 border-b-2 border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-accent">Resume</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-black uppercase tracking-tighter">Resume Creator</h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {mode === 'preview' && (isDummy ? 'Example content — edit to make it yours.' : 'Your resume draft.')}
              {mode === 'choose-template' && 'Pick a template to edit.'}
              {mode === 'edit' && 'Editing your resume content.'}
            </p>
          </div>
          {mode === 'preview' && (
            <div className="flex gap-2">
              <button
                onClick={() => setMode('choose-template')}
                className="inline-flex items-center gap-2 border-2 border-border bg-secondary px-5 py-3 text-xs font-black uppercase tracking-widest text-foreground hover:bg-accent hover:text-white"
              >
                <Pencil className="h-4 w-4" /> Edit Resume
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#141822]"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          )}
        </div>

        {mode === 'choose-template' && (
          <div className="no-print">
            <TemplateChooser selectedKey={templateKey} onSelect={handleChooseTemplate} />
            <button
              onClick={() => setMode('preview')}
              className="mt-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white"
            >
              ← Back to preview
            </button>
          </div>
        )}

        {mode === 'edit' && (
          <div className="no-print">
            <ResumeEditor
              initialData={resumeData}
              initialProjects={resumeProjects}
              onSave={handleSaveEdit}
              onCancel={() => setMode('preview')}
            />
          </div>
        )}

        {mode === 'preview' && (
          <>
            {isDummy && (
              <div className="no-print border-2 border-dashed border-accent bg-accent/5 p-4 mb-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-accent">
                  This is example content shown so you can preview the template. Hit "Edit Resume" to replace it with yours.
                </p>
              </div>
            )}

            {/* ── Quick template switch (stays on preview) ── */}
            <div className="no-print mb-6">
              <TemplateChooser selectedKey={templateKey} onSelect={setTemplateKey} dense />
            </div>

            {/* ── The actual resume document — styled for print, not the app's dark theme ── */}
            <div
              id="resume-page"
              className="bg-white text-[#1a1a1a] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_20px_40px_-20px_rgba(0,0,0,0.5)] px-10 py-10 md:px-14 md:py-12"
            >
              <ActiveTemplate profile={resumeData} topProjects={resumeProjects || []} />
            </div>
          </>
        )}
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};
export default ResumeCreator;
