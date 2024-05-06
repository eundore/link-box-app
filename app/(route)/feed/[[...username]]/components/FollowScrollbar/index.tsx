import { Follow, User, UserFollow } from "@/app/types/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";

const FollowScrollbar = () => {
  const { push } = useRouter();

  const {
    isFetched,
    data: following,
    refetch,
  } = useQuery({
    queryKey: ["useFollowingQuery", auth.currentUser?.uid],
    queryFn: async () => {
      const q = query(
        collection(db, "follow"),
        where("follower", "==", auth.currentUser?.uid),
        limit(10)
      );
      const querySnapshot = await getDocs(q);

      const posts: Array<UserFollow> = [];

      for (const doc of querySnapshot.docs) {
        const Following: Follow = doc.data();
        const { following } = Following;

        const q = query(collection(db, "user"), where("uid", "==", following));
        const querySnapshot = await getDocs(q);

        const user: User = querySnapshot.docs[0].data();

        const { username, imageUrl } = user;

        posts.push({
          id: doc.id,
          username,
          imageUrl,
          ...Following,
        });
      }

      return posts;
    },
    enabled: !!auth.currentUser?.uid,
  });

  return (
    <div
      className="flex gap-4 overflow-auto px-4"
      style={{ scrollbarWidth: "none" }}
    >
      {following?.map(({ imageUrl, username }, index) => (
        <div
          key={`following-${index}`}
          className="flex flex-col justify-center items-center gap-2"
        >
          <Avatar
            className="w-12 h-12 cursor-pointer"
            onClick={() => push(`/feed/${username}`)}
          >
            <AvatarImage src={imageUrl} alt="profile-image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-white text-[10px] font-medium">{username}</p>
        </div>
      ))}
      <div className="flex flex-col justify-center items-center gap-2">
        <Avatar
          className="w-12 h-12 cursor-pointer"
          onClick={() => push(`/follow`)}
        >
          <AvatarFallback className="bg-neutral-600">
            <IoIosArrowForward fontSize={20} className="text-white" />
          </AvatarFallback>
        </Avatar>
        <p className="h-4" />
      </div>
    </div>
  );
};

export default FollowScrollbar;
