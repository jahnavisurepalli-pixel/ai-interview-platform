'use client';

import { useState } from 'react';

interface Topic {
  id: string;
  title: string;
  learning_outcome: string;
  is_completed: boolean;
}

export default function FacultyPortalPage() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [message, setMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      title: 'Arrays and Dynamic Memory',
      learning_outcome: 'Understand contiguous memory allocation, pointer arithmetic, and runtime resizing arrays.',
      is_completed: false
    },
    {
      id: '2',
      title: 'Singly & Doubly Linked Lists',
      learning_outcome: 'Implement node structures, dynamic allocations, list traversals, and O(1) head/tail insertions.',
      is_completed: false
    },
    {
      id: '3',
      title: 'Stacks and Queues',
      learning_outcome: 'Build LIFO and FIFO structures using arrays and linked elements with overflow protection.',
      is_completed: false
    }
  ]);

  const toggleTopic = (id: string) => {
    setTopics(prev =>
      prev.map(topic =>
        topic.id === id ? { ...topic, is_completed: !topic.is_completed } : topic
      )
    );
  };

  const handlePublishProgress = () => {
    setPublishing(true);
    setMessage('');
    
    const completedTopics = topics.filter(t => t.is_completed);

    if (completedTopics.length === 0) {
      setMessage('⚠️ Please select at least one completed topic before publishing.');
      setPublishing(false);
      return;
    }

    // Simulate an instant successful background save
    setTimeout(() => {
      setMessage(`🎉 Week ${currentWeek} syllabus updates published successfully! AI Interview Engine synchronized.`);
      setPublishing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Top Management Navbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-6 shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Faculty Academic Core Control</h1>
            <p className="mt-1 text-sm text-slate-500">Department of Computer Science & Engineering</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Academic Week:</label>
            <select 
              value={currentWeek} 
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="rounded-lg border-slate-300 bg-white p-2 text-sm shadow-sm font-bold border"
            >
              {[1, 2, 3, 4].map(w => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Syllabus Selection Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm border space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-slate-800">📚 Subject: Data Structures and Algorithms</h2>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-1">Syllabus Completion Checklist</p>
          </div>

          <div className="space-y-4">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                  topic.is_completed ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <input
                  type="checkbox"
                  id={topic.id}
                  checked={topic.is_completed}
                  onChange={() => toggleTopic(topic.id)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor={topic.id} className="cursor-pointer select-none flex-1">
                  <h3 className="font-bold text-slate-800">{topic.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{topic.learning_outcome}</p>
                </label>
              </div>
            ))}
          </div>

          {/* Messages and Submit CTA */}
          <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm font-medium text-slate-700 max-w-md">{message}</p>
            <button
              onClick={handlePublishProgress}
              disabled={publishing}
              className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white shadow hover:bg-slate-800 transition-colors disabled:bg-slate-400 w-full sm:w-auto text-center"
            >
              {publishing ? 'Publishing Changes...' : 'Publish Weekly Progress'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
