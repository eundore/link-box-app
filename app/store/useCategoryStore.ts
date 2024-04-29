import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { CategoryStore } from "../types/useCategoryStore";

export default create(
  devtools(
    persist<CategoryStore>(
      (set) => ({
        category: {},
        setCategory(category) {
          set((state) => ({ ...state, category }));
        },
        setCategoryColor(color) {
          set((state) => ({
            ...state,
            category: { ...state.category, color },
          }));
        },
        currentCategoryId: "",
        setCurrentCategoryId(currentCategoryId) {
          set((state) => ({
            ...state,
            currentCategoryId,
          }));
        },
      }),
      {
        name: "CategoryStore",
      }
    )
  )
);
