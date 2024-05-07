"use client";
import Header from "@/app/components/Header";
import useCategoryStore from "@/app/store/useCategoryStore";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import ColorDrawer from "./components/ColorDrawer";
import { MdArrowDropDown } from "react-icons/md";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { BG_COLORS, TEXT_COLORS } from "@/app/constants";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "./components/ConfirmDialog";
import PrivacyDrawer from "./components/PrivacyDrawer";
import { useAuth } from "@/context/authProvider";

const Category = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { back } = useRouter();

  const { category } = useCategoryStore();
  const { title, color, id } = category;
  const auth = getAuth();
  const { user } = useAuth();

  const updateCategory = async () => {
    try {
      if (id) {
        const categoryCollectionRef = doc(db, "category", `${id}`);
        await setDoc(categoryCollectionRef, {
          ...category,
          title: inputRef.current?.value,
        });
      }

      if (!id) {
        const categoryCollectionRef = collection(db, "category");
        await addDoc(categoryCollectionRef, {
          color: category.color,
          privacy: category.privacy,
          title: inputRef.current?.value,
          uid: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["category"] });

      back();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(category);
  }, [category]);

  return (
    <>
      <Header
        title="Category"
        button={
          <div
            className="text-sm cursor-pointer px-4 py-2 font-medium"
            onClick={updateCategory}
          >
            Confirm
          </div>
        }
      />
      <div className="my-4 flex flex-col gap-6 mx-6">
        <div>
          <Input
            className={clsx(
              "pl-0 placeholder:text-neutral-600 font-medium bg-transparent border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-transparent",
              `${TEXT_COLORS[color as keyof typeof TEXT_COLORS]}`,
              {
                "text-white": !color,
              }
            )}
            defaultValue={title}
            maxLength={50}
            placeholder="Write a category..."
            ref={inputRef}
          ></Input>
          <Separator
            className={clsx(
              "h-[2px]",
              `${BG_COLORS[color as keyof typeof BG_COLORS]}`,
              {
                "bg-white": !color,
              }
            )}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-white text-sm">Privacy</p>
            <PrivacyDrawer />
          </div>
          <Separator className="mt-3" />
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-white text-sm">Color</p>
            <ColorDrawer />
          </div>
          <Separator className="mt-3" />
        </div>
        {id && <ConfirmDialog />}
      </div>
    </>
  );
};

export default Category;
