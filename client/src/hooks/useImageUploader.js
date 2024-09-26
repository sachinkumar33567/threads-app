export default function useImageUploader() {
  const handleImageUpload = async (imgURL) => {
    const formData = new FormData();
    formData.append("file", imgURL);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET_NAME);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        {
          method: "post",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.log("Couldn't upload image");
    }
  };
  return { handleImageUpload };
}
