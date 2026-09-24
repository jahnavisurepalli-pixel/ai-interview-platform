'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface StudentPerformance {
  id: string;
  student_name: string;
  roll_number: string;
  topic_title: string;
  score_percentage: number;
  evaluation_status: string;
  created_at: string;
}

export default function FacultyAnalyticsPage() {
  const [scores, setScores] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch live interview scores from Supabase table
  useEffect(() => {
    async function fetchLiveAnalytics() {
      try {
        const { data, error } = await supabase
          .from('interview_scores')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setScores(data || []);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Could not connect to database rosters.');
      } finally {
        setLoading(false);
      }
    }
    fetchLiveAnalytics();
  }, []);

  // Calculate accurate summary metrics from real database rows
  const totalSubmissions = scores.length;
  const classAvg = totalSubmissions > 0 
    ? Math.round(scores.reduce((sum, item) => sum + item.score_percentage, 0) / totalSubmissions) 
    : 0;
  const flaggedCount = scores.filter(item => item.evaluation_status === 'Flagged').length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading live cohort grade matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Navigation Navbar row */}
        <div className="flex items-center justify-between">
          <Link href="/faculty" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            ← Back to Syllabus Control
          </Link>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold animate-pulse">
            ● Live Sync Engaged
          </span>
        </div>

        {/* Header Summary */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Class Cohort Performance Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Live Database Connection — Subject: Data Structures & Algorithms</p>
        </div>

        {/* Real-Time Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Average Score</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{totalSubmissions > 0 ? `${classAvg}%` : 'No Data'}</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Evaluated Runs</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{totalSubmissions} Student(s)</p>
          </div>
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Flagged Sessions</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{flaggedCount} Flagged</p>
          </div>
        </div>

        {/* Dynamic Performance Data Grid Table */}
        <div className="rounded-xl bg-white border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Live Student Roster Log</h2>
            <p className="text-xs text-slate-500 mt-0.5">Every row below represents an actual completion record extracted directly from your database.</p>
          </div>

          {scores.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No live records found in the `interview_scores` table yet. Go finish an interview to seed it!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Student Profile Name</th>
                    <th className="p-4">Roll Identifier</th>
                    <th className="p-4">Topic Target</th>
                    <th className="p-4">Assessed Grade</th>
                    <th className="p-4 pr-6 text-right">System State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {scores.map((scoreItem) => (
                    <tr key={scoreItem.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-900">{scoreItem.student_name}</td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{scoreItem.roll_number}</td>
                      <td className="p-4 text-slate-600 text-xs font-semibold">{scoreItem.topic_title}</td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900">
                          {scoreItem.score_percentage}%
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                          scoreItem.evaluation_status === 'Flagged' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {scoreItem.evaluation_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
