import React, { useEffect, useState } from 'react';
import { Database, TrendingUp, Briefcase, Award, Search, Info } from 'lucide-react';

const Dashboard = ({ apiBaseUrl }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalCount: 0,
    avgLpa: 0,
    topRole: 'N/A',
    topLpa: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        calculateStats(data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;
    
    const count = data.length;
    const totalLpa = data.reduce((sum, item) => sum + item.package_lpa, 0);
    const avg = (totalLpa / count).toFixed(2);
    
    // Find top role
    const rolesMap = {};
    let topR = 'N/A';
    let maxRoleCount = 0;
    let maxL = 0;
    
    data.forEach(item => {
      rolesMap[item.recommended_role] = (rolesMap[item.recommended_role] || 0) + 1;
      if (rolesMap[item.recommended_role] > maxRoleCount) {
        maxRoleCount = rolesMap[item.recommended_role];
        topR = item.recommended_role;
      }
      if (item.package_lpa > maxL) {
        maxL = item.package_lpa;
      }
    });

    setStats({
      totalCount: count,
      avgLpa: avg,
      topRole: topR,
      topLpa: maxL.toFixed(1)
    });
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.recommended_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card glow-card relative overflow-hidden p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)' }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Skill Analysis & <span className="gradient-text-accent">Career Path Recommendation</span>
          </h1>
          <p className="text-gray-400 max-w-xl">
            An advanced AI-powered capability suite designed to analyze student skills, optimize resumes, predict entry packages, and generate custom preparation roadmaps.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-indigo-900/30 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-300">
            Track: Agents for Good
          </div>
          <div className="px-4 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-xs font-semibold text-purple-300">
            Tech: Random Forest ML
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Database size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Dataset Profiles</p>
            <h3 className="text-2xl font-bold">{stats.totalCount} Students</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Average Expected LPA</p>
            <h3 className="text-2xl font-bold">₹{stats.avgLpa} LPA</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-400">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Top Job Role</p>
            <h3 className="text-2xl font-bold truncate max-w-[160px]">{stats.topRole}</h3>
          </div>
        </div>

        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-pink-500/10 rounded-xl text-pink-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">Highest Package</p>
            <h3 className="text-2xl font-bold">₹{stats.topLpa} LPA</h3>
          </div>
        </div>
      </div>

      {/* ML Pipeline Explainer Card */}
      <div className="glass-card grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Info size={18} />
            <span>How the Machine Learning Predictor Works</span>
          </div>
          <h2 className="text-xl font-bold">Random Forest Decision Model</h2>
          <p className="text-sm text-gray-400">
            Our backend utilizes Python's <strong>Scikit-Learn</strong> library to run a Random Forest Classifier and Regressor. The model is trained dynamically on the student dataset below. When you input your CGPA, technical skills (Java, Python, Web Dev, DSA), and soft skills (Communication, Leadership), the algorithm traces decision trees to classify you into the most matching job role and project your estimated market salary package.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300"><strong>Input:</strong> CGPA, Skill Ratings, Projects, Internships</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-gray-300"><strong>Output:</strong> Recommended Role, Learning Path, Predicted LPA</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4 bg-indigo-950/20 border border-indigo-500/10 rounded-xl">
          <h4 className="text-sm font-semibold text-indigo-300 border-b border-indigo-500/10 pb-2">Sample Path Matching</h4>
          <div className="text-xs space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Java + DSA (Ratings 8+)</span>
              <span className="text-indigo-400 font-medium">Java Developer</span>
            </div>
            <div className="flex justify-between">
              <span>Python + Statistics</span>
              <span className="text-indigo-400 font-medium">Data Scientist</span>
            </div>
            <div className="flex justify-between">
              <span>MERN Stack (Web 8+)</span>
              <span className="text-indigo-400 font-medium">Full Stack Dev</span>
            </div>
            <div className="flex justify-between">
              <span>Networking + Security</span>
              <span className="text-indigo-400 font-medium">Cybersecurity Analyst</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Visualizer Table */}
      <div className="glass-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Student Reference Dataset</h2>
            <p className="text-sm text-gray-400">Real-time view of data points used to train the Random Forest decision model</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search student or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 py-2 text-sm w-full sm:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400">Loading training dataset...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-300 text-xs font-semibold uppercase tracking-wider border-b border-gray-800">
                  <th className="py-4 px-5">ID</th>
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Branch</th>
                  <th className="py-4 px-5">CGPA</th>
                  <th className="py-4 px-5 text-center">Java</th>
                  <th className="py-4 px-5 text-center">Python</th>
                  <th className="py-4 px-5 text-center">Web Dev</th>
                  <th className="py-4 px-5 text-center">DSA</th>
                  <th className="py-4 px-5 text-center">Comm.</th>
                  <th className="py-4 px-5">Recommended Role</th>
                  <th className="py-4 px-5 text-right">Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-sm">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-8 text-gray-500">No matching records found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => (
                    <tr key={student.id || idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 font-mono text-gray-500">{student.student_id}</td>
                      <td className="py-4 px-5 font-semibold">{student.name}</td>
                      <td className="py-4 px-5 text-gray-400">{student.branch}</td>
                      <td className="py-4 px-5">
                        <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded text-xs font-medium">
                          {student.cgpa.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center text-gray-300">{student.java}/10</td>
                      <td className="py-4 px-5 text-center text-gray-300">{student.python}/10</td>
                      <td className="py-4 px-5 text-center text-gray-300">{student.web_dev}/10</td>
                      <td className="py-4 px-5 text-center text-gray-300">{student.dsa}/10</td>
                      <td className="py-4 px-5 text-center text-gray-300">{student.communication}/10</td>
                      <td className="py-4 px-5 font-medium text-purple-300">{student.recommended_role}</td>
                      <td className="py-4 px-5 text-right font-bold text-emerald-400">₹{student.package_lpa.toFixed(1)} LPA</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
