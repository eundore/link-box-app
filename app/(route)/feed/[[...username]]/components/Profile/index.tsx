import useImageDownloadUrl from "@/app/hooks/useImageDownloadUrl";
import useUserStore from "@/app/store/useUserStore";
import { User } from "@/app/types/domain";
import { Avatar } from "@/components/ui/avatar";
import { auth, db, storage } from "@/firebase";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Profile {
  username: string;
  description?: string;
  imageUrl?: string;
}

const Profile = () => {
  const params = useParams();
  const { username } = params;
  const { setUser } = useUserStore();

  const {
    isPending,
    error,
    data: userData,
  } = useQuery({
    queryKey: ["useUserQuery", username],
    queryFn: async () => {
      const q = query(
        collection(db, "user"),
        where("username", "==", username[0])
      );
      const querySnapshot = await getDocs(q);
      const posts: Array<User> = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const { imageUrl } = posts[0];

      const storageRef = ref(storage, imageUrl);
      const url = await getDownloadURL(storageRef);

      setUser({
        ...posts[0],
        imageUrl: url,
      });

      return {
        ...posts[0],
        imageUrl: url,
      };
    },
    enabled: !!username,
  });

  if (isPending) return null;

  return (
    <div className="flex mt-8 gap-8 mx-4">
      <Avatar className="w-20 h-20 bg-white">
        {userData?.imageUrl && (
          <AvatarImage src={userData?.imageUrl} alt="profile-image" />
        )}
      </Avatar>
      <div className="flex flex-col justify-center gap-2">
        <h1 className="text-white font-bold">{userData?.username}</h1>
        <p className="text-sm text-neutral-400">{userData?.description}</p>
      </div>
    </div>
  );
};

export default Profile;
