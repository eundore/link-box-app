"use client";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

const Feed = () => {
  const router = useRouter();
  const params = useParams<{ uid: string }>();
  const { uid } = params;

  useLayoutEffect(() => {
    if (!uid) {
      onAuthStateChanged(auth, (user) => {
        router.replace(`/feed/${user?.uid}`);
      });
    }
  }, []);

  const { isPending, error, data } = useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      const q = query(
        collection(db, "user"),
        where("uid", "==", uid.toString())
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      alert(JSON.stringify(posts));
      return posts;
    },
    enabled: !!uid,
  });

  const logOut = async () => {
    await signOut(auth);
    return router.replace("/");
  };

  if (isPending) return null;

  return (
    <>
      <h1 className="text-white">Feed Page</h1>
      <p className="text-white">{data?.map((v) => JSON.stringify(v))}</p>
      <Button onClick={logOut}>Log out</Button>
    </>
  );
};

export default Feed;
