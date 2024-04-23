"use client";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

const Feed = () => {
  const router = useRouter();
  const params = useParams<{ uid: string }>();
  const { uid } = params;

  const { isPending, error, data } = useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      alert(typeof uid);
      const q = query(
        collection(db, "user"),
        where("uid", "==", uid.toString())
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      alert(JSON.stringify(posts));
      return posts;
    },
    enabled: !!uid,
  });

  // const [uid, setUid] = useState<string>();

  // useEffect(() => {
  //   if (params.uid === "") {
  //     alert("in");
  //     onAuthStateChanged(auth, (user) => {
  //       setUid(user?.uid);
  //     });
  //   }

  //   alert("out");
  //   setUid(params.uid);
  // }, []);

  const logOut = async () => {
    await signOut(auth);
    return router.replace("/");
  };

  if (isPending) return null;

  return (
    <>
      <h1 className="text-white">Feed Page</h1>
      <p className="text-white">{data?.map((v) => JSON.stringify(v))}</p>
      <Button onClick={logOut}>Log out</Button>
    </>
  );
};

export default Feed;
