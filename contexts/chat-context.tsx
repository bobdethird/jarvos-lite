"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { UIMessage } from "ai";
import type { Chat } from "@/lib/chat-store";
import {
  createChat as createChatInStore,
  deleteChat as deleteChatInStore,
  getChats,
  getMessages,
  saveMessages as saveMessagesInStore,
} from "@/lib/chat-store";

type ChatContextValue = {
  chats: Chat[];
  currentChatId: string | null;
  createChat: () => string;
  deleteChat: (id: string) => void;
  switchChat: (id: string) => void;
  getMessagesForChat: (id: string) => UIMessage[];
  saveMessagesForChat: (id: string, messages: UIMessage[]) => void;
  refreshChats: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const refreshChats = useCallback(() => {
    setChats(getChats());
  }, []);

  useEffect(() => {
    const stored = getChats();
    setChats(stored);
    if (stored.length > 0 && !currentChatId) {
      setCurrentChatId(stored[0].id);
    } else if (stored.length === 0) {
      const newChat = createChatInStore();
      setChats(getChats());
      setCurrentChatId(newChat.id);
    }
  }, []);

  const createChat = useCallback(() => {
    const newChat = createChatInStore();
    setChats(getChats());
    setCurrentChatId(newChat.id);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((id: string) => {
    deleteChatInStore(id);
    const remaining = getChats();
    setChats(remaining);
    if (currentChatId === id) {
      if (remaining.length > 0) {
        setCurrentChatId(remaining[0].id);
      } else {
        const newChat = createChatInStore();
        setChats(getChats());
        setCurrentChatId(newChat.id);
      }
    }
  }, [currentChatId]);

  const switchChat = useCallback((id: string) => {
    setCurrentChatId(id);
  }, []);

  const getMessagesForChat = useCallback((id: string) => {
    return getMessages(id);
  }, []);

  const saveMessagesForChat = useCallback((id: string, messages: UIMessage[]) => {
    saveMessagesInStore(id, messages);
    refreshChats();
  }, [refreshChats]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        createChat,
        deleteChat,
        switchChat,
        getMessagesForChat,
        saveMessagesForChat,
        refreshChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return ctx;
}
