import { Avatar } from "@/components/ui/avatar";
import { auth, db } from "@/firebase";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Profile {
  username: string;
  description?: string;
  imageUrl?: string;
}

const Profile = () => {
  const { uid } = auth.currentUser ?? {};

  const {
    isPending,
    error,
    data: userData,
  } = useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      const q = query(
        collection(db, "user"),
        where("uid", "==", uid?.toString())
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      return posts;
    },
    enabled: !!uid,
  });

  if (isPending) return null;

  return (
    <div className="flex mt-16 gap-8 mx-4">
      <Avatar className="w-20 h-20 bg-white">
        {/* {userData?.[0].imageUrl && (
          <AvatarImage src={userData?.[0].imageUrl} alt="profile-image" />
        )} */}
      </Avatar>
      <div className="flex flex-col justify-center gap-2">
        <h1 className="text-white font-bold">{userData?.[0].username}</h1>
        <p className="text-sm text-gray-400">{userData?.[0].desciption}</p>
      </div>
    </div>
  );
};

export default Profile;
