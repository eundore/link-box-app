"use client";
import Header from "@/app/components/Header";
import { Follow, User, UserFollow } from "@/app/types/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { db, storage } from "@/firebase";
import { getAuth } from "@firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "@firebase/firestore";
import { getDownloadURL, ref } from "@firebase/storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useState } from "react";

const StartAChat = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const auth = getAuth();
  const [tempSelectedUid, setTempSelectedUid] = useState<string>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTempSelectedUid(event.currentTarget.value);
  };

  const createAChatRoom = async () => {
    try {
      const categoryCollectionRef = collection(db, "chatroom");
      const chatRoom = await addDoc(categoryCollectionRef, {
        uid: auth.currentUser?.uid,
        partnerUid: tempSelectedUid,
      });

      await queryClient.invalidateQueries({ queryKey: ["useChatRoomQuery"] });

      push("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  const { data: following } = useQuery({
    queryKey: ["useFollowingQuery", auth.currentUser?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("follower", "==", auth.currentUser?.uid),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      const posts: Array<UserFollow> = [];

      for (const doc of querySnapshot.docs) {
        const data: Follow = doc.data();
        const { following } = data;

        const q = query(collection(db, "user"), where("uid", "==", following));
        const querySnapshot = await getDocs(q);

        const user: User = querySnapshot.docs[0].data();

        const { username, imageUrl, uid } = user;

        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);

        posts.push({
          id: doc.id,
          username,

          imageUrl: url,
          ...data,
        });
      }

      return posts;
    },
    enabled: !!auth.currentUser?.uid,
  });

  return (
    <>
      <Header title="Start a chat"></Header>
      <div className="flex flex-col gap-4 m-4">
        <p className="text-neutral-500 text-xs font-medium">Select a user</p>
        <RadioGroup
          defaultValue={"private"}
          className=" text-white flex flex-col w-full gap-8"
        >
          {following?.map(({ imageUrl, username, following }, index) => (
            <div
              key={`following-${index}`}
              className="flex items-center justify-between"
            >
              <Label
                htmlFor={`${following}`}
                className="cursor-pointer flex w-full"
              >
                <div className="flex gap-4 items-center">
                  <Avatar className="w-12 h-12 cursor-pointer">
                    <AvatarImage src={imageUrl} alt="profile-image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-white text-sm font-medium">{username}</p>
                </div>
              </Label>
              <RadioGroupItem
                value={`${following}`}
                id={`${following}`}
                className=" text-white border-white cursor-pointer"
                onClick={handleClick}
              />
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="fixed bottom-4 left-0 px-4 flex w-full">
        <Button
          variant={"outline"}
          className="w-full"
          onClick={createAChatRoom}
        >
          Create a chat room
        </Button>
      </div>
    </>
  );
};

export default StartAChat;
