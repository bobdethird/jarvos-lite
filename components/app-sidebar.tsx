"use client";

import { MessageSquare, Plus, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useChatContext } from "@/contexts/chat-context";

export function AppSidebar() {
  const { chats, currentChatId, createChat, deleteChat, switchChat } = useChatContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={createChat}
              tooltip="New Chat"
            >
              <Plus className="size-5" />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat history</SidebarGroupLabel>
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  tooltip={chat.title}
                  isActive={currentChatId === chat.id}
                  onClick={() => switchChat(chat.id)}
                >
                  <MessageSquare className="size-4" />
                  <span className="truncate">{chat.title}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  showOnHover
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
