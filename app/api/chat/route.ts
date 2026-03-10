import { google } from '@ai-sdk/google';
import { streamText, createDataStreamResponse } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
        return new Response('No messages provided', { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    // We use createDataStreamResponse to ensure we can send a custom message even if things fail
    return createDataStreamResponse({
      execute: async (dataStream) => {
        try {
          if (!apiKey) {
            dataStream.writeText("⚠️ Error: GOOGLE_GENERATIVE_AI_API_KEY is not set on Vercel.");
            return;
          }

          const result = streamText({
            model: google('gemini-1.5-flash'),
            messages,
            system: "You are a helpful assistant for ASP.NET Core learning.",
          });

          result.mergeIntoDataStream(dataStream);
        } catch (err: any) {
          console.error("Internal stream error:", err);
          dataStream.writeText(`⚠️ GEMINI ERROR: ${err.message}`);
        }
      },
      onError: (error) => {
        console.error("DataStream Error:", error);
        return "An error occurred during streaming.";
      }
    });
  } catch (error: any) {
    console.error("Critical Post Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}
