// app/api/generate-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Connect to the public Gradio model
    const client = await Client.connect("black-forest-labs/FLUX.1-schnell");

    // Call the /infer endpoint with your prompt
    const result = await client.predict("/infer", {
      prompt,
      seed: 1056546105,
      randomize_seed: true,
      width: 1024,
      height: 1024,
      num_inference_steps: 4,
    });

    // result.data is an array, with result[0] as the image object
    const data = result.data as [{ url: string }, number];
    const imageUrl = data[0].url;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: imageUrl });
  } catch (err) {
    console.error("❌ Image generation failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
