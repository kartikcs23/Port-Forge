import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Printer, 
  ArrowLeft, 
  Search, 
  X, 
  Check, 
  Code2, 
  ChevronDown, 
  Plus,
  Upload,
  FileText,
  Trash2,
  Zap,
  GitBranch,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ReportPreview } from '../components/ReportPreview';

const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Mobile Developer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'QA Engineer',
];

const POPULAR_TECHS = [
  // Frontend
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux', 'HTML5/CSS3',
  // Backend
  'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'Go', 'Rust', 'PHP', 'Laravel', 'Ruby on Rails',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'SQLite', 'GraphQL',
  // Cloud & DevOps
  'AWS', 'Docker', 'Kubernetes', 'GCP', 'Azure', 'Linux', 'CI/CD', 'Git', 'Terraform',
  // AI & Data Science
  'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'LangChain',
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin'
];

export const CandidateAnalysis = () => {
  const [form, setForm] = useState({
    githubUsername: '',
    leetcodeUsername: '',
    targetRole: 'Full Stack Developer',
  });

  const [selectedTechs, setSelectedTechs] = useState([
    'React', 'Node.js', 'Express', 'MongoDB', 'TypeScript'
  ]);
  const [techSearch, setTechSearch] = useState('');
  const [customTechInput, setCustomTechInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const toggleTech = (tech) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
    if (error) setError('');
  };

  const addCustomTech = (e) => {
    e.preventDefault();
    if (!customTechInput.trim()) return;
    const clean = customTechInput.trim();
    if (!selectedTechs.includes(clean)) {
      setSelectedTechs([...selectedTechs, clean]);
    }
    setCustomTechInput('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (file) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please upload a PDF format resume file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Resume file size exceeds 5 MB limit.');
      return;
    }
    setResumeFile(file);
    if (error) setError('');
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.githubUsername.trim()) {
      setError('GitHub username is required.');
      return;
    }
    if (selectedTechs.length === 0) {
      setError('Please select at least one technology in your Tech Stack.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      let payload;
      let headers = {};

      if (resumeFile) {
        payload = new FormData();
        payload.append('githubUsername', form.githubUsername);
        payload.append('leetcodeUsername', form.leetcodeUsername);
        payload.append('targetRole', form.targetRole);
        payload.append('techStack', JSON.stringify(selectedTechs));
        payload.append('resume', resumeFile);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        payload = {
          githubUsername: form.githubUsername,
          leetcodeUsername: form.leetcodeUsername,
          targetRole: form.targetRole,
          techStack: selectedTechs,
        };
      }

      const res = await axios.post(`${apiUrl}/api/analyze`, payload, { headers });

      if (res.data && res.data.success) {
        setResult(res.data.data);
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(res.data?.message || 'Analysis generation failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate analysis. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechs = POPULAR_TECHS.filter((t) =>
    t.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto no-print">
        {/* Top stripe accent */}
        <div className="h-1 w-24 stripe-bg mb-8" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">
              ⚡ AI-Powered · Groq LLaMA 3
            </p>
            <h1 className="text-4xl sm:text-6xl font-black font-display uppercase tracking-tighter text-white leading-none">
              Candidate<br />
              <span className="text-primary">Analysis</span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm font-medium leading-relaxed md:text-right">
            Fetch real GitHub & LeetCode data, scan PDF resumes, and generate an AI hiring report in seconds.
          </p>
        </div>

        <div className="h-px bg-border mt-8 mb-0" />
      </section>

      {/* ── FORM SECTION ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Form Card */}
          <div className="lg:col-span-8">
            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#090e1a] p-6 sm:p-8 space-y-6">
              
              {/* Card Header */}
              <div className="border-b-2 border-border pb-4">
                <h2 className="text-xl font-black font-display uppercase tracking-tighter text-white">
                  Candidate Input Form
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                  Fill in details below · All data is fetched in real-time
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* GITHUB + LEETCODE ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* GitHub Username */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-border pb-1 inline-block">
                      GitHub Username <span className="text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[11px] font-bold text-muted-foreground pointer-events-none select-none font-mono">
                        github.com/
                      </span>
                      <input
                        id="githubUsername"
                        type="text"
                        name="githubUsername"
                        value={form.githubUsername}
                        onChange={handleChange}
                        placeholder="kartikcs23"
                        className="w-full pl-[88px] pr-3 py-3 bg-background text-white border-2 border-border focus:outline-none focus:border-primary transition-colors text-sm font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* LeetCode Username */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-border pb-1 inline-block">
                      LeetCode Username <span className="text-muted-foreground font-normal">(Auto-Fetched)</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[11px] font-bold text-muted-foreground pointer-events-none select-none font-mono">
                        lc.com/u/
                      </span>
                      <input
                        id="leetcodeUsername"
                        type="text"
                        name="leetcodeUsername"
                        value={form.leetcodeUsername}
                        onChange={handleChange}
                        placeholder="username"
                        className="w-full pl-[74px] pr-3 py-3 bg-background text-white border-2 border-border focus:outline-none focus:border-primary transition-colors text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* TARGET ROLE */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-border pb-1 inline-block">
                    Target Role <span className="text-primary">*</span>
                  </label>
                  <select
                    id="targetRole"
                    name="targetRole"
                    value={form.targetRole}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background text-white border-2 border-border focus:outline-none focus:border-primary transition-colors text-sm font-bold cursor-pointer"
                  >
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* TECH STACK SELECTOR */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                      Tech Stack <span className="text-primary">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {selectedTechs.length} Selected
                    </span>
                  </div>

                  {/* Selected Techs Pills */}
                  <div className="p-3 bg-background border-2 border-border min-h-[52px] flex flex-wrap gap-2 items-center">
                    {selectedTechs.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wide bg-primary/10 text-primary border border-primary/40 flex items-center gap-1.5"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => toggleTech(tech)}
                          className="text-primary hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedTechs.length === 0 && (
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-wide pl-1">
                        No technologies selected...
                      </span>
                    )}
                  </div>

                  {/* Dropdown Toggle */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full px-4 py-2.5 bg-secondary text-foreground border-2 border-border hover:border-primary hover:text-primary text-[11px] font-black uppercase tracking-widest flex items-center justify-between transition-all hover:shadow-[2px_2px_0px_0px_#090e1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      Browse & Search Technologies
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Panel */}
                  {dropdownOpen && (
                    <div className="p-4 bg-background border-2 border-border shadow-[4px_4px_0px_0px_#090e1a] space-y-3">
                      
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={techSearch}
                          onChange={(e) => setTechSearch(e.target.value)}
                          placeholder="Search React, Node.js, Python, Docker..."
                          className="w-full pl-8 pr-4 py-2.5 bg-card text-white border-2 border-border focus:outline-none focus:border-primary text-xs font-bold"
                        />
                      </div>

                      {/* Tech Grid */}
                      <div className="max-h-44 overflow-y-auto flex flex-wrap gap-1.5 pr-1">
                        {filteredTechs.map((tech) => {
                          const isSelected = selectedTechs.includes(tech);
                          return (
                            <button
                              type="button"
                              key={tech}
                              onClick={() => toggleTech(tech)}
                              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide border-2 flex items-center gap-1 transition-all ${
                                isSelected
                                  ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_0px_#090e1a]'
                                  : 'bg-card text-foreground border-border hover:border-primary hover:text-primary'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {tech}
                            </button>
                          );
                        })}
                        {filteredTechs.length === 0 && (
                          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide py-2 w-full">
                            Not found — add it as custom below
                          </p>
                        )}
                      </div>

                      {/* Custom Tech Input */}
                      <div className="pt-2 border-t-2 border-dashed border-border flex gap-2">
                        <input
                          type="text"
                          value={customTechInput}
                          onChange={(e) => setCustomTechInput(e.target.value)}
                          placeholder="Add custom technology..."
                          className="flex-1 px-3 py-2 bg-card text-white border-2 border-border focus:outline-none focus:border-primary text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={addCustomTech}
                          className="px-4 py-2 bg-primary text-white text-[11px] font-black uppercase tracking-widest border-2 border-border shadow-[2px_2px_0px_0px_#090e1a] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* RESUME PDF UPLOAD */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                      Attach Resume PDF
                    </label>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Optional · Max 5 MB
                    </span>
                  </div>

                  {!resumeFile ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                        dragActive
                          ? 'border-primary bg-primary/5 shadow-[4px_4px_0px_0px_rgba(235,59,59,0.3)]'
                          : 'border-border hover:border-primary/60 bg-background hover:bg-card'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-7 h-7 text-primary mx-auto mb-3" />
                      <p className="text-xs font-black uppercase tracking-widest text-white">
                        Click or drag & drop PDF resume
                      </p>
                      <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wide mt-1">
                        AI will scan projects, work experience & education
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-primary/5 border-2 border-primary/40 shadow-[3px_3px_0px_0px_rgba(235,59,59,0.15)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-wide max-w-[220px] truncate">
                            {resumeFile.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
                            {(resumeFile.size / 1024).toFixed(1)} KB · Ready to scan
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ERROR DISPLAY */}
                {error && (
                  <div className="p-3 bg-destructive/10 border-2 border-destructive flex items-center gap-2.5 text-xs font-bold text-destructive uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-primary text-white font-black font-display uppercase tracking-widest text-sm border-2 border-border shadow-[4px_4px_0px_0px_#090e1a] hover:shadow-[2px_2px_0px_0px_#090e1a] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {resumeFile ? 'Scanning Resume + GitHub + LeetCode...' : 'Fetching GitHub & Running AI...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate Analysis Report
                    </>
                  )}
                </button>

                {/* Loading progress text */}
                {loading && (
                  <div className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary animate-pulse">
                    {resumeFile ? 'Parsing PDF → ' : ''}Fetching GitHub → LeetCode → Groq AI → Building Report...
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Info Panel */}
          <div className="lg:col-span-4 space-y-6">

            {/* What This Does */}
            <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_#090e1a] p-6">
              <h3 className="text-sm font-black font-display uppercase tracking-tighter border-b-2 border-border pb-2 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                {[
                  { icon: GitBranch, label: 'GitHub Fetch', desc: 'Real repos, stars, forks & language stats pulled automatically' },
                  { icon: Trophy, label: 'LeetCode Scan', desc: 'Actual solved counts & contest rank from LeetCode API' },
                  { icon: FileText, label: 'Resume Parse', desc: 'AI reads your PDF to extract experience, education & skills' },
                  { icon: Sparkles, label: 'Groq LLaMA 3', desc: 'Generates a structured hiring report with scores & action plan' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary">{label}</div>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Limit Notice */}
            <div className="bg-primary/5 border-2 border-primary/30 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                ⚡ Rate Limit
              </p>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                10 analyses per 15 minutes per IP. LeetCode data is fetched live — username must match exactly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── REPORT OUTPUT ── */}
      {result && (
        <section ref={reportRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
          <div className="h-1 stripe-bg mb-8" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">Analysis Complete</p>
              <h2 className="text-3xl font-black font-display uppercase tracking-tighter text-white">
                Candidate Report
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="btn-forge-primary !text-[10px] !py-2.5 !px-5 flex items-center gap-2 no-print"
              >
                <Printer className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="btn-forge-secondary !text-[10px] !py-2.5 !px-5 no-print"
              >
                New Analysis
              </button>
            </div>
          </div>
          <ReportPreview data={result} onNewAnalysis={() => setResult(null)} />
        </section>
      )}

    </div>
  );
};
