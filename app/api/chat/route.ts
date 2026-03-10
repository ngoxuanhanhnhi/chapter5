import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Using Edge Runtime for optimal performance
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: "API Key missing." }), { status: 500 });
    }

    // Switched to gemini-2.0-flash as it has better compatibility with the latest AI SDK and API versions
    const result = streamText({
      model: google('gemini-2.0-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error.message || error);
    
    // Return a structured error for the frontend
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
