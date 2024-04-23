import { IoIosArrowBack } from "@react-icons/all-files/io/IoIosArrowBack";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { back } = useRouter();

  return (
    <header className="flex text-white items-center h-16 w-full">
      <IoIosArrowBack
        className="cursor-pointer absolute left-4"
        fontSize={"24px"}
        onClick={() => back()}
      />
      <h1 className="flex w-full font-bold justify-center">{title}</h1>
    </header>
  );
};

export default Header;
