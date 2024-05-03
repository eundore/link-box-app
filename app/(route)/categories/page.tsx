"use client";
import { Category } from "@/app/types/domain";
import Header from "@/app/components/Header";
import useCategoryStore from "@/app/store/useCategoryStore";
import { Badge } from "@/components/ui/badge";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { TEXT_COLORS } from "@/app/constants";

const Categories = () => {
  const auth = getAuth();
  const { setCategory } = useCategoryStore();

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

      return posts;
    },
    enabled: !!auth.currentUser?.uid,
  });

  return (
    <>
      <Header
        title="Categories"
        button={
          <Link href={"/category"}>
            <FaPlus
              className="text-white cursor-pointer px-4 py-2 w-12 h-12"
              onClick={() => setCategory({ color: "category1" })}
            />
          </Link>
        }
      />
      <div className="my-4 mx-6 flex flex-col gap-4">
        {categories?.map((category, index) => (
          <Link
            key={`category-${index}`}
            href={"/category"}
            onClick={() => setCategory(category)}
          >
            <Badge
              className={clsx(
                "bg-neutral-800 cursor-pointer hover:bg-neutral-700 py-2 px-3",
                `${TEXT_COLORS[category.color as keyof typeof TEXT_COLORS]}`
              )}
            >
              {category.title}
            </Badge>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Categories;
