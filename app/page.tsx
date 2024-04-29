"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { FaBox } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Home = () => {
  const SIGN_IN_FORM = {
    E_MAIL: {
      name: "이메일",
      label: "이메일",
      type: "email",
    },
    PASSWORD: {
      name: "패스워드",
      label: "패스워드",
      type: "password",
    },
  } as const;

  // useEffect(() => {
  //   console.log(Object.entries(SIGN_IN_FORM));
  // }, []);

  const { replace } = useRouter();
  const [lodaing, setLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      return replace("/feed");
    }

    return setLoading(false);
  });

  if (lodaing) return null;

  return (
    <div className="flex h-screen justify-center w-full flex-col items-center gap-24 text-white">
      <div className="max-w-50 text-center">
        <FaBox fontSize={"40px"} className="m-auto"></FaBox>
        <h1 className="scroll-m-20 mt-4 text-5xl font-extrabold tracking-tight lg:text-5xl">
          Link Box
        </h1>
        <p className="text-sm [&:not(:first-child)]:mt-3 text-gray-400">
          Catagorize and share your links.
        </p>
      </div>
      <div className="flex flex-col gap-2 items-center w-full">
        <Link href="/signin">
          <Button variant="secondary" className="capitalize w-40" size="lg">
            sign in
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="link" className="capitalize text-white" size="sm">
            sign up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
