'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ActiveSyllabus {
  week: number;
  topic: string;
  description: string;
  status: 'Ready' | 'Completed' | 'Locked';
}

export default function StudentDashboardPage() {
  const [activeTopics] = useState<ActiveSyllabus[]>([
    {
      week: 1,
      topic: 'Arrays and Dynamic Memory',
      description: 'Contiguous allocations, multi-dimensional array arithmetic, and capacity tracking vectors.',
      status: 'Ready'
    },
    {
      week: 2,
      topic: 'Singly & Doubly Linked Lists',
      description: 'Pointer management, structural insertions, node fragmentation, and head/tail tracking.',
      status: 'Locked'
    },
    {
      week: 3,
      topic: 'Stacks and Queues',
      description: 'LIFO/FIFO circular implementations, boundary limits, and buffer applications.',
      status: 'Locked'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Greeting Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-white shadow-md">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, Engineer! 👋</h1>
          <p className="mt-2 text-indigo-200 text-sm sm:text-base max-w-xl">
            Your instructor just updated the curriculum control core. Your active interview prep target has adjusted to focus on real-time classroom progress.
          </p>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Target</span>
            <p className="text-xl font-bold text-slate-800 mt-1">Week 1 Courseware</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">0 Practice Run(s)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Confidence Rating</span>
            <p className="text-xl font-bold text-indigo-600 mt-1">Pending Evaluation</p>
          </div>
        </div>

        {/* Assigned Targets Row */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">🎯 Active Syllabus Training Nodes</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {activeTopics.map((node) => (
              <div 
                key={node.week}
                className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-6 bg-white shadow-sm transition-all ${
                  node.status === 'Ready' ? 'border-indigo-100 ring-2 ring-indigo-600/5' : 'border-slate-100 opacity-75'
                }`}
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className={`rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                      node.status === 'Ready' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      Academic Week {node.week}
                    </span>
                    <span className="text-xs font-medium text-slate-400">• Data Structures</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 pt-1">{node.topic}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{node.description}</p>
                </div>

                <div className="mt-4 sm:mt-0">
                  {node.status === 'Ready' ? (
                    <Link 
                      href="/student/interview"
                      className="inline-block rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                    >
                      🚀 Start AI Interview
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed w-full sm:w-auto text-center border"
                    >
                      🔒 Pending Faculty Release
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
