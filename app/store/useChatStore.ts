import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { ChatStore } from "../types/useChatStore";

export default create(
  devtools(
    persist<ChatStore>(
      (set) => ({
        chatRoom: {},
        setChatRoom(chatRoom) {
          set((state) => ({ ...state, chatRoom }));
        },
      }),
      {
        name: "ChatStore",
      }
    )
  )
);
