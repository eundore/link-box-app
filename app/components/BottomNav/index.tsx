import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { MdMessage } from "react-icons/md";

const BottomNavMenu = [
  {
    title: "Feed",
    icon: <FaHome fontSize={20} className="text-white" />,
  },
  {
    title: "Search",
    icon: <FaSearch fontSize={20} className="text-white" />,
  },
  {
    title: "Message",
    icon: <MdMessage fontSize={20} className="text-white" />,
  },
  {
    title: "My",
    icon: <IoPerson fontSize={20} className="text-white" />,
  },
];

const BottomNav = () => {
  return (
    <>
      <div className="bg-transparent w-full h-20 mt-2" />
      <div className=" bg-black w-full h-20 fixed bottom-0 left-0">
        <div className="flex w-full justify-evenly h-full">
          {BottomNavMenu.map(({ title, icon }, index) => (
            <Link
              key={`bottom-nav-menu-${index}`}
              className="flex flex-col h-full justify-center gap-2 items-center"
              href={`/${title.toLowerCase()}`}
            >
              {icon}
              <p className="text-white text-xs">{title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default BottomNav;
