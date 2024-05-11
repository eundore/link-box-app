"use client";

import useChatStore from "@/app/store/useChatStore";
import { UserChatRoom } from "@/app/types/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ChatRoomProps {
  chatRoom: UserChatRoom;
}

const ChatRoom = ({ chatRoom }: ChatRoomProps) => {
  const { username, imageUrl, id } = chatRoom;
  //const { push } = useRouter();
  const { setChatRoom } = useChatStore();

  return (
    <Link
      className="flex gap-4 items-center"
      href={`chat/messages/${username}`}
      onClick={() => setChatRoom(chatRoom)}
    >
      <Avatar className="w-12 h-12 cursor-pointer">
        <AvatarImage src={imageUrl} alt="profile-image" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p className="text-white text-sm font-medium">{username}</p>
    </Link>
  );
};

export default ChatRoom;
