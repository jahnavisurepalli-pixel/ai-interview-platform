import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Simulate reading the incoming payload (completed topics context)
    const body = await request.json().catch(() => ({}));
    const { topics } = body;

    // 2. Introduce an intentional 1.5-second artificial delay 
    // This perfectly mimics the natural network latency of a real AI generation call!
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 3. Synthesize the recommended structural question mix blueprint array
    const simulatedQuestions = [
      {
        question_text: "Explain the main difference between an Array and a Singly Linked List regarding how they occupy space in your computer's RAM memory blocks.",
        question_type: "Concept",
        difficulty: "Foundation",
        suggested_time: 120 // seconds
      },
      {
        question_text: "Imagine you are building a system tracking back-button browser actions. Why would a Stack data structure be a superior architectural choice compared to a standard Queue?",
        question_type: "Application",
        difficulty: "Intermediate",
        suggested_time: 180
      },
      {
        question_text: "You are given a Singly Linked List tracking user tokens. Walk me through the pointer updates required to completely reverse this list without creating any new nodes.",
        question_type: "Technical viva",
        difficulty: "Advanced",
        suggested_time: 240
      }
    ];

    // 4. Return the structured matrix response back to your frontend
    return NextResponse.json({ 
      success: true, 
      provider: "Mock Simulation Engine (Free Tier)",
      questions: simulatedQuestions 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
