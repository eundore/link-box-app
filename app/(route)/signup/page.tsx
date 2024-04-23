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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from "../../components/Header/Header";
import { auth, db } from "../../../firebase";
import crypto from "crypto";

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$&*?!%])[A-Za-z\d!@$%&*?]{8,15}$/;

const SignUpSchema = z.object({
  // username: z
  //   .string()
  //   .min(2, { message: "2글자 이상 입력해 주세요." })
  //   .max(100, { message: "100글자 이하 입력해 주세요." }),
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
      //username: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data: z.infer<typeof SignUpSchema>) => {
    const { email, password } = data;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const collectionRef = collection(db, "user");

      const cryptoKey = process.env.CRYPTO_KEY || "";

      const hashPassword = crypto
        .createHmac("sha256", cryptoKey)
        .update(password)
        .digest("hex");

      await addDoc(collectionRef, {
        uid: userCredential.user.uid,
        email,
        password: hashPassword,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      //console.log("userCredential : ", userCredential);
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

  return (
    <>
      <Header title="Sign Up" />
      <Form {...form}>
        <form className="my-4 flex flex-col gap-3 mx-6">
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
            className="w-full bg-gray-600 mt-4"
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
