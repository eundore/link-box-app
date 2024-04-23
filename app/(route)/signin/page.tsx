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
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from "../../components/Header/Header";
import { auth } from "../../../firebase";

const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$&*?!%])[A-Za-z\d!@$%&*?]{8,15}$/;

const SignInSchema = z.object({
  email: z.string().email({ message: "이메일을 올바르게 입력해 주세요." }),
  password: z
    .string()
    .min(8, { message: "8자리 이상 입력해 주세요." })
    .max(15, { message: "15자리 이하 입력해 주세요." })
    .regex(passwordRegex, {
      message: "영문, 숫자, 특수문자(~!@#$%^&*)를 모두 조합해 주세요.",
    }),
});

const SignIn = () => {
  const { toast } = useToast();
  const { push, replace } = useRouter();

  type signUpType = z.infer<typeof SignInSchema>;

  const form = useForm<signUpType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data: z.infer<typeof SignInSchema>) => {
    const { email, password } = data;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      //console.log("userCredential : ", userCredential);
      push("/feed");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  });

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
      <Header title="Sign In" />
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
            className="w-full bg-gray-600"
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

export default SignIn;
