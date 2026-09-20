'use client';

import { useEffect, useState } from 'react';

interface Question {
  question_text: string;
  question_type: string;
  difficulty: string;
  suggested_time: number;
}

export default function InterviewSessionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(true);
  const [interviewComplete, setInterviewComplete] = useState(false);

  // 1. Fetch questions from our Mock AI API Endpoint
  useEffect(() => {
    async function loadInterview() {
      try {
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topics: ['Arrays', 'Linked Lists', 'Stacks'] })
        });
        const data = await response.json();
        if (data.success && data.questions) {
          setQuestions(data.questions);
          setTimeLeft(data.questions[0].suggested_time);
        }
      } catch (err) {
        console.error("Failed loading questions", err);
      } finally {
        setLoading(false);
      }
    }
    loadInterview();
  }, []);

  // 2. Countdown Timer Mechanism
  useEffect(() => {
    if (loading || interviewComplete || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion(); // Force submit when timer hits 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, loading, questions, interviewComplete, currentAnswer]);

  const handleNextQuestion = () => {
    const updatedAnswers = [...answers, currentAnswer || "No answer provided within time limit."];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(questions[currentIndex + 1].suggested_time);
    } else {
      setInterviewComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-lg font-medium text-gray-600">AI Engine is assembling your personalized syllabus matrix questions...</p>
        </div>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md border text-center space-y-6">
          <h2 className="text-3xl font-bold text-emerald-600">🎉 Viva Session Completed!</h2>
          <p className="text-gray-600">Your transcripts have been captured successfully. The evaluation layer will compute your communication score and topic mastery analytics.</p>
          <div className="border-t pt-4 text-left space-y-4">
            <h3 className="font-semibold text-gray-800">Your Transcripts Stored:</h3>
            {questions.map((q, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded border text-sm">
                <p className="font-medium text-gray-700">Q: {q.question_text}</p>
                <p className="mt-1 text-indigo-700 italic">Your Answer: "{answers[idx]}"</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Meta Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <span className="text-sm font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className={`text-lg font-bold font-mono px-4 py-1 rounded-md border ${timeLeft < 30 ? 'bg-red-50 text-red-600 animate-pulse border-red-200' : 'bg-gray-50 text-gray-700'}`}>
            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Question Panel */}
        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-4">
          <div className="flex gap-2 text-xs font-semibold tracking-wider uppercase">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{currentQuestion?.question_type}</span>
            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">{currentQuestion?.difficulty}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-snug">
            {currentQuestion?.question_text}
          </h2>
        </div>

        {/* Answer Capture Textarea */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <label className="block text-sm font-medium text-gray-700">Type your technical explanation below:</label>
          <textarea
            rows={6}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Structure your thoughts logically. Explain the concepts using your own words..."
            className="w-full rounded-lg border border-gray-300 p-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
            >
              {currentIndex + 1 === questions.length ? 'Submit Interview' : 'Next Question ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
