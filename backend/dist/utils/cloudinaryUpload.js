"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleToCloudinary = exports.uploadBufferToCloudinary = void 0;
const cloudinary_js_1 = __importDefault(require("../config/cloudinary.js"));
// multer এর memory buffer কে Cloudinary তে upload করে secure_url ফেরত দেয়
const uploadBufferToCloudinary = (buffer, folder = "products") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_js_1.default.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
// একসাথে অনেকগুলা file upload করার জন্য (Promise.all দিয়ে parallel)
const uploadMultipleToCloudinary = async (files, folder = "products") => {
    const uploadPromises = files.map((file) => (0, exports.uploadBufferToCloudinary)(file.buffer, folder));
    return Promise.all(uploadPromises);
};
exports.uploadMultipleToCloudinary = uploadMultipleToCloudinary;
