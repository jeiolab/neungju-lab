import React from 'react';
import { ProjectState } from '../types';

interface ProjectCardProps {
  data: ProjectState;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ data }) => {
  return (
    <div id="project-card" className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
      <div className="bg-indigo-600 px-6 py-5">
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white leading-tight">{data.generatedTitle || "나만의 프로젝트"}</h2>
            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">IoT Solution</span>
        </div>
        <p className="text-indigo-100 text-sm mt-1">Created by {data.studentName || '학생 개발자'}</p>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Problem Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">발견한 문제 (Problem)</h3>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700">
            {data.problem}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">입력 (Sensors)</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              {data.selectedSensors.map((s, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">출력 (Actions)</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              {data.selectedActions.map((a, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logic Flow */}
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 flex items-center justify-center space-x-2 text-sm text-indigo-800 font-medium">
            <span>감지</span>
            <span className="text-indigo-400">➜</span>
            <span>판단/처리</span>
            <span className="text-indigo-400">➜</span>
            <span>동작</span>
        </div>

        {/* Effect */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">기대 효과 (Benefit)</h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            {data.generatedEffect}
          </p>
        </div>

        {/* Ethics */}
        <div className="border-t border-slate-100 pt-4 mt-2">
             <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                생각해 볼 문제 (Ethics)
             </h3>
             <p className="text-slate-600 text-xs italic bg-red-50 p-2 rounded border border-red-100">
               "{data.ethicalIssue}"
             </p>
        </div>
      </div>
    </div>
  );
};