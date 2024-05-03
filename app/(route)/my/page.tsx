"use client";
import Header from "@/app/components/Header";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const My = () => {
  const router = useRouter();

  const logOut = async () => {
    await signOut(auth);
    return router.replace("/");
  };

  return (
    <>
      <Header title="My" />
      <Button onClick={logOut}>Log out</Button>
    </>
  );
};

export default My;
