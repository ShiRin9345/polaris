import { generateText } from "ai";
import { google } from "@ai-sdk/google";
export async function POST() {
  const response = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "What is the answer of 1 + 1",
  });
  return Response.json({
    text: response.text,
  });
}
