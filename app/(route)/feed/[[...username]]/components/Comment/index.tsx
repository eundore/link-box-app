import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import CommentSettingMenu from "./CommentSettingMenu";
import { GrUploadOption } from "react-icons/gr";
import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { getAuth } from "firebase/auth";
import { comment } from "postcss";
import useCategoryStore from "@/app/store/useCategoryStore";
import { useQuery } from "@tanstack/react-query";
import {
  Comment as CommentDomain,
  User,
  UserComment,
} from "@/app/types/domain";
import { format } from "date-fns";
import { MdFileUpload } from "react-icons/md";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import useImageDownloadUrl from "@/app/hooks/useImageDownloadUrl";
import { getDownloadURL, ref } from "firebase/storage";

const Comment = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const auth = getAuth();
  const { currentCategoryId } = useCategoryStore();
  const downloadUrl = useImageDownloadUrl();

  const [isTextareaEmpty, setIsTextareaEmpty] = useState(true);

  const { data: comments, refetch } = useQuery({
    queryKey: ["useCommentQuery", currentCategoryId],
    queryFn: async () => {
      const q = query(
        collection(db, "comment"),
        where("categoryId", "==", currentCategoryId),
        limit(1),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const posts: Array<UserComment> = [];

      for (const doc of querySnapshot.docs) {
        const commentData: CommentDomain = doc.data();
        const { authorId } = commentData;

        const q = query(collection(db, "user"), where("uid", "==", authorId));
        const querySnapshot = await getDocs(q);

        const user: User = querySnapshot.docs[0].data();

        const { username, imageUrl } = user;

        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);

        posts.push({
          id: doc.id,
          username,
          imageUrl: url,
          ...commentData,
        });
      }

      return posts;
    },
    enabled: !!currentCategoryId,
  });

  const writeComment = async () => {
    if (isTextareaEmpty) return;

    const categoryCollectionRef = collection(db, "comment");

    try {
      await addDoc(categoryCollectionRef, {
        authorId: auth.currentUser?.uid,
        categoryId: currentCategoryId,
        comment: textareaRef.current?.value,
        createdAt: serverTimestamp(),
      });

      refetch();

      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id?: string) => {
    if (!id) return;

    const commentRef = doc(db, "comment", `${id}`);
    await deleteDoc(commentRef);

    refetch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key == "Enter") {
      if (!event.shiftKey) {
        console.log("hey??");
        return writeComment();
      }
    }
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      const enterCount = (text.match(/\n/g) || []).length;
      textareaRef.current.rows = 1 + enterCount;

      setIsTextareaEmpty(text.length === 0);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {comments?.map(
        ({ comment, imageUrl, username, createdAt, id }, index) => (
          <div className="flex gap-2 mx-4 " key={`comment-${index}`}>
            <Avatar>
              <AvatarImage src={imageUrl} alt="profile-image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <div className="flex">
                <div className="w-full flex items-baseline gap-2 ">
                  <p className="text-white text-sm font-medium">{username}</p>
                  <p className="text-xs text-neutral-400">
                    {createdAt && format(createdAt?.toDate(), "yy.MM.dd hh:mm")}
                  </p>
                </div>
                <CommentSettingMenu deleteComment={() => deleteComment(id)} />
              </div>
              <p className="text-sm  text-neutral-300 font-light mt-1">
                {comment}
              </p>
            </div>
          </div>
        )
      )}

      <div className="flex mx-4 gap-2">
        <Avatar>
          {downloadUrl && <AvatarImage src={downloadUrl} alt="profile-image" />}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full flex py-2">
          <Textarea
            placeholder="Tell us a little bit about yourself"
            className=" h-fit min-h-min overflow-y-hidden resize-none p-0 text-neutral-300 placeholder:text-neutral-600 bg-transparent border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-transparent w-full"
            ref={textareaRef}
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={resizeTextarea}
          />
          <div
            className={clsx(
              "cursor-pointer bg-blue-400 rounded-md w-7 h-5  flex justify-center items-center shadow-md",
              {
                "!bg-neutral-600 !cursor-default": isTextareaEmpty,
              }
            )}
          >
            <MdFileUpload onClick={writeComment} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
