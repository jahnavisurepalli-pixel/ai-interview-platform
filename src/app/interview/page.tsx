'use client';

import { useEffect, useState } from 'react';

interface Question {
  question_text: string;
  question_type: string;
  difficulty: string;
  suggested_time: number;
}

interface EvaluationBreakdown {
  dimension: string;
  score: number;
  feedback: string;
}

interface EvaluationData {
  overall_readiness: number;
  breakdown: EvaluationBreakdown[];
}

export default function InterviewSessionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);

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
          setTimeLeft(data.questions.suggested_time);
        }
      } catch (err) {
        console.error("Failed loading questions", err);
      } finally {
        setLoading(false);
      }
    }
    loadInterview();
  }, []);

  useEffect(() => {
    if (loading || evaluating || evaluationData || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, loading, questions, evaluationData, currentAnswer, evaluating]);

  const handleNextQuestion = async () => {
    // If the student types nothing, explicitly record it as a skipped question entry
    const finalAnswerText = currentAnswer.trim() === "" ? "SKIPPED" : currentAnswer;
    const updatedAnswers = [...answers, finalAnswerText];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(questions[currentIndex + 1].suggested_time);
    } else {
      setEvaluating(true);
      try {
        const response = await fetch('/api/evaluate-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: updatedAnswers })
        });
        const data = await response.json();
        if (data.success) {
          setEvaluationData(data.evaluation);
        }
      } catch (err) {
        console.error("Evaluation failed", err);
      } finally {
        setEvaluating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">AI Engine is assembling your personalized syllabus matrix questions...</p>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-xl font-bold text-gray-700 animate-pulse">AI Engine is processing transcripts...</p>
          <p className="text-sm text-gray-500">Evaluating Technical Accuracy, Reasoning, and Communication models...</p>
        </div>
      </div>
    );
  }

  if (evaluationData) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 sm:p-10 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-emerald-600">📊 Performance Report Computed!</h2>
            <div className="mx-auto w-32 h-32 rounded-full bg-indigo-50 border-4 border-indigo-500 flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-black text-indigo-700">{evaluationData.overall_readiness}%</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">Readiness</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {evaluationData.breakdown.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-gray-800">{item.dimension}</h3>
                  <span className="text-sm font-black bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">{item.score}/100</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.feedback}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button onClick={() => window.location.href = '/dashboard'} className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500 shadow-md">
              Return to Dashboard Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isInputEmpty = currentAnswer.trim() === "";

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <span className="text-sm font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-lg font-bold font-mono px-4 py-1 rounded-md border bg-gray-50 text-gray-700">
            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-4">
          <div className="flex gap-2 text-xs font-semibold tracking-wider uppercase">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{currentQuestion?.question_type}</span>
            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">{currentQuestion?.difficulty}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 leading-snug">{currentQuestion?.question_text}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <label className="block text-sm font-medium text-gray-700">Type your technical explanation below:</label>
          <textarea
            rows={6}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Structure your thoughts logically. Leave blank and click skip if you want to skip this topic round..."
            className="w-full rounded-lg border border-gray-300 p-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className={`rounded-lg px-6 py-2.5 font-semibold text-white shadow transition-colors ${
                isInputEmpty 
                  ? 'bg-amber-500 hover:bg-amber-600' // Visual treatment indicating a skip action
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isInputEmpty 
                ? (currentIndex + 1 === questions.length ? 'Skip & Submit' : 'Skip Question ➔')
                : (currentIndex + 1 === questions.length ? 'Submit for AI Evaluation' : 'Next Question ➔')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
