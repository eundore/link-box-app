"use client";

import BottomNav from "@/app/components/BottomNav";
import Header from "@/app/components/Header";
import useCategoryStore from "@/app/store/useCategoryStore";
import useUserStore from "@/app/store/useUserStore";
import { Follow, Link } from "@/app/types/domain";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAuth, signOut } from "firebase/auth";
import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import CategoryScrollbar from "./components/CategoryScrollbar";
import Comment from "./components/Comment";
import FollowScrollbar from "./components/FollowScrollbar";
import LinkInput from "./components/LinkAddInput";
import LinkCard from "./components/LinkCard";
import Profile from "./components/Profile";
import SettingMenu from "./components/SettingMenu";

const Feed = () => {
  const queryClient = useQueryClient();
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
    isPending,
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

  const { isFetched, data: followId } = useQuery({
    queryKey: ["useFollowCheckingQuery", auth.currentUser?.uid, feedUid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("follower", "==", auth.currentUser?.uid),
        where("following", "==", feedUid)
      );
      const querySnapshot = await getDocs(q);
      const posts: Array<Follow> = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const followId = posts.length > 0 ? posts[0].id : null;

      return followId;
    },
    enabled: !isOwner && !!auth.currentUser?.uid && !!feedUid,
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

  const followThisUser = async () => {
    try {
      if (followId) {
        const followCollectionRef = doc(db, "follow", `${followId}`);
        await deleteDoc(followCollectionRef);
      } else {
        const followCollectionRef = collection(db, "follow");

        await addDoc(followCollectionRef, {
          follower: auth.currentUser?.uid,
          following: feedUid,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["useFollowCheckingQuery"],
      });
      await queryClient.invalidateQueries({ queryKey: ["useFollowingQuery"] });
      await queryClient.invalidateQueries({ queryKey: ["useFollowerQuery"] });
    } catch (error) {
      console.log(error);
    }
  };

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
      {!isOwner && (
        <Header
          title={""}
          button={
            <Button
              className=" bg-blue-500 hover:bg-blue-500"
              onClick={followThisUser}
            >
              {!!followId ? "Unfollow" : "Follow"}
            </Button>
          }
        />
      )}
      {isOwner && <SettingMenu />}
      {isOwner && <FollowScrollbar />}
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
      {isOwner && <BottomNav />}
    </>
  );
};

export default Feed;
