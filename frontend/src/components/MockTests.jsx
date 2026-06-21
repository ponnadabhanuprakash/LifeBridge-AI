import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Check, X, Clock, RefreshCw, Award, ArrowRight } from 'lucide-react';

const MockTests = ({ apiBaseUrl, currentRole, onTestSubmit }) => {
  const [role, setRole] = useState(currentRole || 'Java Developer');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizActive, setQuizActive] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (currentRole) {
      setRole(currentRole);
    }
  }, [currentRole]);

  // Load questions
  const loadQuiz = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setQuizActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      const res = await fetch(`${apiBaseUrl}/api/mock-test?role=${encodeURIComponent(role)}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Error loading quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizActive(true);
    setTimeLeft(600);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const selectOption = (qId, optionIdx) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleAutoSubmit = () => {
    // Collect answers and trigger submit
    handleSubmit(null, true);
  };

  const handleSubmit = (e, autoSubmit = false) => {
    if (e) e.preventDefault();
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);
    setQuizActive(false);

    if (onTestSubmit) {
      onTestSubmit(percentage);
    }

    if (!autoSubmit) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    loadQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [role]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Domain Skill Mock Tests</h1>
          <p className="text-sm text-gray-400 mt-1">Select your domain, take a timed mock assessment, and review explanations to prepare</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-400 uppercase">Select Domain:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            disabled={quizActive}
            className="form-input text-xs w-48 py-1.5"
          >
            <option value="Java Developer">Java Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Fetching assessment quiz...</p>
        </div>
      ) : !quizActive && !submitted ? (
        /* Start Screen */
        <div className="glass-card text-center max-w-xl mx-auto py-12 px-8 space-y-6">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
            <BookOpen size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{role} MCQ Assessment</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              This assessment evaluates your proficiency in {role} concepts. Completing this test updates your skills records and raises your expected LPA package based on your final score!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left bg-white/5 p-4 rounded-xl text-xs max-w-sm mx-auto">
            <div><strong>Questions:</strong> 10 Multiple Choice</div>
            <div><strong>Duration:</strong> 10 Minutes</div>
            <div><strong>Rules:</strong> Dynamic timer</div>
            <div><strong>Effect:</strong> Upgrades predicted LPA</div>
          </div>
          <button onClick={startQuiz} className="btn-primary px-8">
            <span>Start Test Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* Quiz Active or Submitted Screen */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Quiz Area - 3/4 cols */}
          <div className="lg:col-span-3 space-y-6">
            {submitted && (
              /* Score Card Overlay */
              <div className="glass-card flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border-emerald-500/20 bg-emerald-950/5">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Assessment Completed
                  </span>
                  <h2 className="text-2xl font-bold mt-2">Your Score: {score}%</h2>
                  <p className="text-xs text-gray-400">
                    {score >= 80 ? "Stellar work! Your predicted LPA has been boosted on the profile." : 
                     score >= 50 ? "Solid effort. Revise target roadmap steps to increase scoring." : 
                     "Review correctness below and try again to improve your score."}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={loadQuiz} className="btn-secondary text-xs">
                    <RefreshCw size={14} />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            )}

            {/* Questions Listing */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="glass-card space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-0.5">Question {idx + 1} of {questions.length}</span>
                    {submitted && (
                      answers[q.id] === q.answer ? (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                          <Check size={10} /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                          <X size={10} /> Incorrect
                        </span>
                      )
                    )}
                  </div>
                  <h3 className="text-base font-semibold leading-relaxed text-gray-100">{q.question}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === oIdx;
                      const isCorrect = q.answer === oIdx;
                      
                      let optionStyle = "bg-white/5 border-gray-800 text-gray-300 hover:border-gray-700";
                      if (isSelected) {
                        optionStyle = "bg-indigo-950/20 border-indigo-500 text-indigo-200";
                      }
                      if (submitted) {
                        if (isCorrect) {
                          optionStyle = "bg-emerald-950/20 border-emerald-500 text-emerald-300";
                        } else if (isSelected) {
                          optionStyle = "bg-rose-950/20 border-rose-500 text-rose-300";
                        } else {
                          optionStyle = "bg-white/5 border-gray-800 text-gray-500 opacity-60";
                        }
                      }
                      
                      return (
                        <div 
                          key={oIdx}
                          onClick={() => selectOption(q.id, oIdx)}
                          className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer text-xs transition-all ${optionStyle}`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                            isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 pt-4 border-t border-gray-800/80 text-xs text-gray-400">
                      <strong>Explanation:</strong> The correct answer is option <strong>{q.options[q.answer]}</strong>. 
                      Make sure to double check concepts around this topic in your Roadmap reference tools.
                    </div>
                  )}
                </div>
              ))}

              {quizActive && (
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  <span>Submit Assessment Answers</span>
                </button>
              )}
            </form>
          </div>

          {/* Sticky Timer Area - 1/4 cols */}
          <div className="lg:col-span-1">
            <div className="glass-card sticky top-6 space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Assessment Timer</span>
                {quizActive ? (
                  <div className="flex items-center justify-center gap-2 text-2xl font-mono font-bold text-rose-400 mt-2">
                    <Clock size={22} className="animate-pulse" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <div className="text-lg font-bold text-gray-500 mt-2">Inactive</div>
                )}
              </div>

              {quizActive && (
                <div className="text-xs text-gray-400 leading-relaxed border-t border-gray-800/80 pt-4 text-left">
                  Do not refresh or navigate away from this tab, or your current progress will reset.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
