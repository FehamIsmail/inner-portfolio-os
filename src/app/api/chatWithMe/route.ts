import { type CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { BOT_CONTEXT } from "@/app/api/chatWithMe/BotContext";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: openai("gpt-3.5-turbo-0125"),
    maxTokens: 256,
    system: BOT_CONTEXT,
    messages,
  });

  return result.toAIStreamResponse();
}
