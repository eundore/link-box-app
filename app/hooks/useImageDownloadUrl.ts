import { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import useUserStore from "../store/useUserStore";

const useImageDownloadUrl = () => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const storage = getStorage();
  const { user } = useUserStore();
  const { imageUrl } = user;

  useEffect(() => {
    if (!imageUrl) return;

    const getImageUrl = async () => {
      try {
        const storageRef = ref(storage, imageUrl);
        const url = await getDownloadURL(storageRef);
        setDownloadUrl(url);
      } catch (error) {
        console.error("Error getting download URL: ", error);
      }
    };

    getImageUrl();
  }, [imageUrl, storage]);

  return downloadUrl;
};

export default useImageDownloadUrl;
