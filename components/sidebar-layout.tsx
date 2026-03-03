"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatProvider, useChatContext } from "@/contexts/chat-context";

function HeaderTitle() {
  const { chats, currentChatId } = useChatContext();
  const currentChat = chats.find((c) => c.id === currentChatId);
  return (
    <span className="text-lg font-semibold truncate">
      {currentChat?.title ?? "Chat"}
    </span>
  );
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <HeaderTitle />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
    </ChatProvider>
  );
}
