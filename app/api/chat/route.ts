import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Using Node.js runtime for this diagnostic to ensure broad compatibility
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(`0:${JSON.stringify("⚠️ Server Configuration Error: GOOGLE_GENERATIVE_AI_API_KEY is missing.")}\n`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    try {
      // Use generateText (non-streaming) but return in stream protocol format
      // so useChat can display it.
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        messages,
        system: "You are a helpful assistant.",
      });

      // Format as a text chunk in the Vercel AI Data Stream Protocol (0: "text")
      return new Response(`0:${JSON.stringify(text)}\n`, {
        headers: { 'X-Vercel-AI-Data-Stream': 'v1', 'Content-Type': 'text/plain; charset=utf-8' }
      });

    } catch (apiError: any) {
      console.error("Gemini API Error:", apiError);
      const errorMsg = `⚠️ Gemini API Error: ${apiError.message}`;
      return new Response(`0:${JSON.stringify(errorMsg)}\n`, {
        headers: { 'X-Vercel-AI-Data-Stream': 'v1', 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  } catch (error: any) {
    console.error("Critical Router Error:", error);
    return new Response(`0:${JSON.stringify("⚠️ Critical Route Error: " + error.message)}\n`, {
      headers: { 'X-Vercel-AI-Data-Stream': 'v1', 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
