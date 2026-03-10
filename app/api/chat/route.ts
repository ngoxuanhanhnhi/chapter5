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

    console.log("Messages count:", messages?.length);
    console.log("Starting generateText (NON-STREAMING) with Gemini 2.0 Flash...");

    // Switching to generateText for diagnosis to get a clear error or result
    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    console.log("AI Response generated successfully (length):", text.length);

    // Return a simple JSON response instead of a stream
    return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("DIAGNOSTIC ERROR - Chat API Failed:", error);
    if (error.stack) console.error("Error Stack:", error.stack);
    
    let errorDetails = "Unknown error";
    if (error.response) {
        try {
            const body = await error.response.json();
            console.error("Gemini API error body:", JSON.stringify(body));
            errorDetails = JSON.stringify(body);
        } catch (e) {
            errorDetails = error.message;
        }
    } else {
        errorDetails = error.message;
    }
    
    return new Response(JSON.stringify({ 
        error: "Internal Server Error during AI generation.",
        details: errorDetails
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
