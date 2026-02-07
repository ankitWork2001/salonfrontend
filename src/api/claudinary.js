const CLOUD_NAME = "dzkiozbbk";
const UPLOAD_PRESET = "Salon_Project";

/**
 * Uploads an image URI (string) to Cloudinary
 * @param {string} uri - Local image URI
 * @returns {string} - Secure Cloudinary URL
 */
export const uploadImageToCloudinary = async (uri) => {
  try {
    if (!uri) throw new Error("No image URI provided");

    // Extract filename and type
    const fileName = uri.split('/').pop();
    const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append("file", { uri, name: fileName, type: fileType });
    formData.append("upload_preset", UPLOAD_PRESET);

    console.log("Uploading to Cloudinary:", uri);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await response.json();

    if (!data.secure_url) {
      console.error("Cloudinary response error:", data);
      throw new Error("Image upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};


// const YOUR_CLOUD_NAME = "dzkiozbbk";
// const YOUR_CLOUDINARY_PRESET = "Salon_Project";

// export const uploadImageToCloudinary = async (file) => {
//   const formData = new FormData();
//   formData.append("file", {
//     uri: file.uri,
//     name: file.fileName || "image.png",
//     type: file.type || "image/png",
//   });
//   formData.append("upload_preset", YOUR_CLOUDINARY_PRESET);
//   console.log("Uploading image to Cloudinary:", file.uri);

//   try {
//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     return data.secure_url; // URL of uploaded image
//   } catch (err) {
//     throw new Error(err.message || "Cloudinary upload failed");
//   }
// };
