"use client";
import CategoryScrollbar from "@/app/(route)/feed/[[...username]]/components/CategoryScrollbar";
import LinkInput from "@/app/(route)/feed/[[...username]]/components/LinkAddInput";
import LinkCard from "@/app/(route)/feed/[[...username]]/components/LinkCard";
import Profile from "@/app/(route)/feed/[[...username]]/components/Profile";
import SettingMenu from "@/app/(route)/feed/[[...username]]/components/SettingMenu";
import Comment from "@/app/(route)/feed/[[...username]]/components/Comment";
import { Link } from "@/app/types/domain";
import { ScrapedData } from "@/app/api/scrapper/route";
import BottomNav from "@/app/components/BottomNav";
import useCategoryStore from "@/app/store/useCategoryStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import useUserStore from "@/app/store/useUserStore";

const Feed = () => {
  const auth = getAuth();
  const router = useRouter();
  const params = useParams();
  const { username } = params;
  const { currentCategoryId } = useCategoryStore();
  const { user } = useUserStore();
  const { uid: feedUid } = user;

  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (!username) return;

    if (auth.currentUser?.displayName === username[0]) {
      return setIsOwner(true);
    }

    return setIsOwner(false);
  }, [auth, username]);

  const LIMIT_PER_PAGE = 4; // 한 페이지당 불러올 개수

  const fetchPage = async (pageParam: any) => {
    if (!pageParam) {
      const q = query(
        collection(db, "link"),
        where("uid", "==", feedUid),
        where("categoryid", "==", currentCategoryId),
        orderBy("createdAt", "desc"),
        limit(LIMIT_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot;
    }

    const q = query(
      collection(db, "link"),
      where("uid", "==", feedUid),
      where("categoryid", "==", currentCategoryId),
      orderBy("createdAt", "desc"),
      startAfter(pageParam),
      limit(LIMIT_PER_PAGE)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot;
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    data: links,
  } = useInfiniteQuery({
    queryKey: ["uselinkQuery", feedUid, currentCategoryId],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: null,
    getNextPageParam: (querySnapshot: DocumentData) => {
      return querySnapshot.docs.length === LIMIT_PER_PAGE
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : undefined;
    },
    enabled: !!feedUid && !!currentCategoryId,
    select: (data) => {
      const { pages } = data;

      const posts: Array<Link | undefined> = [];

      pages.map((data) =>
        data.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            posts.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        )
      );

      return posts;
    },
  });

  useBottomScrollListener(() => {
    if (isLoading) return;

    fetchNextPage();
  });

  const logOut = async () => {
    await signOut(auth);
    return router.replace("/");
  };

  useLayoutEffect(() => {
    if (!username) {
      router.replace(`/feed/${auth.currentUser?.displayName}`);
    }
  }, [username]);

  // if (isPending) return null;

  return (
    <>
      {/* <Button onClick={handleProfile}>Update</Button>
      {auth.currentUser?.photoURL && (
        <img
          src={auth.currentUser.photoURL}
          alt="profile"
          width={100}
          height={100}
        />
      )} */}
      {isOwner && <SettingMenu />}
      <div className="flex flex-col gap-6">
        <Profile />
        <CategoryScrollbar />
        <Separator className="bg-neutral-400" />
        <Comment />
        <Separator className="bg-neutral-400" />
        {isOwner && <LinkInput currentCategoryId={currentCategoryId} />}
        <div className="flex flex-col gap-8 mx-4">
          {links?.map((link, index) => (
            <LinkCard
              key={`link-card-${index}`}
              link={link}
              isOwner={isOwner}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Feed;
