"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { auth, db } from "../../../firebase";
import crypto from "crypto";
import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

//const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[a-z0-9._]{3,30}$/;
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$&*?!%])[A-Za-z\d!@$%&*?]{8,15}$/;

const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "3글자 이상 입력해 주세요." })
    .max(30, { message: "30글자 이하 입력해 주세요." })
    .regex(/^[a-z0-9._]+$/, {
      message:
        "알파벳 소문자, 숫자, 밑줄(_) 및 마침표(.)만 포함할 수 있습니다.",
    })
    .regex(/^(?!\.)(?!.*\.$)(?!.*\.\.)[^.]*$/, {
      message:
        "마침표(.)는 연속해서 나올 수 없으며, 시작 및 끝에 나올 수 없습니다.",
    })
    .regex(/^(?!.*_$)[a-z0-9._]+$/, {
      message: "밑줄(_)은 마지막에 나올 수 없습니다.",
    }),
  email: z.string().email({ message: "이메일을 올바르게 입력해 주세요." }),
  password: z
    .string()
    .min(8, { message: "8자리 이상 입력해 주세요." })
    .max(15, { message: "15자리 이하 입력해 주세요." })
    .regex(passwordRegex, {
      message: "영문, 숫자, 특수문자(~!@#$%^&*)를 모두 조합해 주세요.",
    }),
});

const SignUp = () => {
  const { toast } = useToast();
  const { replace } = useRouter();

  type signUpType = z.infer<typeof SignUpSchema>;

  const form = useForm<signUpType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit, watch, formState, setError, trigger } = form;
  const { isValid } = formState;
  const watchedUsername = watch("username");

  const onSubmit = handleSubmit(async (data: z.infer<typeof SignUpSchema>) => {
    const { email, password, username } = data;

    const cryptoKey = process.env.CRYPTO_KEY || "";

    const hashPassword = crypto
      .createHmac("sha256", cryptoKey)
      .update(password)
      .digest("hex");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        hashPassword
      );

      const currentUser = getAuth().currentUser;

      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: username,
        });
      }

      const userCollectionRef = collection(db, "user");

      await addDoc(userCollectionRef, {
        uid: userCredential.user.uid,
        email,
        username,
        imageUrl: null,
        description: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const categoryCollectionRef = collection(db, "category");

      await addDoc(categoryCollectionRef, {
        uid: userCredential.user.uid,
        title: "General",
        color: "category1",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      replace("/");
      toast({
        title: "Congratulations!🎉",
        description: "You can enjoy LinkBox app now.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  });

  const [debouncedValue, setDebouncedValue] = useState(watchedUsername);

  const {
    isPending,
    error,
    data: isValidUsername,
  } = useQuery({
    queryKey: ["user", debouncedValue],
    queryFn: async () => {
      const q = query(collection(db, "user"));
      const querySnapshot = await getDocs(q);
      const usernames: Array<string> = [];
      querySnapshot.forEach((doc) => {
        const username = doc.data().username;
        usernames.push(username);
      });

      if (usernames?.includes(watchedUsername)) return false;

      return true;
    },
    enabled: !!debouncedValue,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(watchedUsername), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [watchedUsername]);

  useEffect(() => {
    if (isPending) return;

    if (!isValidUsername) {
      return setError("username", { message: "중복된 아이디입니다." });
    }

    trigger("username");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, isValid, isValidUsername]);

  const [lodaing, setLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      return replace("/feed");
    }

    return setLoading(false);
  });

  if (lodaing) return null;

  return (
    <>
      <Header title="Sign Up" />
      <Form {...form}>
        <form className="my-4 flex flex-col gap-3 mx-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type={"text"} placeholder={"Username"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type={"email"} placeholder={"Email"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type={"password"}
                    placeholder={"Password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-neutral-600 mt-4"
            size="lg"
            onClick={onSubmit}
          >
            Confirm
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUp;
