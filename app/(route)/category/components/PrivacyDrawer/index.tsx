import useCategoryStore from "@/app/store/useCategoryStore";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

import { MdArrowDropDown } from "react-icons/md";

const PRIVACY_TITLE = {
  public: "🔓 Public",
  followers: "🔐 Followers",
  private: "🔒 Private",
};

const PrivacyDrawer = () => {
  const [tempPrivacy, setTempPrivacy] = useState<string>("private");
  const { category, setCategoryPrivacy } = useCategoryStore();
  const { privacy } = category;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTempPrivacy(event.currentTarget.value.toLowerCase());
  };

  return (
    <Drawer>
      <DrawerTrigger className=" text-sm font-medium text-white flex items-center">
        {privacy && PRIVACY_TITLE[privacy as keyof typeof PRIVACY_TITLE]}
        <MdArrowDropDown className="text-neutral-600 w-5 h-5" />
      </DrawerTrigger>
      <DrawerContent className="bg-neutral-900 border-none">
        <div className="mx-auto w-full max-w-sm flex flex-col items-center">
          <DrawerHeader>
            <DrawerTitle className="text-center text-white">
              Privacy
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex w-full text-white my-4 max-w-80">
            <RadioGroup
              defaultValue={privacy ?? "private"}
              className="w-full gap-4"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="public" className="cursor-pointer flex w-full">
                  🔓 Public
                </Label>
                <RadioGroupItem
                  value="public"
                  id="public"
                  className=" text-white border-white cursor-pointer"
                  onClick={handleClick}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="followers"
                  className="cursor-pointer flex w-full"
                >
                  🔐 Followers
                </Label>
                <RadioGroupItem
                  value="followers"
                  id="followers"
                  className=" text-white border-white cursor-pointer"
                  onClick={handleClick}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="private" className="cursor-pointer flex w-full">
                  🔒 Private
                </Label>
                <RadioGroupItem
                  value="private"
                  id="private"
                  className=" text-white border-white cursor-pointer"
                  onClick={handleClick}
                />
              </div>
            </RadioGroup>
          </div>
          <DrawerFooter className="w-full">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={() => setCategoryPrivacy(tempPrivacy)}
              >
                Confirm
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PrivacyDrawer;
