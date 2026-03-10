import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Initialize the Google provider with the API key explicitly
const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Log presence of API key (sanitized)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("Environment check - API Key present:", !!apiKey);
    if (apiKey) {
        console.log("API Key prefix check:", apiKey.substring(0, 7) + "...");
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = streamText({
      model: googleProvider('gemini-1.5-flash'),
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
