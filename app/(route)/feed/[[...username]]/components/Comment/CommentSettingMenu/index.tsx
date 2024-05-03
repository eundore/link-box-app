import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TfiMoreAlt } from "react-icons/tfi";

interface CommentSettingMenuProps {
  deleteComment: () => void;
}

const CommentSettingMenu = ({ deleteComment }: CommentSettingMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" bg-white bg-opacity-80  rounded-md w-7 h-5  flex justify-center items-center shadow-md">
        <TfiMoreAlt />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={deleteComment}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommentSettingMenu;
