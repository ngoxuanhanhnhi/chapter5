import { google } from '@ai-sdk/google';
import { streamText, generateText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("Environment check - GOOGLE_GENERATIVE_AI_API_KEY present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.log("API Key prefix:", process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 7) + "...");
    } else {
        console.error("CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY IS MISSING!");
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: "API Key missing on Vercel. Please add GOOGLE_GENERATIVE_AI_API_KEY in Settings > Environment Variables." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error.message || error);
    
    const errorMessage = error.message?.includes("quota") 
        ? "API Quota Exceeded. Please try again in a few moments." 
        : "An error occurred during AI processing.";

    return new Response(JSON.stringify({ 
        error: errorMessage,
        details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
