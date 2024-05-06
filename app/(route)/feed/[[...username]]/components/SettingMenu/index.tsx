import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { CiCircleMore } from "react-icons/ci";
import { FaBox } from "react-icons/fa";

const SettingMenu = () => {
  return (
    <div className="flex justify-end items-center mx-3 my-4">
      {/* <FaBox fontSize={"20px"} className=" text-white"></FaBox> */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CiCircleMore fontSize={28} className="text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={"/edit-profile"}>
            <DropdownMenuItem className="cursor-pointer">
              Edit Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link href={"/categories"}>
            <DropdownMenuItem className="cursor-pointer">
              Categories
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SettingMenu;
