"use client";
import BottomNav from "@/app/components/BottomNav";
import { User } from "@/app/types/domain";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Search = () => {
  const { push } = useRouter();
  const [targetUsername, setTargetUsername] = useState<string | undefined>();

  const {
    isPending,
    error,
    data: users,
  } = useQuery({
    queryKey: ["user", targetUsername],
    queryFn: async () => {
      const q = query(
        collection(db, "user"),
        where("username", ">=", targetUsername),
        where("username", "<=", targetUsername + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const posts: Array<User> = [];

      for (const doc of querySnapshot.docs) {
        const { imageUrl } = doc.data();
        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);

        posts.push({
          ...doc.data(),
          imageUrl: url,
        });
      }

      return posts;
    },
    enabled: !!targetUsername,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.replace(/\s/g, "");

    const timer = setTimeout(() => setTargetUsername(value), 300);

    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <>
      <div className="flex flex-col mt-8 gap-8 mx-4 ">
        <Input
          placeholder="accounts"
          className=" rounded-xl bg-neutral-800 text-white placeholder:text-neutral-600 border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-transparent"
          onChange={handleChange}
        />
        {users?.map(({ username, description, imageUrl }, index) => (
          <div
            key={`user-${index}`}
            className="flex gap-4 cursor-pointer"
            onClick={() => push(`/feed/${username}`)}
          >
            <Avatar className="w-14 h-14 bg-white">
              {imageUrl && <AvatarImage src={imageUrl} alt="profile-image" />}
            </Avatar>
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-white font-bold">{username}</h1>
              <p className="text-sm text-neutral-400 line-clamp-1">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </>
  );
};

export default Search;
