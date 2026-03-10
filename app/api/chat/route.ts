import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Optimized for Vercel Edge Runtime
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
      return new Response('Missing API Key', { status: 500 });
    }

    console.log(`Processing ${messages.length} messages...`);

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
