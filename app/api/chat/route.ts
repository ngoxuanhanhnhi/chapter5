import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not defined in environment variables");
      return new Response("API Key not configured", { status: 500 });
    }

    const result = streamText({
      model: google('gemini-1.5-pro'),
      messages,
      system: "You are a helpful assistant for ASP.NET Core learning. You specialize in Routing, Model Binding, and Validation.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("An error occurred during chat processing", { status: 500 });
  }
}
