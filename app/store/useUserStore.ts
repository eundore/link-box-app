import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { UserStore } from "../types/useUserStore";

export default create(
  devtools(
    persist<UserStore>(
      (set) => ({
        user: {},
        setUser(user) {
          set((state) => ({ ...state, user }));
        },
      }),
      {
        name: "UserStore",
      }
    )
  )
);
