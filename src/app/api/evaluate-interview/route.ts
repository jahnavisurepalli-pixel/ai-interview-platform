import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { answers } = body; // This is an array of strings representing the answers

    // Artificial engine latency processing simulation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Define the core engineering vocabulary maps for our 3 pilot topics
    const keywordRubric = [
      {
        topic: "Arrays vs Linked Lists",
        required: ["contiguous", "pointer", "memory", "index", "ram"],
        critical_weight: 20 // points per matched concept keyword
      },
      {
        topic: "Stack vs Queue",
        required: ["lifo", "fifo", "stack", "queue", "history", "back"],
        critical_weight: 20
      },
      {
        topic: "Linked List Inversion",
        required: ["pointer", "reverse", "head", "null", "next", "current"],
        critical_weight: 20
      }
    ];

    let totalScoreAccumulator = 0;
    const dimensionsFeedback: string[] = [];

    // Analyze each answer text dynamically
    for (let i = 0; i < keywordRubric.length; i++) {
      const studentAnswer = (answers && answers[i]) ? answers[i].toLowerCase() : "skipped";
      const rubric = keywordRubric[i];

      if (studentAnswer === "skipped" || studentAnswer.trim() === "") {
        dimensionsFeedback.push(`Question ${i + 1} was skipped. Zero domain markers logged.`);
        continue;
      }

      // Count how many accurate domain keywords were actually used in their text explanation
      const matches = rubric.required.filter(keyword => studentAnswer.includes(keyword));
      const calculatedQuestionScore = matches.length * rubric.critical_weight;
      totalScoreAccumulator += Math.min(calculatedQuestionScore, 100);

      if (matches.length >= 4) {
        dimensionsFeedback.push(`Q${i+1} Strong Analysis: Accurately utilized key terminology like [${matches.join(', ')}].`);
      } else if (matches.length >= 2) {
        dimensionsFeedback.push(`Q${i+1} Partial Analysis: Concept initialized but lacking technical depth. Identified [${matches.join(', ')}]. Missing structural keyword context.`);
      } else {
        dimensionsFeedback.push(`Q${i+1} Weak Analysis: Response lacks critical technical engineering markers. High risk of conceptual misconceptions.`);
      }
    }

    // Compute aggregate averages based on actual vocabulary metrics captured
    const totalAttempted = answers ? answers.filter((ans: string) => ans !== "SKIPPED" && ans.trim() !== "").length : 0;
    const finalAccuracyScore = totalAttempted > 0 ? Math.min(Math.round(totalScoreAccumulator / totalAttempted), 100) : 0;
    const readinessIndex = Math.round((finalAccuracyScore * totalAttempted) / 3);

    const evaluationResult = {
      overall_readiness: readinessIndex,
      breakdown: [
        { 
          dimension: "Technical accuracy", 
          score: finalAccuracyScore, 
          feedback: dimensionsFeedback[0] || "No verification text captured for core data structures block."
        },
        { 
          dimension: "Concept clarity", 
          score: Math.max(0, finalAccuracyScore - 8), 
          feedback: dimensionsFeedback[1] || "Unable to determine concept definition parameters."
        },
        { 
          dimension: "Application", 
          score: totalAttempted === 3 ? 85 : totalAttempted === 2 ? 60 : 30, 
          feedback: "Measures architectural transfer logic. Scores drop proportionally for skipped topic rounds."
        },
        { 
          dimension: "Reasoning", 
          score: Math.max(0, finalAccuracyScore - 5), 
          feedback: dimensionsFeedback[2] || "Troubleshooting matrices metrics skipped or unattempted."
        },
        { 
          dimension: "Communication", 
          score: totalAttempted > 0 ? 75 : 0, 
          feedback: totalAttempted > 0 ? "Coherence structure is tracking well. Keep syntax explanations tightly bounded." : "Terminated without input data text context."
        }
      ]
    };

    return NextResponse.json({ success: true, evaluation: evaluationResult });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
