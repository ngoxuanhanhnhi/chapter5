export const runtime = 'edge';

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  return new Response(JSON.stringify({
    status: 'ok',
    apiKeyPresent: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 7) + '...' : 'none',
    envKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('AI')),
    region: process.env.VERCEL_REGION || 'local'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
