"use client";
import Header from "@/app/components/Header";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const SignUpSchema = z.object({
  description: z.string().max(30, { message: "30글자 이하 입력해 주세요." }),
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ),
});

const EditProfile = () => {
  const [imagePreview, setImagePreview] = useState(
    "/image/profile_image_default.jpg"
  );

  type signUpType = z.infer<typeof SignUpSchema>;

  const form = useForm<signUpType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      description: "",
      image: null,
    },
  });

  return (
    <>
      <Header title="Edit Profile" />
      <Form {...form}>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type="file" className="hidden" />
              </FormControl>
            </FormItem>
          )}
        />

        <div>
          <Image
            priority
            src={imagePreview}
            layout="responsive"
            width={100}
            height={100}
            alt="image-preview"
          />
        </div>
        <form className="my-4 flex flex-col gap-3 mx-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type={"text"}
                    placeholder="Enter a description"
                    className=" rounded-xl bg-neutral-800 text-white placeholder:text-neutral-600 border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-transparent"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default EditProfile;
