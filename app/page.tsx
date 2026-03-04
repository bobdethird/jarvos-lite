"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp } from "lucide-react";
import { useChatContext } from "@/contexts/chat-context";

function ChatView({ chatId }: { chatId: string }) {
  const [input, setInput] = useState("");
  const { getMessagesForChat, saveMessagesForChat } = useChatContext();
  const initialMessages = getMessagesForChat(chatId);

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    saveMessagesForChat(chatId, messages);
  }, [chatId, messages, saveMessagesForChat]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Send a message to get started.</p>
            </div>
          )}
          <div className="mx-auto max-w-2xl space-y-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg px-4 py-3 ${
                  m.role === "user"
                    ? "ml-8 bg-primary text-primary-foreground"
                    : "mr-8 bg-muted"
                }`}
              >
                <div className="text-xs font-medium opacity-80">
                  {m.role === "user" ? "You" : "Assistant"}
                </div>
                <div className="mt-1 whitespace-pre-wrap">
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return <span key={`${m.id}-${i}`}>{part.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t p-4"
        >
          <div className="mx-auto max-w-2xl">
            <InputGroup className="min-h-[44px] max-h-[200px] h-auto border border-black shadow-none ring-0 dark:border-white [&:has([data-slot=input-group-control]:focus-visible)]:ring-0 [&:has([data-slot=input-group-control]:focus-visible)]:border-black dark:[&:has([data-slot=input-group-control]:focus-visible)]:border-white">
              <InputGroupTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={status === "streaming"}
                className="min-h-[44px] max-h-[200px] resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <InputGroupAddon align="block-end">
                <InputGroupButton
                  type="submit"
                  size="icon-sm"
                  className="ml-auto size-9 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                  disabled={status === "streaming" || !input.trim()}
                >
                  <ArrowUp className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </form>
    </div>
  );
}

export default function Home() {
  const { currentChatId } = useChatContext();

  if (!currentChatId) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  return <ChatView key={currentChatId} chatId={currentChatId} />;
}
