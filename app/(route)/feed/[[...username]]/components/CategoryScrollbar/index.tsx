import useCategoryStore from "@/app/store/useCategoryStore";
import useUserStore from "@/app/store/useUserStore";
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
  const { user } = useUserStore();
  const { uid: feedUid } = user;
  const { currentCategoryId, setCurrentCategoryId } = useCategoryStore();

  const { data: categories } = useQuery({
    queryKey: ["useCategoryQuery", feedUid],
    queryFn: async () => {
      const q = query(collection(db, "category"), where("uid", "==", feedUid));
      const querySnapshot = await getDocs(q);
      const posts: Array<Category> = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentCategoryId(posts[0].id);

      return posts;
    },
    enabled: !!feedUid,
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
