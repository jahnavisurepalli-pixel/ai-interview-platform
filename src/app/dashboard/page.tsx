'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Topic {
  id: string;
  title: string;
  learning_outcome: string;
}

export default function StudentDashboard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Jahnavi'); // Sets your name cleanly as the primary indicator

  useEffect(() => {
    async function fetchDashboardData() {
      // 1. Fetch user authentication profile details securely
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .limit(1)
          .maybeSingle();
        
        if (profile?.first_name) {
          setUserName(profile.first_name);
        }
      }

      // 2. Fetch the syllabus topics seeded for the pilot
      const { data: topicsData, error } = await supabase
        .from('topics')
        .select('id, title, learning_outcome');

      if (!error && topicsData) {
        setTopics(topicsData);
      }
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600">Loading your interview workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Dashboard Title banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
            <p className="mt-1 text-sm text-gray-500">Track your curriculum progress and prepare for your weekly viva.</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
            className="mt-4 sm:mt-0 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>

        {/* Active Course Syllabus Track card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3 mb-4">
            📚 Active Course: Data Structures and Algorithms
          </h2>
          
          <p className="text-sm font-medium text-indigo-600 mb-4">
            Syllabus-Aware Syllabus Tracker (Pilot Phase 1)
          </p>

          <div className="space-y-4">
            {topics.map((topic, index) => (
              <div key={topic.id} className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{topic.learning_outcome}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger Button */}
          <div className="mt-8 flex justify-end">
            <button 
              onClick={() => window.location.href = '/interview'}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-indigo-500"
            >
              Start Weekly AI Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
