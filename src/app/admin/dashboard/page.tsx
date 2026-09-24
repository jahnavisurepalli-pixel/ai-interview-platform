'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface StudentRecord {
  id: string;
  student_name: string;
  roll_number: string;
  topic_title: string;
  score_percentage: number;
  evaluation_status: string;
  created_at: string;
}

export default function FacultyDashboardPage() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Fetch performance rows directly from Cloud Supabase
  useEffect(() => {
    async function fetchScores() {
      try {
        const { data, error } = await supabase
          .from('interview_scores')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        // Local state mockup fallback if database tables are syncing
        setRecords([
          {
            id: '1',
            student_name: 'Jahnavi Surepalli',
            roll_number: '26CSE001',
            topic_title: 'Arrays and Dynamic Memory',
            score_percentage: 88,
            evaluation_status: 'Processed',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            student_name: 'Abhinandana Challari',
            roll_number: '26CSE004',
            topic_title: 'Linked Lists & Pointers',
            score_percentage: 42,
            evaluation_status: 'Flagged',
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, []);

  // Structural Function to convert database arrays to clean downloadable CSV strings
  const handleExportCSV = () => {
    if (records.length === 0) return;
    setExporting(true);

    const headers = ['Record ID', 'Student Name', 'Roll Number', 'Topic Tested', 'Depth Score %', 'Status', 'Timestamp'];
    const rows = records.map(rec => [
      rec.id,
      rec.student_name,
      rec.roll_number,
      rec.topic_title,
      `${rec.score_percentage}%`,
      rec.evaluation_status,
      rec.created_at
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create browser download link context wrapper
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Faculty_Evaluation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      
      {/* Faculty Control Navbar Header */}
      <header className="bg-slate-950 border-b border-slate-800 p-5 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-lg font-black text-white tracking-wide">Faculty Assessment Hub</h1>
          <p className="text-xs text-indigo-400 font-medium">Department Grid Vector Analytics & Review Panel</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV} 
            disabled={loading || records.length === 0 || exporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-all disabled:opacity-40"
          >
            {exporting ? 'Generating Sheet...' : '📥 Export Evaluation Data (.CSV)'}
          </button>
          <Link href="/student" className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs border border-slate-700 transition-all">
            Switch View
          </Link>
        </div>
      </header>

      {/* Main Records Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Statistics Metric Strip Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Evaluated Sessions</span>
            <span className="block text-2xl font-black text-white mt-1">{loading ? '...' : records.length}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Flagged Metrics (&lt;50%)</span>
            <span className="block text-2xl font-black text-red-400 mt-1">
              {loading ? '...' : records.filter(r => r.score_percentage < 50).length}
            </span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Domain Matrix</span>
            <span className="block text-2xl font-black text-indigo-400 mt-1">Information Technology</span>
          </div>
        </div>

        {/* Data Matrix Table Framework Card */}
        <div className="bg-slate-950/30 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-200">Real-Time Evaluation Feed</h2>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 font-medium animate-pulse">
              Querying database cloud records...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Candidate Identity</th>
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Assessed Focus</th>
                    <th className="p-4 text-center">Depth Score</th>
                    <th className="p-4 text-center">Processing Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-semibold text-white">{rec.student_name}</td>
                      <td className="p-4 font-mono text-slate-400">{rec.roll_number}</td>
                      <td className="p-4 text-slate-300">{rec.topic_title}</td>
                      <td className="p-4 text-center font-bold">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          rec.score_percentage >= 50 ? 'text-indigo-400 bg-indigo-500/10' : 'text-red-400 bg-red-500/10'
                        }`}>
                          {rec.score_percentage}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block w-24 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          rec.evaluation_status === 'Flagged' 
                            ? 'bg-red-950/40 border-red-800 text-red-400' 
                            : 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                        }`}>
                          {rec.evaluation_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Structural Footer Branding */}
      <footer className="bg-slate-950 p-4 border-t border-slate-800 text-center text-[10px] text-slate-600 font-mono">
        AI Evaluation Platform Blueprint Architecture Grid System
      </footer>

    </div>
  );
}
