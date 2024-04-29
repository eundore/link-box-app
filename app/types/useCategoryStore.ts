import { Category } from "./domain";

export interface CategoryStore {
  category: Category;
  setCategory: (category: Category) => void;
  setCategoryColor: (color: string) => void;
  currentCategoryId: string;
  setCurrentCategoryId: (currentCategoryId: string) => void;
}
