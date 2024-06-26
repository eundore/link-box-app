"use client";
import Header from "@/app/components/Header";
import { TEXT_COLORS } from "@/app/constants";
import useCategoryStore from "@/app/store/useCategoryStore";
import { Category } from "@/app/types/domain";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/authProvider";
import { db } from "@/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

const Categories = () => {
  // const auth = getAuth();
  const { user } = useAuth();
  const { setCategory } = useCategoryStore();
  const queryClient = useQueryClient();

  // const categories = queryClient.getQueryData<Array<Category>>([
  //   "category,
  //   auth.currentUser?.uid,
  // ]);

  const { data: categories } = useQuery({
    queryKey: ["category", user?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "category"),
        where("uid", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const posts: Array<Category> = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return posts;
    },
    enabled: !!user?.uid,
  });

  return (
    <>
      <Header
        title="Categories"
        button={
          <Link href={"/categories/category"}>
            <FaPlus
              className="text-white cursor-pointer px-4 py-2 w-12 h-12"
              onClick={() =>
                setCategory({ color: "category1", privacy: "private" })
              }
            />
          </Link>
        }
      />
      <div className="my-4 mx-6 flex flex-col gap-4">
        {categories?.map((category, index) => (
          <Link
            key={`category-${index}`}
            href={"/categories/category"}
            onClick={() => setCategory(category)}
          >
            <Badge
              className={clsx(
                "bg-neutral-800 cursor-pointer hover:bg-neutral-700 py-2 px-3 min-w-14 justify-center",
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
