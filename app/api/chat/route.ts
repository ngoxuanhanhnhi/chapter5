import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Recommended for streaming on Vercel
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
    }

    // Use gemini-1.5-flash with default settings for maximum stability
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. Focus on Routing, Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Critical API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
