import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  Map, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck,
  Award,
  TrendingUp
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import SkillProfiler from './components/SkillProfiler';
import ResumeAnalyser from './components/ResumeAnalyser';
import Roadmap from './components/Roadmap';
import MockTests from './components/MockTests';
import InterviewPrep from './components/InterviewPrep';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [predictionData, setPredictionData] = useState(null);
  const [mockScore, setMockScore] = useState(-1); // -1 means not taken yet

  const handlePredictionComplete = (data) => {
    setPredictionData(data);
  };

  const handleTestSubmit = (scorePercentage) => {
    setMockScore(scorePercentage);
    
    // If prediction already exists, trigger a re-prediction using the new mock score to boost/reduce the LPA package dynamically!
    if (predictionData && predictionData.studentProfile) {
      triggerRePredict(predictionData.studentProfile, scorePercentage);
    }
  };

  const triggerRePredict = async (profile, currentMockScore) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profile,
          mock_score: currentMockScore
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setPredictionData(prev => ({
          ...prev,
          role: data.recommended_role,
          lpa: data.package_lpa,
          skillGap: data.skill_gap,
          requiredSkills: data.required_skills,
          roadmap: data.learning_path,
          companies: data.companies
        }));
      }
    } catch (err) {
      console.error("Re-prediction error:", err);
    }
  };

  // Nav Items definition
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', name: 'Skill Profiler', icon: <UserCheck size={20} /> },
    { id: 'resume', name: 'Resume Analyser', icon: <FileText size={20} /> },
    { id: 'roadmap', name: 'Career Roadmap', icon: <Map size={20} /> },
    { id: 'test', name: 'Mock Tests', icon: <BookOpen size={20} /> },
    { id: 'interview', name: 'Interview Prep', icon: <MessageSquare size={20} /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0b10] text-[#f3f4f6]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0e0f16] border-r border-[#1e202f] flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1e202f] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ResumeCraft
            </h2>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
              AI Analytics
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 text-white shadow-inner' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Placement Widget (Footer of Sidebar) */}
        {predictionData && (
          <div className="p-4 m-4 bg-indigo-950/20 border border-indigo-500/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <TrendingUp size={14} />
              <span>ACTIVE TARGET</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200 truncate">{predictionData.role}</h4>
              <span className="text-sm font-extrabold text-emerald-400">₹{predictionData.lpa} LPA</span>
            </div>
            {mockScore >= 0 && (
              <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-800/80 pt-2">
                <span>Mock Score:</span>
                <span className="text-indigo-400 font-bold">{mockScore}%</span>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-16 border-b border-[#1e202f] bg-[#0c0d15]/50 backdrop-blur-md flex items-center justify-between px-8">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Workspace Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            {mockScore >= 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-semibold">
                <Award size={14} />
                <span>Test HighScore: {mockScore}%</span>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
              B
            </div>
          </div>
        </header>

        {/* Tab Content Router */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard apiBaseUrl={API_BASE_URL} />}
          {activeTab === 'profile' && (
            <SkillProfiler 
              apiBaseUrl={API_BASE_URL} 
              onPredictionComplete={handlePredictionComplete} 
              mockScore={mockScore}
            />
          )}
          {activeTab === 'resume' && <ResumeAnalyser apiBaseUrl={API_BASE_URL} />}
          {activeTab === 'roadmap' && <Roadmap predictionData={predictionData} />}
          {activeTab === 'test' && (
            <MockTests 
              apiBaseUrl={API_BASE_URL} 
              currentRole={predictionData ? predictionData.role : 'Java Developer'} 
              onTestSubmit={handleTestSubmit}
            />
          )}
          {activeTab === 'interview' && (
            <InterviewPrep 
              apiBaseUrl={API_BASE_URL} 
              currentRole={predictionData ? predictionData.role : 'Java Developer'} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
