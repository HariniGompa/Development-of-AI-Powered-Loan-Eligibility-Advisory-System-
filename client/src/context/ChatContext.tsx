import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { Chat, ChatMessage } from "../types/user";

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const addChat = (chat: Chat) => {
    setChats((prev) => [chat, ...prev]);
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const addMessage = (chatId: string, message: ChatMessage) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              updatedAt: new Date(),
            }
          : chat
      )
    );
    if (currentChat?.id === chatId) {
      setCurrentChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, message],
              updatedAt: new Date(),
            }
          : null
      );
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        addChat,
        deleteChat,
        setCurrentChat,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
