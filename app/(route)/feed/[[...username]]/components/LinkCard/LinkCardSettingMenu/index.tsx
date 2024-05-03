import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TfiMoreAlt } from "react-icons/tfi";

interface LinkCardSettingMenuProps {
  deleteLink: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const LinkCardSettingMenu = ({ deleteLink }: LinkCardSettingMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-2 right-2 bg-white bg-opacity-50  rounded-md w-7 h-5  flex justify-center items-center shadow-md">
        <TfiMoreAlt />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={deleteLink}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LinkCardSettingMenu;
