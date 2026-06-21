import React, { useState } from 'react';
import { Award, Compass, CheckCircle2, ChevronRight, BookOpen, ExternalLink, Flag } from 'lucide-react';

const Roadmap = ({ predictionData }) => {
  if (!predictionData) {
    return (
      <div className="glass-card flex flex-col items-center justify-center text-center gap-6 py-20 animate-fade-in">
        <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center text-gray-500">
          <Compass size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">No Roadmap Active</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">Please complete the Skill Profiler prediction first to generate your custom learning path.</p>
        </div>
      </div>
    );
  }

  const { role, lpa, skillGap, requiredSkills, roadmap, companies, studentProfile } = predictionData;
  
  // Set up roadmap steps tracking
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const toggleStep = (step) => {
    const newSteps = new Set(completedSteps);
    if (newSteps.has(step)) {
      newSteps.delete(step);
    } else {
      newSteps.add(step);
    }
    setCompletedSteps(newSteps);
  };

  // Generate SVG Radar Chart Points
  // Skills to map: DSA, Web Dev, Java, Python, CGPA, Communication
  const chartSkills = [
    { name: "DSA", key: "dsa", max: 10 },
    { name: "Web Dev", key: "web_dev", max: 10 },
    { name: "Java", key: "java", max: 10 },
    { name: "Python", key: "python", max: 10 },
    { name: "CGPA", key: "cgpa", max: 10 },
    { name: "Soft Skills", key: "communication", max: 10 }
  ];

  const cx = 150;
  const cy = 150;
  const r = 100;
  
  const getPointsStr = (isActual) => {
    return chartSkills.map((skill, index) => {
      const angle = (index * 2 * Math.PI) / chartSkills.length - Math.PI / 2;
      let val = 0;
      if (isActual) {
        val = skill.key === "cgpa" ? studentProfile.cgpa : studentProfile[skill.key];
      } else {
        val = requiredSkills[skill.key] || 5;
      }
      
      const valScaled = (val / skill.max) * r;
      const x = cx + valScaled * Math.cos(angle);
      const y = cy + valScaled * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  };

  // Helper to draw axis lines and label positioning
  const axisDetails = chartSkills.map((skill, index) => {
    const angle = (index * 2 * Math.PI) / chartSkills.length - Math.PI / 2;
    const xLine = cx + r * Math.cos(angle);
    const yLine = cy + r * Math.sin(angle);
    // Position labels slightly outside the circle radius
    const xLabel = cx + (r + 20) * Math.cos(angle);
    const yLabel = cy + (r + 15) * Math.sin(angle);
    
    // Label alignments based on angle quadrant
    let textAnchor = "middle";
    if (Math.cos(angle) > 0.1) textAnchor = "start";
    else if (Math.cos(angle) < -0.1) textAnchor = "end";

    return { xLine, yLine, xLabel, yLabel, textAnchor, label: skill.name };
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Overview */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Custom Learning Path & Skills Gap</h1>
          <p className="text-sm text-gray-400 mt-1">
            Personalized learning milestones for <span className="font-semibold text-indigo-400">{role}</span> targets
          </p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-300">
          Target Package: ₹{lpa} LPA
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Radar Chart Panel - 2/5 cols */}
        <div className="lg:col-span-2 glass-card space-y-6 flex flex-col items-center">
          <div className="text-center w-full">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Skill Comparison Radar</h3>
            <p className="text-xs text-gray-400 mt-1">Comparing your ratings (green) vs target benchmarks (indigo)</p>
          </div>

          {/* SVG Radar Chart */}
          <div className="w-full flex justify-center max-w-[280px]">
            <svg viewBox="0 0 300 300" className="w-full h-auto overflow-visible">
              {/* Background Concentric Polygons */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
                <polygon
                  key={i}
                  points={chartSkills.map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / chartSkills.length - Math.PI / 2;
                    const x = cx + r * scale * Math.cos(angle);
                    const y = cy + r * scale * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(" ")}
                  className="fill-transparent stroke-gray-800"
                  strokeWidth="1"
                />
              ))}

              {/* Axis Lines */}
              {axisDetails.map((axis, i) => (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={axis.xLine}
                  y2={axis.yLine}
                  className="stroke-gray-800/80"
                  strokeWidth="1"
                />
              ))}

              {/* Required Skills Area (Indigo) */}
              <polygon
                points={getPointsStr(false)}
                className="fill-indigo-500/10 stroke-indigo-500/60"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Actual Skills Area (Emerald) */}
              <polygon
                points={getPointsStr(true)}
                className="fill-emerald-500/20 stroke-emerald-500"
                strokeWidth="2.5"
              />

              {/* Text Labels */}
              {axisDetails.map((axis, i) => (
                <text
                  key={i}
                  x={axis.xLabel}
                  y={axis.yLabel}
                  textAnchor={axis.textAnchor}
                  className="fill-gray-400 text-[10px] font-bold"
                  dominantBaseline="middle"
                >
                  {axis.label}
                </text>
              ))}
            </svg>
          </div>

          {/* Grid of skill gaps */}
          <div className="w-full space-y-3 bg-white/5 p-4 rounded-xl border border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skill Gap Breakdown</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {skillGap.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 font-medium">{item.skill}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">Score: {item.actual} / {item.required}</span>
                    {item.gap > 0 ? (
                      <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md text-[10px]">
                        -{item.gap} Needed
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px]">
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Steps Panel - 3/5 cols */}
        <div className="lg:col-span-3 glass-card space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Flag className="text-indigo-400" size={16} />
              <span>Step-by-Step Learning roadmap</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Mark steps completed as you learn. Completing milestones upgrades your profile readiness.</p>
          </div>

          <div className="space-y-4">
            {roadmap.map((step, idx) => {
              const isDone = completedSteps.has(step);
              return (
                <div 
                  key={idx}
                  onClick={() => toggleStep(step)}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isDone 
                      ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-300/90' 
                      : 'bg-white/5 border-gray-800/80 hover:border-gray-700/80 text-gray-300'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    <CheckCircle2 
                      size={18} 
                      className={`transition-colors ${isDone ? 'text-emerald-400 fill-emerald-400/20' : 'text-gray-600'}`} 
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-gray-500' : ''}`}>
                      {step}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Recommended milestone {idx + 1} for target role preparation. Learn concepts, review guides, and build core projects.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resources panel */}
          <div className="border-t border-gray-800/80 pt-6 space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Preparation Courses</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="https://www.coursera.org" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-white/5 border border-gray-800 rounded-xl hover:border-indigo-500/20 transition-all text-xs"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <BookOpen size={14} className="text-indigo-400" />
                  <span>Coursera Specialized Paths</span>
                </div>
                <ExternalLink size={12} className="text-gray-500" />
              </a>
              
              <a 
                href="https://www.udemy.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-white/5 border border-gray-800 rounded-xl hover:border-indigo-500/20 transition-all text-xs"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <BookOpen size={14} className="text-indigo-400" />
                  <span>Udemy Practical Bootcamps</span>
                </div>
                <ExternalLink size={12} className="text-gray-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
