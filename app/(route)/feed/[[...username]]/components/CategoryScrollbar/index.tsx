import useCategoryStore from "@/app/store/useCategoryStore";
import { Badge } from "@/components/ui/badge";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Category {
  id: string;
  color?: string;
  title?: string;
  uid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategoryScrollbar = () => {
  const auth = getAuth();
  const { currentCategoryId, setCurrentCategoryId } = useCategoryStore();

  const { data: categories } = useQuery({
    queryKey: ["useCategoryQuery", auth.currentUser?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "category"),
        where("uid", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const posts: Array<Category> = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentCategoryId(posts[0].id);

      return posts;
    },
    enabled: !!auth.currentUser?.uid,
  });

  return (
    <div
      className="flex gap-2 overflow-auto px-4"
      style={{ scrollbarWidth: "none" }}
    >
      {categories?.map(({ id, title, color }, index) => (
        <Badge
          key={`category-${index}`}
          className={clsx(
            "bg-neutral-800 cursor-pointer hover:bg-neutral-700 py-2 px-3",
            `text-${color}`,
            {
              "border border-neutral-400": currentCategoryId === id,
            }
          )}
          onClick={() => setCurrentCategoryId(id)}
        >
          {title}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryScrollbar;
