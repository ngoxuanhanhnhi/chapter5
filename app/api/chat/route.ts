import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Recommended for streaming on Vercel
export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing Groq API Key. Please add GROQ_API_KEY to your .env file." }), { status: 500 });
    }

    // Use Llama 3.3 70b on Groq for high speed and intelligence
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
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
