import React from 'react';
import { Navbar } from '../components/Navbar';
import { FileText, Hammer, Sparkles, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResumeCreator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white font-sans text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 pt-24 md:pt-28">
        {/* Header Section */}
        <section className="mb-12 border-b-2 border-border pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/40 text-accent px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
                <Hammer className="w-3.5 h-3.5" /> Feature In Active Development
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white flex items-center gap-4">
                Resume Creator <FileText className="w-10 h-10 text-accent" />
              </h1>
              <p className="text-muted-foreground font-sans text-lg mt-2 max-w-2xl">
                AI-driven ATS-optimized resume builder integrated directly with your PortForge portfolio data.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-secondary text-white border-2 border-border px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors shadow-[4px_4px_0px_0px_#141822]"
            >
              Back to Dashboard
            </button>
          </div>
        </section>

        {/* Feature Hero Card */}
        <div className="bg-card border-2 border-border p-8 md:p-12 shadow-[8px_8px_0px_0px_#141822] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl">
            <span className="text-accent font-mono text-xs tracking-widest uppercase font-bold block mb-2">
              // STATUS: UNDER CONSTRUCTION (v2.0 ROADMAP)
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Craft ATS-Friendly Resumes in One Click
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our engineering team is building an automated resume generator that synthesizes your verified GitHub projects, commit history, and PortForge profile metrics directly into recruiter-ready PDF templates.
            </p>

            <div className="inline-flex items-center gap-3 bg-secondary/80 border-2 border-border px-4 py-3 text-xs font-bold uppercase tracking-widest text-accent">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              Expected Release: Q3 2026
            </div>
          </div>
        </div>

        {/* Planned Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#141822]">
            <Cpu className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">Auto-Sync Skills</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Extracts high-impact keywords directly from your GitHub repositories and verified code commits.
            </p>
          </div>

          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#141822]">
            <Sparkles className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">AI Bullet Points</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generates action-oriented experience bullet points tailored specifically for developer and tech roles.
            </p>
          </div>

          <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_#141822]">
            <CheckCircle2 className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">ATS Score Checker</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Analyzes formatting and keyword density to ensure maximum pass rates through HR scanning algorithms.
            </p>
          </div>
        </div>

        {/* Bottom CTA / Notification Box */}
        <div className="border-2 border-dashed border-border bg-background p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Want early access? Update your profile details to be ready when the Resume Creator launches!
          </p>
          <button
            onClick={() => navigate('/profile-edit')}
            className="mt-4 inline-flex items-center gap-2 bg-accent text-white border-2 border-border px-6 py-3 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#141822] hover:bg-accent/80 transition-colors"
          >
            Update Profile First <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
export default ResumeCreator;
