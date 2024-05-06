"use client";
import Header from "@/app/components/Header";
import { Follow as FollowDomain, User, UserFollow } from "@/app/types/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Follow = () => {
  const auth = getAuth();
  const { push } = useRouter();

  const { data: following } = useQuery({
    queryKey: ["useFollowingQuery", auth.currentUser?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("follower", "==", auth.currentUser?.uid)
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

        posts.push({
          id: doc.id,
          username,
          imageUrl,
          ...followData,
        });
      }

      return posts;
    },
    enabled: !!auth.currentUser?.uid,
  });

  const { data: follower } = useQuery({
    queryKey: ["useFollowerQuery", auth.currentUser?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("following", "==", auth.currentUser?.uid)
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

        posts.push({
          id: doc.id,
          username,
          imageUrl,
          ...followData,
        });
      }

      return posts;
    },
    enabled: !!auth.currentUser?.uid,
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
                  <AvatarImage src={imageUrl} alt="profile-image" />
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
                  <AvatarImage src={imageUrl} alt="profile-image" />
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
