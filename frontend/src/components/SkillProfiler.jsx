import React, { useState } from 'react';
import { Award, Briefcase, ChevronRight, Save, Zap, Compass, DollarSign } from 'lucide-react';

const SkillProfiler = ({ apiBaseUrl, onPredictionComplete, mockScore }) => {
  const [profile, setProfile] = useState({
    name: '',
    branch: 'CSE',
    cgpa: 7.5,
    java: 5,
    python: 5,
    web_dev: 5,
    dsa: 5,
    communication: 5,
    leadership: 5,
    projects: 2,
    internships: 1,
    certifications: 1
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSliderChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTextChange = (key, value) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!profile.name.trim()) {
      alert("Please enter a student name first.");
      return;
    }
    
    setLoading(true);
    setSaveSuccess(false);
    
    try {
      const res = await fetch(`${apiBaseUrl}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profile,
          mock_score: mockScore
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
        if (onPredictionComplete) {
          onPredictionComplete({
            role: data.recommended_role,
            lpa: data.package_lpa,
            skillGap: data.skill_gap,
            requiredSkills: data.required_skills,
            roadmap: data.learning_path,
            companies: data.companies,
            studentProfile: profile
          });
        }
      }
    } catch (err) {
      console.error("Prediction failed:", err);
      alert("Error making prediction. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!prediction) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profile,
          recommended_role: prediction.recommended_role,
          package_lpa: prediction.package_lpa,
          career_interest: prediction.recommended_role
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error("Save profile failed:", err);
    }
  };

  // Helper to render factors list
  const getLpaFactors = () => {
    if (!prediction) return [];
    const factors = [];
    if (profile.cgpa >= 8.5) factors.push({ name: "High CGPA (>= 8.5)", value: "+1.5 LPA", type: "positive" });
    else if (profile.cgpa < 7.0) factors.push({ name: "Low CGPA (< 7.0)", value: "-1.0 LPA", type: "negative" });
    
    if (profile.dsa >= 8) factors.push({ name: "Strong DSA Foundation", value: "+2.0 LPA", type: "positive" });
    if (profile.projects >= 3) factors.push({ name: "Project Portfolio (3+ projects)", value: "+1.5 LPA", type: "positive" });
    if (profile.internships >= 1) factors.push({ name: "Prior Internship Experience", value: "+1.5 LPA", type: "positive" });
    if (profile.communication >= 8 && profile.leadership >= 8) factors.push({ name: "Excellent Soft Skills", value: "+1.0 LPA", type: "positive" });
    
    if (mockScore >= 80) factors.push({ name: "Excellent Mock Test Score", value: "+1.5 LPA", type: "positive" });
    else if (mockScore > 0 && mockScore < 50) factors.push({ name: "Weak Mock Test Score", value: "-0.8 LPA", type: "negative" });
    
    if (factors.length === 0) {
      factors.push({ name: "Base Entry Level Standard", value: "Standard Rate", type: "neutral" });
    }
    return factors;
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Input Panel - 3/5 cols */}
      <form onSubmit={handlePredict} className="lg:col-span-3 glass-card space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Compass className="text-indigo-400" size={22} />
            <span>Student Profile Details</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Provide your academic metrics and self-assessed ratings to trigger the ML recommendation model</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Kumar" 
              required
              value={profile.name}
              onChange={(e) => handleTextChange('name', e.target.value)}
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="form-label">Academic Branch</label>
            <select 
              value={profile.branch} 
              onChange={(e) => handleTextChange('branch', e.target.value)}
              className="form-input text-sm"
            >
              <option value="CSE">Computer Science & Engineering (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
              <option value="EEE">Electrical & Electronics (EEE)</option>
              <option value="MECH">Mechanical Engineering</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">CGPA ({profile.cgpa.toFixed(1)})</label>
            </div>
            <input 
              type="range" 
              min="5.0" 
              max="10.0" 
              step="0.1" 
              value={profile.cgpa}
              onChange={(e) => handleSliderChange('cgpa', parseFloat(e.target.value))}
              className="skill-slider"
            />
          </div>
          <div>
            <label className="form-label">Projects</label>
            <input 
              type="number" 
              min="0" 
              max="10" 
              value={profile.projects}
              onChange={(e) => handleSliderChange('projects', parseInt(e.target.value) || 0)}
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="form-label">Internships</label>
            <input 
              type="number" 
              min="0" 
              max="5" 
              value={profile.internships}
              onChange={(e) => handleSliderChange('internships', parseInt(e.target.value) || 0)}
              className="form-input text-sm"
            />
          </div>
        </div>

        {/* Skills Sliders Subgrid */}
        <div className="border-t border-gray-800/80 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Skill Ratings (1 - 10)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {/* Java */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Java & Object Oriented Design</span>
                <span className="text-indigo-400 font-bold">{profile.java}</span>
              </div>
              <input 
                type="range" min="1" max="10" value={profile.java} 
                onChange={(e) => handleSliderChange('java', parseInt(e.target.value))}
                className="skill-slider"
              />
            </div>

            {/* Python */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Python & Data Foundations</span>
                <span className="text-indigo-400 font-bold">{profile.python}</span>
              </div>
              <input 
                type="range" min="1" max="10" value={profile.python} 
                onChange={(e) => handleSliderChange('python', parseInt(e.target.value))}
                className="skill-slider"
              />
            </div>

            {/* Web Dev */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Web Development (HTML/CSS/JS/React)</span>
                <span className="text-indigo-400 font-bold">{profile.web_dev}</span>
              </div>
              <input 
                type="range" min="1" max="10" value={profile.web_dev} 
                onChange={(e) => handleSliderChange('web_dev', parseInt(e.target.value))}
                className="skill-slider"
              />
            </div>

            {/* DSA */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Data Structures & Algorithms</span>
                <span className="text-indigo-400 font-bold">{profile.dsa}</span>
              </div>
              <input 
                type="range" min="1" max="10" value={profile.dsa} 
                onChange={(e) => handleSliderChange('dsa', parseInt(e.target.value))}
                className="skill-slider"
              />
            </div>

            {/* Communication */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Communication & Soft Skills</span>
                <span className="text-indigo-400 font-bold">{profile.communication}</span>
              </div>
              <input 
                type="range" min="1" max="10" value={profile.communication} 
                onChange={(e) => handleSliderChange('communication', parseInt(e.target.value))}
                className="skill-slider"
              />
            </div>

            {/* Leadership */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Leadership & Management</span>
                <span className="text-indigo-400 font-bold">{profile.leadership}</span>
              </div>
              <input 
                type="range" min="1" max="10" value={profile.leadership} 
                onChange={(e) => handleSliderChange('leadership', parseInt(e.target.value))}
                className="skill-slider"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing ML Recommendations...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>Predict Career & LPA</span>
            </>
          )}
        </button>
      </form>

      {/* Output Panel - 2/5 cols */}
      <div className="lg:col-span-2 space-y-6">
        {prediction ? (
          <div className="glass-card glow-card flex flex-col items-center justify-between text-center gap-6 h-full animate-fade-in">
            <div className="space-y-1 w-full">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Model Recommendation
              </span>
              <h2 className="text-2xl font-bold mt-4">{prediction.recommended_role}</h2>
              <p className="text-sm text-gray-400">Matching path based on your input features</p>
            </div>

            {/* Circular Progress LPA Gauge */}
            <div className="relative flex items-center justify-center w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background path */}
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-current text-gray-800" 
                  strokeWidth="8" fill="transparent" 
                />
                {/* Foreground path (LPA score scaled out of 25 Max) */}
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-current text-emerald-500 transition-all duration-1000 ease-out" 
                  strokeWidth="8" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(prediction.package_lpa, 25) / 25)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">₹{prediction.package_lpa}</span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-0.5">LPA</span>
              </div>
            </div>

            {/* Positive/Negative factors list */}
            <div className="w-full text-left space-y-3 bg-white/5 p-4 rounded-xl border border-gray-800">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prediction Factors</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {getLpaFactors().map((factor, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">{factor.name}</span>
                    <span className={`font-semibold ${
                      factor.type === 'positive' ? 'text-emerald-400' : 
                      factor.type === 'negative' ? 'text-rose-400' : 'text-gray-400'
                    }`}>{factor.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Companies */}
            <div className="w-full space-y-2">
              <h4 className="text-xs text-gray-400 text-left font-bold uppercase tracking-wider">Key Target Companies</h4>
              <div className="flex flex-wrap gap-2 justify-start">
                {prediction.companies.map((company, index) => (
                  <span key={index} className="bg-gray-800 text-gray-200 border border-gray-700/50 text-xs px-3 py-1 rounded-lg font-medium">
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="w-full flex gap-3 mt-4">
              <button 
                type="button" 
                onClick={handleSaveToDatabase} 
                disabled={saveSuccess}
                className="btn-secondary flex-1 justify-center text-sm py-2.5"
              >
                <Save size={16} />
                <span>{saveSuccess ? "Profile Saved" : "Save Profile"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center text-center gap-6 h-full py-20">
            <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-500">
              <DollarSign size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Prediction Waiting</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">Fill in the student details and click the predict button to trigger the career algorithm.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillProfiler;
