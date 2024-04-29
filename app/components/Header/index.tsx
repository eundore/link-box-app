import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  button?: ReactNode;
}

const Header = ({ title, button }: HeaderProps) => {
  const { back } = useRouter();

  return (
    <header className="flex text-white items-center h-16 w-full">
      <IoIosArrowBack
        className="cursor-pointer absolute left-4"
        fontSize={"24px"}
        onClick={() => back()}
      />
      <h1 className="flex w-full font-bold justify-center">{title}</h1>
      <div className="absolute right-4">{button}</div>
    </header>
  );
};

export default Header;
