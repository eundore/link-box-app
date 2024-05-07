import { Category } from "./domain";

export interface CategoryStore {
  category: Category;
  setCategory: (category: Category) => void;
  setCategoryColor: (color: string) => void;
  setCategoryPrivacy: (privacy: string) => void;
  currentCategoryId: string;
  setCurrentCategoryId: (currentCategoryId: string) => void;
}
