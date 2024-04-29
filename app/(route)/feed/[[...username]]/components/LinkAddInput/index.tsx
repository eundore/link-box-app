import { ScrapedData } from "@/app/api/scrapper/route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { IoMdAdd, IoMdLink } from "react-icons/io";
import { MdOutlineAddLink } from "react-icons/md";

interface LinkAddInputProps {
  currentCategoryId?: string;
}

const LinkAddInput = ({ currentCategoryId }: LinkAddInputProps) => {
  const auth = getAuth();
  const linkRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleClick = async () => {
    const url = linkRef.current?.value;

    const data = await fetch(`/api/scrapper?url=${url ?? ""}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      }
    );
    // .then((data: ScrapedData) => {
    //   return data;
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    // });

    console.log("Response data:", data);
    //setScraptedData(data);
    const { title, description, imageUrl } = data;

    const linkCollectionRef = collection(db, "link");

    await addDoc(linkCollectionRef, {
      uid: auth.currentUser?.uid,
      categoryid: currentCategoryId,
      url: url,
      title: title,
      description: description,
      imageUrl: imageUrl,
      caption: "",
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      //password: hashPassword,
    });

    queryClient.invalidateQueries({ queryKey: ["uselinkQuery"] });

    if (linkRef.current) {
      linkRef.current.value = "";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="flex items-center gap-4 mx-4">
      <Input
        placeholder="Paste a link"
        ref={linkRef}
        onKeyDown={handleKeyDown}
      />
      <Button variant={"outline"} disabled={false} onClick={handleClick}>
        {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
        <MdOutlineAddLink className="mr-0 md:mr-2 w-6 h-6" />
        <p className="hidden md:inline">Add a link</p>
      </Button>
    </div>
  );
};

export default LinkAddInput;
