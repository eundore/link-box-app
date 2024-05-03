import useCategoryStore from "@/app/store/useCategoryStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ConfirmDialog = () => {
  const { back } = useRouter();
  const { category } = useCategoryStore();
  const { id } = category;

  const queryClient = useQueryClient();

  const deleteCategory = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    const categoryRef = doc(db, "category", `${id}`);
    await deleteDoc(categoryRef);

    queryClient.invalidateQueries({ queryKey: ["useCategoryQuery"] });

    back();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-6 text-red-800 bg-neutral-900 hover:bg-neutral-950">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-none">
        <DialogHeader>
          <DialogDescription className="text-white text-center">
            Do you want to delete the category?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 ">
          <DialogClose asChild>
            <Button className="text-white bg-neutral-700 hover:bg-neutral-700 w-full font-light">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className=" bg-neutral-700 hover:bg-neutral-700 w-full font-light"
            onClick={deleteCategory}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
