import { useState } from "react";
import useShowToast from "./useShowToast";

export default function usePreviewImg() {
  const [imgURL, setImgURL] = useState(null);
  const showToast = useShowToast();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Error", "Invalid file type");
      setImgURL(null);
    }
  };
  return { handleImageChange, imgURL, setImgURL };
}
