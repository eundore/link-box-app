"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

const NoChatRoom = () => {
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-6 w-full justify-center items-center text-white text-center mt-20 md:mt-40 ">
      <IoChatbubbleEllipsesSharp fontSize={60} />
      <p className="text-sm font-light">
        Start a new chat with your mates. <br />
        We hope you will have good converstations.
      </p>
      <Button
        variant={"outline"}
        className=" text-black rounded-full"
        onClick={() => push("/chat/start-a-chat")}
      >
        Start a chat
      </Button>
    </div>
  );
};

export default NoChatRoom;
