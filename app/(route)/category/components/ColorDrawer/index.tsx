import { CATEGORY_COLOR_COUNT } from "@/app/constants";
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
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

const ColorDrawer = () => {
  const { category, setCategoryColor } = useCategoryStore();
  const { color } = category;

  const [tempColor, setTempColor] = useState<string>(`category${color}`);

  const numbers = Array.from(
    { length: CATEGORY_COLOR_COUNT },
    (_, index) => index + 1
  );

  return (
    <Drawer>
      <DrawerTrigger className=" text-sm font-medium text-white flex items-center">
        <div
          className={clsx("rounded-full w-6 h-6 cursor-pointer", `bg-${color}`)}
        />
        <MdArrowDropDown className="text-neutral-600 w-5 h-5" />
      </DrawerTrigger>
      <DrawerContent className="  bg-neutral-800 border-none">
        <div className="mx-auto w-full max-w-sm flex flex-col items-center">
          <DrawerHeader>
            <DrawerTitle className="text-center text-white">Color</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-wrap gap-4 w-full max-w-60 justify-evenly">
            {numbers.map((number) => (
              <div
                key={`category-color-${number}`}
                className={clsx(
                  "rounded-full w-8 h-8 cursor-pointer",
                  `bg-category${number}`,
                  {
                    "outline outline-1 outline-offset-4  outline-neutral-400":
                      `category${number}` === tempColor,
                  }
                )}
                onClick={() => setTempColor(`category${number}`)}
              />
            ))}
          </div>
          <DrawerFooter className="w-full">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={() => setCategoryColor(tempColor)}
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

export default ColorDrawer;
