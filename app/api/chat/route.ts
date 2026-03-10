import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Using Node.js runtime for broad compatibility during debugging
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("Chat Request Received");
  
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing!");
      return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
    }

    // Standard provider initialization
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    console.log("Calling streamText with gemini-1.5-flash...");

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. Focus on Routing, Binding, and Validation.",
    });

    console.log("streamText initiated successfully");

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("FATAL ERROR in /api/chat:", error);
    
    // Return a clean error message that useChat can parse or display
    return new Response(JSON.stringify({ 
      error: "AI_ERROR", 
      message: error.message || "Unknown error occurred" 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
