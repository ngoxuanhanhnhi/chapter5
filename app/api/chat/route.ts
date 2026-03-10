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

    console.log("Starting generateText (DIAGNOSTIC) with Gemini 1.5 Flash...");

    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            messages,
            system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
        });

        console.log("AI Response generated successfully");
        return new Response(JSON.stringify({ text }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (genError: any) {
        console.error("DIAGNOSTIC ERROR:", genError);
        // Returns the error message as a normal chat response so the user can see it
        return new Response(JSON.stringify({ 
            text: `⚠️ DIAGNOSTIC ERROR: ${genError.message}\n\nPlease check Vercel Logs for full details.` 
        }), {
            status: 200, // Returning 200 so useChat displays the error as a message
            headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error: any) {
    console.error("Critical Route Error:", error);
    return new Response(JSON.stringify({ 
        error: "Internal Server Error",
        details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
