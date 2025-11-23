import  baseUrl  from "../utils/constant";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      console.log("Uploaded File URL:", data.fileUrl);
      return data.fileUrl;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};