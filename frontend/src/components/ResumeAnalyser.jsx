import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Sparkles, Check, RefreshCw } from 'lucide-react';

const ResumeAnalyser = ({ apiBaseUrl }) => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Java Developer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showDifference, setShowDifference] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please paste your resume text first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setShowDifference(false);

    try {
      const res = await fetch(`${apiBaseUrl}/api/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_text: resumeText,
          target_role: targetRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Resume analysis failed:", err);
      alert("Error analyzing resume. Please make sure the backend is online.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to load sample text
  const loadSampleResume = () => {
    setResumeText(
      `RAHUL KUMAR\nEmail: rahul.kumar@gmail.com\nBranch: CSE\n\nOBJECTIVE\nHighly motivated student seeking a Software Development role to apply programming skills.\n\nEDUCATION\nB.Tech in Computer Science - CGPA: 8.5\n\nEXPERIANCE (Typo check)\nWeb Intern at LocalTech: Worked on frontend layouts and handled server-side data.\nCreated responsive layouts using HTML5 and CSS.\n\nPROJECTS\n1. E-Commerce Platform: Built using Java and Spring Boot. Handled database connections.\n2. Coding Practice: Solved 200+ data structures problems.\n\nSKILLS\nJava, SQL, Data Structures, Git, CSS, Basic HTML`
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Overview */}
      <div>
        <h1 className="text-2xl font-extrabold">Resume Analyser & ATS Optimizer</h1>
        <p className="text-sm text-gray-400 mt-1">Upload your resume text, scan for formatting and grammatical errors, and optimize keywords for your target role</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Panel - 2/5 cols */}
        <div className="lg:col-span-2 glass-card space-y-6 h-fit">
          <div className="space-y-4">
            <div>
              <label className="form-label">Target Role Optimization</label>
              <select 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
                className="form-input text-sm"
              >
                <option value="Java Developer">Java Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Paste Resume Text</label>
                <button 
                  type="button" 
                  onClick={loadSampleResume}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded"
                >
                  Load Sample
                </button>
              </div>
              <textarea 
                rows="14"
                placeholder="Paste the plain text of your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="form-input text-xs font-mono resize-y min-h-[300px]"
              />
            </div>
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Scanning Resume...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Run ATS Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel - 3/5 cols */}
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Scores Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="glass-card flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Score</span>
                  <span className={`text-4xl font-extrabold mt-2 ${getScoreColor(result.overall_score)}`}>
                    {result.overall_score}%
                  </span>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        result.overall_score >= 80 ? 'bg-emerald-500' :
                        result.overall_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${result.overall_score}%` }}
                    />
                  </div>
                </div>

                {/* ATS Keyword Score */}
                <div className="glass-card flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ATS Keyword Match</span>
                  <span className={`text-4xl font-extrabold mt-2 ${getScoreColor(result.ats_score)}`}>
                    {result.ats_score}%
                  </span>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        result.ats_score >= 70 ? 'bg-emerald-500' :
                        result.ats_score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${result.ats_score}%` }}
                    />
                  </div>
                </div>

                {/* Mistakes Found */}
                <div className="glass-card flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Spelling Mistakes</span>
                  <span className={`text-4xl font-extrabold mt-2 ${
                    result.mistakes.length === 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {result.mistakes.length}
                  </span>
                  <span className="text-xs text-gray-400 mt-4">
                    {result.mistakes.length === 0 ? "Perfect spelling!" : "Review suggestions below"}
                  </span>
                </div>
              </div>

              {/* Sections Checklist */}
              <div className="glass-card space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Required Resume Sections</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(result.section_check).map(([sec, present]) => (
                    <div 
                      key={sec} 
                      className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                        present ? 'bg-emerald-950/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-950/10 border-rose-500/25 text-rose-400'
                      }`}
                    >
                      {present ? <CheckCircle size={18} className="mb-2" /> : <XCircle size={18} className="mb-2" />}
                      <span className="text-xs font-semibold leading-tight">{sec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions / Improvements */}
              <div className="glass-card space-y-4">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={16} />
                  <span>Prioritized Recommendations</span>
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((imp, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-gray-300">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corrections Board */}
              {result.mistakes.length > 0 && (
                <div className="glass-card space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Grammar & Typing Corrections</h3>
                    <button 
                      onClick={() => setShowDifference(!showDifference)}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      {showDifference ? "Show Mistake List" : "Show Corrected Text"}
                    </button>
                  </div>

                  {showDifference ? (
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                      <h4 className="text-xs font-semibold text-gray-400 mb-2 border-b border-gray-800 pb-1">Formatted Output</h4>
                      <pre className="text-xs font-mono whitespace-pre-wrap text-emerald-400/90 leading-relaxed">
                        {result.corrected_text}
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.mistakes.map((mistake, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-4 p-3 bg-red-950/10 border border-red-500/10 rounded-xl text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-rose-400 line-through">{mistake.wrong}</span>
                              <ChevronRight size={12} className="text-gray-500" />
                              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Check size={10} />
                                {mistake.correct}
                              </span>
                            </div>
                            <p className="text-gray-400">{mistake.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Missing Keywords Details */}
              {result.missing_keywords.length > 0 && (
                <div className="glass-card space-y-4">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Missing ATS Keywords</h3>
                  <p className="text-xs text-gray-400">Incorporate these skills naturally into your summary, skills, or project bullets to boost search visibility:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw, idx) => (
                      <span key={idx} className="bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card flex flex-col items-center justify-center text-center gap-6 h-full py-32">
              <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-500">
                <FileText size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Ready for Upload</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">Paste your resume details on the left, select your target role, and run analysis to view compliance reports.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyser;
