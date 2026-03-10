import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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

    console.log("Messages count:", messages?.length);
    console.log("Starting streamText with Gemini 2.0 Flash...");

    const result = streamText({
      model: google('gemini-2.0-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Detailed Chat API Error:", error);
    if (error.stack) console.error("Error Stack:", error.stack);
    
    // Attempt to extract more info from the error if possible
    const errorDetails = error.cause || error.message || "Unknown error";
    
    return new Response(JSON.stringify({ 
        error: "Internal Server Error during AI streaming.",
        details: errorDetails
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
