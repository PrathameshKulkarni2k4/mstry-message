import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

    // streamText is the modern Vercel AI SDK method
    const result = await streamText({
      model: google('models/gemini-1.5-flash'), // Lightning-fast and heavily featured in the free tier
      prompt: prompt,
    });

    // Automatically handles the streaming response to the frontend
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("An unexpected error occurred", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating messages." },
      { status: 500 }
    );
  }
}