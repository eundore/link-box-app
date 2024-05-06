"use client";
import Header from "@/app/components/Header";
import useImageDownloadUrl from "@/app/hooks/useImageDownloadUrl";
import useUserStore from "@/app/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const EditProfileSchema = z.object({
  description: z.string().max(50, { message: "50글자 이하 입력해 주세요." }),
  image: z.optional(
    z
      .any()
      // .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine((file) => {
        if (file) return ACCEPTED_IMAGE_TYPES.includes(file?.type);
      }, "Only .jpg, .jpeg, and .png formats are supported.")
  ),
});

const EditProfile = () => {
  const { push } = useRouter();
  const { user } = useUserStore();
  const downloadUrl = useImageDownloadUrl();
  const queryClient = useQueryClient();

  const imageRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState(
    "/image/profile_image_default.jpg"
  );

  type signUpType = z.infer<typeof EditProfileSchema>;

  const form = useForm<signUpType>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      description: "",
      image: undefined,
    },
  });

  const { handleSubmit, watch, formState, setError, trigger, setValue } = form;
  const { isValid } = formState;
  //const image = watch("image");

  const addPreviewImage = (file: File): Promise<void> => {
    if (file) {
      setValue("image", file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<void>((resolve) => {
        reader.onload = () => {
          setImagePreview(reader.result as string);
          resolve();
        };
      });
    } else {
      return Promise.resolve();
    }
  };

  const onSubmit = handleSubmit(
    async (data: z.infer<typeof EditProfileSchema>) => {
      const { description, image } = data;

      try {
        const path = image ? `profile/${user.uid}` : undefined;

        if (image) {
          const imageRef = ref(storage, path);

          await uploadBytes(imageRef, image);
        }

        const userRef = doc(db, "user", `${user.id}`);

        const userData = {
          imageUrl: path,
          description: description,
        };

        const remove_undefined_data = Object.fromEntries(
          Object.entries(userData).filter(([_, value]) => value !== undefined)
        );

        await updateDoc(userRef, remove_undefined_data);

        queryClient.invalidateQueries({ queryKey: ["useUserQuery"] });

        push("/feed");
      } catch (error) {
        console.log(error);
      }
    }
  );

  useEffect(() => {
    if (user.description) setValue("description", user.description);
  }, [user]);

  useEffect(() => {
    if (downloadUrl) setImagePreview(downloadUrl);
  }, [downloadUrl]);

  return (
    <>
      <Header title="Edit Profile" />

      <Form {...form}>
        <form className="my-4 flex flex-col gap-3 mx-6">
          <div className=" flex justify-between">
            <div>
              <p className="text-white mb-2">Profile</p>
              <h1 className="text-white font-bold">{user.username}</h1>
            </div>

            <div className="flex flex-col  items-end">
              <Avatar
                className="w-16 h-16 cursor-pointer"
                onClick={() => {
                  if (imageRef.current) imageRef.current.click();
                }}
              >
                <AvatarImage
                  fetchPriority="high"
                  src={imagePreview}
                  alt="image-preview"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <FormField
                //control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        //{...field}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          //field.onChange(e);
                          if (e.target.files)
                            addPreviewImage(e.target.files[0]);
                        }}
                        ref={(el) => {
                          //field.ref(el);
                          (
                            imageRef as MutableRefObject<HTMLInputElement | null>
                          ).current = el;
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={"text"}
                    placeholder="Enter a description"
                    className=" rounded-xl bg-neutral-800 text-white placeholder:text-neutral-600 border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-neutral-600"
            size="lg"
            onClick={onSubmit}
          >
            Done
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditProfile;
