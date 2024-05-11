"use client";
import { Message } from "@/app/types/domain";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

interface SentMessageProps {
  message: Message;
  isMine?: boolean;
}

const SentMessage = ({ message, isMine = false }: SentMessageProps) => {
  const { content, authorId } = message;

  return (
    <div
      className={clsx("flex", {
        "justify-end": isMine,
      })}
    >
      <Badge
        className={clsx(
          "py-2 px-3 min-w-14 text-md font-normal text-white w-fit justify-center",
          {
            "bg-neutral-700 hover:bg-neutral-700": isMine,
            " bg-black hover:bg-black  border-white": !isMine,
          }
        )}
      >
        {content}
      </Badge>
    </div>
  );
};

export default SentMessage;
