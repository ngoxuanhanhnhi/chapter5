import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Using Edge for faster execution
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ text: "⚠️ Error: API Key missing on server." }), { status: 200 });
    }

    console.log("Starting generateText with NEW API KEY...");

    try {
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        messages: messages,
        system: "You are a helpful assistant.",
      });

      console.log("Success with new key!");
      return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (apiError: any) {
      console.error("Gemini API Error details:", apiError);
      // Return the raw error message to the chat so we can see it
      return new Response(JSON.stringify({ 
        text: `⚠️ GEMINI ERROR: ${apiError.message}` 
      }), {
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ text: `⚠️ Server Error: ${error.message}` }), { status: 200 });
  }
}
