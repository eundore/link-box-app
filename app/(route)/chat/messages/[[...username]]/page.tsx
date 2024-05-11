"use client";

import Header from "@/app/components/Header";
import useChatStore from "@/app/store/useChatStore";
import { Message as MessageDomain } from "@/app/types/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "@firebase/firestore";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import Message from "./components/Message";
import { getAuth } from "@firebase/auth";

const Messages = () => {
  const params = useParams();
  const auth = getAuth();
  const { chatRoom } = useChatStore();
  const { id, username, imageUrl, partnerUid, uid } = chatRoom;

  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useState<Array<MessageDomain>>([]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, `messages`),
      where("chatRoomId", "==", id),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Array<MessageDomain> = querySnapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      setMessages(data);
    });

    return unsubscribe;
  }, [id]);

  const writeComment = async () => {
    if (!input || input.replace(/\s/g, "").length === 0) return;

    const collectionRef = collection(db, `messages`);

    try {
      await addDoc(collectionRef, {
        chatRoomId: id,
        authorId: auth.currentUser?.uid,
        content: input,
        createdAt: serverTimestamp(),
        isRead: false,
      });

      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    setInput(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      if (!event.shiftKey) {
        return writeComment();
      }
    }
  };

  if (!username) return null;

  return (
    <>
      <Header title={username} />
      <div>
        <div className="flex flex-col gap-6 justify-center text-white items-center mt-4 text-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={imageUrl} alt="profile-image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-bold">Together is special</p>
            <p className="text-xs text-neutral-500 font-medium mt-2">
              Together, everything becomes special
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4 px-4">
          {messages.map((message, index) => (
            <Message
              key={`message-${index}`}
              message={message}
              isMine={auth.currentUser?.uid === message.authorId}
            />
          ))}
        </div>

        <div className="bg-transparent w-full h-20 mt-2" />
        <div className="bg-black fixed bottom-0 left-0 px-4 py-2 flex w-full items-center gap-3 justify-center">
          <Input
            placeholder="Input message"
            className="rounded-full max-w-5xl"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <IoSend
            fontSize={24}
            className={clsx("text-blue-400 cursor-pointer", {
              "!text-neutral-600 !cursor-default":
                !input || input.replace(/\s/g, "").length === 0,
            })}
          />
        </div>
      </div>
    </>
  );
};

export default Messages;
