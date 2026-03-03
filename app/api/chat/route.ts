import { streamText, convertToModelMessages, gateway, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model?: string } =
    await req.json();

  const result = streamText({
    model: gateway(model ?? "anthropic/claude-haiku-4.5"),
    system: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
