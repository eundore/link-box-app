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

const SettingMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-4 right-4">
        <CiCircleMore fontSize={28} className="text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={"/editProfile"}>
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
  );
};

export default SettingMenu;
