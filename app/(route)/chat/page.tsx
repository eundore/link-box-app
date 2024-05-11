"use client";
import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import { FaUserPlus } from "react-icons/fa";
import NoChatRoom from "./components/NoChatRoom";
import { getAuth } from "@firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, or, query, where } from "@firebase/firestore";
import { db, storage } from "@/firebase";
import {
  ChatRoom as ChatRoomDomain,
  User,
  UserChatRoom,
} from "@/app/types/domain";
import ChatRoom from "./components/ChatRoom";
import { getDownloadURL, ref } from "@firebase/storage";

const Chat = () => {
  const auth = getAuth();

  const { isFetched, data: chatRooms } = useQuery({
    queryKey: ["useChatRoomQuery", auth.currentUser?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "chatroom"),
        or(
          where("uid", "==", auth.currentUser?.uid),
          where("partnerUid", "==", auth.currentUser?.uid)
        )
      );
      const querySnapshot = await getDocs(q);
      const posts: Array<UserChatRoom> = [];

      for (const doc of querySnapshot.docs) {
        const chatRoom: ChatRoomDomain = doc.data();
        const { uid, partnerUid } = chatRoom;

        const targetUid = auth.currentUser?.uid === uid ? partnerUid : uid;

        const q = query(collection(db, "user"), where("uid", "==", targetUid));
        const querySnapshot = await getDocs(q);

        const user: User = querySnapshot.docs[0].data();

        const { username, imageUrl } = user;

        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);

        posts.push({
          id: doc.id,
          username,
          imageUrl: url,
          ...chatRoom,
        });
      }

      const post = posts.length > 0 ? posts : null;

      return post;
    },
    enabled: !!auth.currentUser?.uid,
  });

  return (
    <>
      <Header
        title="Message"
        noBack
        button={<FaUserPlus fontSize={20} />}
      ></Header>
      <div className="flex flex-col gap-6 px-4">
        {chatRooms?.map((chatRoom, index) => (
          <ChatRoom key={`chatRoom-${index}`} chatRoom={chatRoom} />
        ))}
      </div>
      {isFetched && !chatRooms && <NoChatRoom />}
      <BottomNav />
    </>
  );
};

export default Chat;
