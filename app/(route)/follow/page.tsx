"use client";
import Header from "@/app/components/Header";
import { Follow as FollowDomain, User, UserFollow } from "@/app/types/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authProvider";
import { db, storage } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Follow = () => {
  const { user } = useAuth();
  const { push } = useRouter();

  const { data: following } = useQuery({
    queryKey: ["useFollowingQuery", user?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("follower", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);

      const posts: Array<UserFollow> = [];

      for (const doc of querySnapshot.docs) {
        const followData: FollowDomain = doc.data();
        const { following } = followData;

        const q = query(collection(db, "user"), where("uid", "==", following));
        const querySnapshot = await getDocs(q);

        const user: User = querySnapshot.docs[0].data();

        const { username, imageUrl } = user;

        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);

        posts.push({
          id: doc.id,
          ...followData,
          username,
          imageUrl: url,
        });
      }

      return posts;
    },
    enabled: !!user?.uid,
  });

  const { data: follower } = useQuery({
    queryKey: ["useFollowerQuery", user?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("following", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);

      const posts: Array<UserFollow> = [];

      for (const doc of querySnapshot.docs) {
        const followData: FollowDomain = doc.data();
        const { follower } = followData;

        const q = query(collection(db, "user"), where("uid", "==", follower));
        const querySnapshot = await getDocs(q);

        const user: User = querySnapshot.docs[0].data();

        const { username, imageUrl } = user;

        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);

        posts.push({
          id: doc.id,
          ...followData,
          username,
          imageUrl: url,
        });
      }

      return posts;
    },
    enabled: !!user?.uid,
  });

  return (
    <>
      <Header title="Follow" />
      <div className="my-4 mx-6 flex flex-col gap-4">
        <Tabs defaultValue="followers">
          <TabsList className="grid w-full grid-cols-2 bg-black">
            <TabsTrigger value="followers" className="text-neutral-500">
              {follower?.length} Followers
            </TabsTrigger>
            <TabsTrigger value="following" className="text-neutral-500">
              {following?.length} Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="flex gap-4 ">
            {follower?.map(({ imageUrl, username }, index) => (
              <div
                key={`following-${index}`}
                className="flex flex-col justify-center items-center gap-2"
              >
                <Avatar
                  className="w-12 h-12 cursor-pointer"
                  onClick={() => push(`/feed/${username}`)}
                >
                  {imageUrl && (
                    <AvatarImage src={imageUrl} alt="profile-image" />
                  )}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-white text-[10px] font-medium">{username}</p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="following" className="flex gap-4">
            {following?.map(({ imageUrl, username }, index) => (
              <div
                key={`following-${index}`}
                className="flex flex-col justify-center items-center gap-2"
              >
                <Avatar
                  className="w-12 h-12 cursor-pointer"
                  onClick={() => push(`/feed/${username}`)}
                >
                  {imageUrl && (
                    <AvatarImage src={imageUrl} alt="profile-image" />
                  )}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-white text-[10px] font-medium">{username}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Follow;
