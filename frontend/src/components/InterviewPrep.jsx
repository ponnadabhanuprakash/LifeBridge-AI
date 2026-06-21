import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Star, Building, HelpCircle as QIcon, Sparkles } from 'lucide-react';

const InterviewPrep = ({ apiBaseUrl, currentRole }) => {
  const [role, setRole] = useState(currentRole || 'Java Developer');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (currentRole) {
      setRole(currentRole);
    }
  }, [currentRole]);

  useEffect(() => {
    fetchQuestions();
  }, [role]);

  const fetchQuestions = async () => {
    setLoading(true);
    setExpandedIndex(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/interview-prep?role=${encodeURIComponent(role)}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Interview Question Bank</h1>
          <p className="text-sm text-gray-400 mt-1">Review guessed questions and answers compiled for your target role and preparation</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-400 uppercase">Select Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="form-input text-xs w-48 py-1.5"
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
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Fetching interview questions...</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {questions.length === 0 ? (
            <div className="glass-card text-center py-12 text-gray-500">
              No specific questions loaded for this role yet. Showing default questions.
            </div>
          ) : (
            questions.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`glass-card p-0 overflow-hidden border transition-all ${
                    isExpanded ? 'border-indigo-500/30 shadow-indigo-950/10' : 'border-gray-800'
                  }`}
                >
                  {/* Collapsible Header */}
                  <div 
                    onClick={() => toggleExpand(idx)}
                    className="flex justify-between items-center gap-4 p-5 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5 shrink-0">
                        <QIcon size={16} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-200 leading-snug">
                        {item.q}
                      </h3>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-800/80 p-5 bg-white/[0.01] space-y-4 text-xs leading-relaxed animate-fade-in">
                      {/* Answer Key */}
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Model Answer Key</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{item.a}</p>
                      </div>

                      {/* Preparation tips */}
                      {item.tips && (
                        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3.5 flex items-start gap-2.5">
                          <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-400">Pro Prep Tips: </span>
                            <span className="text-gray-300">{item.tips}</span>
                          </div>
                        </div>
                      )}

                      {/* Known Companies tags */}
                      {item.companies && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px]">
                          <span className="text-gray-500 flex items-center gap-1 font-semibold uppercase">
                            <Building size={10} />
                            <span>Companies:</span>
                          </span>
                          {item.companies.map((company, index) => (
                            <span key={index} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-medium">
                              {company}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
