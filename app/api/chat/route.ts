import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Using Edge Runtime for optimal performance
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing." }), { status: 500 });
    }

    // Explicitly using API v1 instead of v1beta to ensure gemini-1.5-flash is found
    // This addresses the "model not found for v1beta" error we saw earlier.
    const google = createGoogleGenerativeAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1', 
    });

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error.message || error);
    
    return new Response(JSON.stringify({ 
        error: "An error occurred during AI processing.",
        details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
