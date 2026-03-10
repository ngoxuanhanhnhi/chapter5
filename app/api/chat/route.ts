import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Use Edge Runtime for better streaming support and lower latency
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log("Edge Runtime (Internal) - API Key present:", !!apiKey);
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize provider INSIDE the POST function to ensure env vars are fresh
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    console.log("Starting streamText with Gemini 1.5 Flash...");

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    console.log("streamText call initiated successfully.");

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Critical Chat API Error:", error.message || error);
    
    return new Response(JSON.stringify({ 
        error: "An error occurred during AI processing.",
        details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
