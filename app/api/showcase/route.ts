import { NextResponse } from 'next/server';
import { Leap } from '@leap-ai/sdk';

export async function GET(request: Request) {
  const apiKey = process.env.LEAP_API_KEY as string;
  const leap = new Leap(apiKey);

  const { data, error } = await leap.generate.listInferenceJobs({
    modelId: '1e7737d7-545e-469f-857f-e4b46eaa151d', // Model for OpenJourney v4
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
