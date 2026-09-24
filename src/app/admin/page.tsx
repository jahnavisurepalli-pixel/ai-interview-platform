'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Department {
  id: string;
  name: string;
  code: string;
  facultyCount: number;
  activeStudents: number;
}

export default function AdminDashboardPage() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Computer Science & Engineering', code: 'CSE', facultyCount: 14, activeStudents: 420 },
    { id: '2', name: 'Electronics & Communication', code: 'ECE', facultyCount: 9, activeStudents: 280 },
    { id: '3', name: 'Information Technology', code: 'IT', facultyCount: 8, activeStudents: 190 }
  ]);

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [message, setMessage] = useState('');

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) {
      setMessage('⚠️ Please fill out all fields before adding a branch.');
      return;
    }

    const brandNewBranch: Department = {
      id: Date.now().toString(),
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      facultyCount: 0,
      activeStudents: 0
    };

    setDepartments([...departments, brandNewBranch]);
    setNewDeptName('');
    setNewDeptCode('');
    setMessage('🎉 New engineering branch integrated into the AI framework!');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Navigation Breadcrumb Row */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Root System</span>
            <span>/</span>
            <span className="text-indigo-600">Global Admin Panel</span>
          </div>
          <div className="flex gap-4">
            <Link href="/faculty" className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Faculty Hub
            </Link>
            <Link href="/student" className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Student Hub
            </Link>
          </div>
        </div>

        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">University Console Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Configure systemic variables, manage institutional deployment parameters, and allocate departmental resources.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Create Branch Configurator Card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 lg:col-span-1">
            <div>
              <h2 className="text-md font-bold text-slate-800">Add Academic Department</h2>
              <p className="text-xs text-slate-400 mt-0.5">Spin up a brand new institutional branch.</p>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Department Name</label>
                <input 
                  type="text" 
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Mechanical Engineering"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Branch Code</label>
                <input 
                  type="text" 
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  placeholder="e.g. MECH"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg text-xs tracking-wide transition-colors shadow-sm"
              >
                Provision Department
              </button>
            </form>
            {message && <p className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">{message}</p>}
          </div>

          {/* Institutional Department Roster */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden lg:col-span-2">
            <div className="p-6 border-b bg-slate-50/50">
              <h2 className="text-md font-bold text-slate-800">Active Campus Deployments</h2>
              <p className="text-xs text-slate-400 mt-0.5">Current structural layout of active department nodes utilizing the AI platform.</p>
            </div>

            <div className="divide-y text-sm">
              {departments.map((dept) => (
                <div key={dept.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{dept.name}</span>
                      <span className="bg-slate-100 border text-slate-500 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {dept.facultyCount} Registered Instructors • {dept.activeStudents} Active Trainees
                    </p>
                  </div>
                  <span className="inline-block rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 uppercase tracking-wider">
                    Operational
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
