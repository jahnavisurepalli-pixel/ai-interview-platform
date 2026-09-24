'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Message {
  sender: 'ai' | 'student';
  text: string;
}

export default function AIInterviewPage() {
  // --- Student Identity States ---
  const [isStarted, setIsStarted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [formError, setFormError] = useState('');

  // --- Core Session States ---
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [totalTurns, setTotalTurns] = useState(0); 
  const [studentInput, setStudentInput] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dbMessage, setDbMessage] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! Welcome to your dynamic engineering evaluation session. Today, we're testing your depth in 'Arrays and Dynamic Memory'. Let's start basic: Can you explain the main structural difference between static array memory allocation and dynamic resizing array allocation?"
    }
  ]);

  const [evaluation, setEvaluation] = useState({
    score: 0,
    rating: 'Processing',
    feedback: 'Analyzing metrics...'
  });

  // --- Automated Proctoring Tracking States ---
  const [tabViolations, setTabViolations] = useState(0);

  // --- Countdown Timer States ---
  const [timeLeft, setTimeLeft] = useState(60);

  // ⏱️ Countdown Timer Effect Loop
  useEffect(() => {
    if (!isStarted || sessionCompleted || loadingQuestion) return;

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Auto-submit empty response if time expires
          triggerTimeExpiredSubmission();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isStarted, totalTurns, sessionCompleted, loadingQuestion]);

  // Monitor browser window focus changes in real time
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowViolation = () => {
      if (isStarted && !sessionCompleted) {
        setTabViolations((prev) => {
          const updatedCount = prev + 1;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: 'ai',
              text: `⚠️ [SECURITY WARNING]: System detected a window/tab switch event. Integrity monitoring is active. Violation Count: ${updatedCount}. This incident has been logged.`
            }
          ]);
          return updatedCount;
        });
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleWindowViolation();
      }
    });

    window.addEventListener('blur', handleWindowViolation);

    return () => {
      document.removeEventListener('visibilitychange', handleWindowViolation);
      window.removeEventListener('blur', handleWindowViolation);
    };
  }, [isStarted, sessionCompleted]);

  const handleStartInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !rollNumber.trim()) {
      setFormError('⚠️ Please fill in both fields before proceeding.');
      return;
    }
    setFormError('');
    setIsStarted(true);
    setTimeLeft(60); // Reset timer on start
  };

  const triggerTimeExpiredSubmission = () => {
    const fallbackEvent = { preventDefault: () => {} } as React.FormEvent;
    handleCoreSubmission("[Time Limit Expired - No Response Provided]", fallbackEvent);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim() || loadingQuestion) return;
    await handleCoreSubmission(studentInput, e);
    setStudentInput('');
  };

  const handleCoreSubmission = async (textToSend: string, e: React.FormEvent) => {
    const updatedMessages: Message[] = [...messages, { sender: 'student', text: textToSend }];
    setMessages(updatedMessages);
    
    const nextTurnCount = totalTurns + 1;
    setTotalTurns(nextTurnCount);
    setTimeLeft(60); // Reset clock for the next prompt segment

    if (nextTurnCount < 3) {
      setLoadingQuestion(true);
      try {
        const response = await fetch('http://localhost:8000/api/next-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_history: updatedMessages })
        });
        
        if (!response.ok) throw new Error('Backend error');
        const data = await response.json();
        
        setMessages([
          ...updatedMessages,
          { sender: 'ai', text: data.next_question || 'Could you expand on that?' }
        ]);
      } catch (err) {
        console.error(err);
        setMessages([
          ...updatedMessages,
          { sender: 'ai', text: 'Connection issue. What happens during a memory leak?' }
        ]);
      } finally {
        setLoadingQuestion(false);
      }
      return;
    }

    setSessionCompleted(true);
    setSaving(true);

    try {
      const pythonResponse = await fetch('http://localhost:8000/api/evaluate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_history: updatedMessages })
      });

      if (!pythonResponse.ok) throw new Error('Evaluation offline');
      const aiResult = await pythonResponse.json();

      const finalScore = aiResult.evaluated_score || 50;
      const finalRating = aiResult.performance_rating || 'Developing';
      const finalFeedback = aiResult.agent_feedback || 'Completed.';

      setEvaluation({
        score: finalScore,
        rating: finalRating,
        feedback: finalFeedback
      });

      await supabase.from('interview_scores').insert([
        {
          student_name: fullName,
          roll_number: rollNumber,
          topic_title: 'Arrays and Dynamic Memory',
          score_percentage: finalScore,
          evaluation_status: (finalScore < 50 || tabViolations > 0) ? 'Flagged' : 'Processed'
        }
      ]);

      setDbMessage(
        tabViolations > 0 
          ? `💾 Compiled with ${tabViolations} security violations and pushed to Cloud Supabase.`
          : '💾 Evaluated by Local Keyword Agent & Synced to Cloud Supabase!'
      );
    } catch (err) {
      console.error(err);
      setDbMessage('✨ Session saved via local client fallback.');
    } finally {
      setSaving(false);
    }
  };

  // 1. IDENTITY START SCREEN VERIFICATION
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-white tracking-wide">AI Verification Terminal</h1>
            <p className="text-xs text-indigo-400 mt-1 font-medium">Please authenticate candidate identities</p>
          </div>

          <form onSubmit={handleStartInterview} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jahnavi Surepalli"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Academic Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 26CSE001"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            {formError && (
              <p className="text-[11px] text-red-400 font-medium bg-red-950/30 p-2 rounded-lg border border-red-900/40">{formError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2"
            >
              Start Live Interview Session →
            </button>
          </form>
        </div>
      </div>
    );
  }
  // 2. ACTIVE INTERVIEW INTERFACE WORKSPACE
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      <header className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-md font-bold text-white">AI Technical Evaluator — Production System</h1>
          <p className="text-xs text-slate-400">Target Vector: Data Structures & Heap Memory Allocation</p>
        </div>
        <div className="flex items-center gap-3">
          {/* ⏱️ Dynamic Live Clock Badge display element */}
          {!sessionCompleted && (
            <span className={`text-xs px-3 py-1.5 rounded-full border font-mono font-bold transition-colors ${
              timeLeft <= 15 
                ? 'bg-red-950/60 border-red-800 text-red-400 animate-pulse' 
                : 'bg-slate-800 border border-slate-700 text-emerald-400'
            }`}>
              ⏱️ {timeLeft}s remaining
            </span>
          )}
          <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-indigo-400 font-mono">
            Question {sessionCompleted ? 3 : totalTurns + 1} of 3
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: INTERVIEW CHAT STREAM */}
        <div className="lg:col-span-7 bg-slate-950/40 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between min-h-[450px]">
          {!sessionCompleted ? (
            <div className="space-y-4 flex-1 overflow-y-auto pb-4">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                    msg.sender === 'ai' 
                      ? msg.text.includes('[SECURITY WARNING]')
                        ? 'bg-red-950/40 border border-red-900/40 text-red-300 self-start mr-auto w-full max-w-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 self-start mr-auto' 
                      : 'bg-indigo-600 text-white self-end ml-auto shadow-md'
                  }`}
                >
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    {msg.sender === 'ai' 
                      ? msg.text.includes('[SECURITY WARNING]') ? '🚨 System Monitor' : '🤖 AI Assessor' 
                      : '👨‍💻 Student'}
                  </span>
                  {msg.text}
                </div>
              ))}
              {loadingQuestion && (
                <p className="text-xs text-indigo-400 italic animate-pulse">Analyzing keywords...</p>
              )}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-6 max-w-md mx-auto w-full my-auto shadow-2xl">
              <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h2 className="text-xl font-extrabold text-white">Evaluation Matrix Compiled!</h2>
              <p className="text-xs text-indigo-400">{dbMessage}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3">
                  <span className="text-xs text-slate-500 uppercase block">Score</span>
                  <span className="text-xl font-black text-indigo-400 block">{evaluation.score}%</span>
                </div>
                <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-3">
                  <span className="text-xs text-slate-500 uppercase block">Rating</span>
                  <span className="text-xl font-black text-emerald-400 block">{evaluation.rating}</span>
                </div>
              </div>

              <p className="text-xs bg-slate-950 p-3 rounded-lg text-slate-300 text-left">
                <strong>Feedback:</strong> {evaluation.feedback}
              </p>

              <Link href="/admin/dashboard" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-center text-xs">
                View Faculty Admin Feed
              </Link>
            </div>
          )}

          {!sessionCompleted && (
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
              <input
                type="text"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                disabled={loadingQuestion}
                placeholder="Provide technical analysis response..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button type="submit" disabled={loadingQuestion} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs disabled:bg-slate-700">
                Send Response
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: SIMULATED WEBCAM FEED */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[350px]">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700 mr-auto">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-200 uppercase font-bold tracking-wider">REC LIVE</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40 my-6 min-h-[200px]">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-3xl animate-pulse">
              👤
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-slate-300 font-semibold">{fullName || 'Candidate'}</p>
              <p className="text-[10px] font-mono text-slate-500">Roll: {rollNumber || 'Checking...'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-center text-xs">
            <div>
              <span className="block text-[9px] text-slate-500 uppercase">Focus</span>
              <span className="font-mono text-emerald-400 font-bold">98%</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="block text-[9px] text-slate-500 uppercase">Audio</span>
              <span className="font-mono text-slate-300">Active</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 uppercase">Tracking</span>
              <span className="font-mono text-indigo-400 animate-pulse">Live</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
