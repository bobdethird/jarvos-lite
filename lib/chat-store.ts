"use client";

import type { UIMessage } from "ai";

const STORAGE_KEY = "jarvos-chats";

export type Chat = {
  id: string;
  title: string;
  createdAt: number;
};

export type ChatStore = {
  chats: Chat[];
  messages: Record<string, UIMessage[]>;
};

function loadStore(): ChatStore {
  if (typeof window === "undefined") {
    return { chats: [], messages: {} };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ChatStore;
    }
  } catch {
    // ignore
  }
  return { chats: [], messages: {} };
}

function saveStore(store: ChatStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function getChats(): Chat[] {
  return loadStore().chats;
}

export function getMessages(chatId: string): UIMessage[] {
  return loadStore().messages[chatId] ?? [];
}

export function saveMessages(chatId: string, messages: UIMessage[]) {
  const store = loadStore();
  store.messages[chatId] = messages;

  // Ensure chat exists in the chats array (in case it was created but not persisted)
  let chat = store.chats.find((c) => c.id === chatId);
  if (!chat) {
    chat = {
      id: chatId,
      title: "New Chat",
      createdAt: Date.now(),
    };
    store.chats.unshift(chat);
  }

  // Update chat title from first user message if not set
  if (chat.title === "New Chat" && messages.length > 0) {
    const firstUserMsg = messages.find((m) => m.role === "user");
    if (firstUserMsg) {
      const textPart = firstUserMsg.parts.find((p) => p.type === "text");
      const text = textPart && "text" in textPart ? textPart.text : "";
      chat.title = text.slice(0, 50) || "New Chat";
    }
  }

  saveStore(store);
}

export function createChat(): Chat {
  const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const chat: Chat = {
    id,
    title: "New Chat",
    createdAt: Date.now(),
  };

  const store = loadStore();
  store.chats.unshift(chat);
  saveStore(store);

  return chat;
}

export function deleteChat(chatId: string) {
  const store = loadStore();
  store.chats = store.chats.filter((c) => c.id !== chatId);
  delete store.messages[chatId];
  saveStore(store);
}
