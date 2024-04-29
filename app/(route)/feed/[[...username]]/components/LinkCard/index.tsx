import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import LinkCardSettingMenu from "./LinkCardSettingMenu";
import { Link as LinkDomain } from "@/app/types/domain";
import Link from "next/link";

interface LinkCardProps {
  link?: LinkDomain;
  isOwner: boolean;
}

const LinkCard = ({ link, isOwner }: LinkCardProps) => {
  const { id, title, description, imageUrl, caption, url } = link ?? {};

  const queryClient = useQueryClient();

  const deleteLink = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    const linkRef = doc(db, "link", `${id}`);
    await deleteDoc(linkRef);

    queryClient.invalidateQueries({ queryKey: ["uselinkQuery"] });
  };

  const updateCation = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const linkRef = doc(db, "link", `${id}`);
    await updateDoc(linkRef, { ...link, caption: event.currentTarget.value });

    queryClient.invalidateQueries({ queryKey: ["uselinkQuery"] });
  };

  return (
    <Link href={url ?? ""} target="_blank" className="relative">
      {isOwner && <LinkCardSettingMenu deleteLink={deleteLink} />}
      <div className="rounded-2xl w-full h-40 bg-white flex overflow-clip border border-gray-400">
        {title && (
          <div className=" bg-black w-2/3 p-4 flex flex-col justify-between">
            <div>
              <h1 className="text-white line-clamp-2">{title}</h1>
              <p className="text-gray-400 text-xs line-clamp-3 mt-1">
                {description}
              </p>
            </div>
            <p className=" text-white text-sm truncate">🔗 {url}</p>
          </div>
        )}
        {imageUrl && (
          <div className="w-1/3">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-40"
            />
          </div>
        )}
      </div>
      {isOwner && (
        <Input
          className="text-gray-400 mt-1 placeholder:text-neutral-600 bg-transparent border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-transparent"
          onClick={(e) => e.preventDefault()}
          defaultValue={caption}
          placeholder="Write a caption..."
          onChange={updateCation}
        />
      )}
      {!isOwner && <p className="text-gray-400 mt-1">{caption}</p>}
    </Link>
  );
};

export default LinkCard;
