import cloudinary from "../config/cloudinary.js";

// multer এর memory buffer কে Cloudinary তে upload করে secure_url ফেরত দেয়
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = "products"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// একসাথে অনেকগুলা file upload করার জন্য (Promise.all দিয়ে parallel)
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = "products"
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadBufferToCloudinary(file.buffer, folder));
  return Promise.all(uploadPromises);
};