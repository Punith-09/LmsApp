import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import os from "os";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

const hasCloudinary =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    multiples: true,
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ message: "Upload parsing failed", error: String(err) });
    }

    try {
      const uploadedFiles: any[] = [];

      for (const key in files) {
        const fileData = files[key];
        const fileArray = Array.isArray(fileData) ? fileData : [fileData];

        for (const file of fileArray) {
          if (!file || !file.filepath) continue;

          const tempPath = file.filepath;

          if (hasCloudinary) {
            try {
              // Upload directly to Cloudinary
              const result = await cloudinary.uploader.upload(tempPath, {
                folder: "lms_courses",
                resource_type: "auto",
              });

              // Clean up temp file
              if (fs.existsSync(tempPath)) {
                try { fs.unlinkSync(tempPath); } catch (e) {}
              }

              uploadedFiles.push({
                originalFilename: file.originalFilename,
                path: result.secure_url,
                mimetype: file.mimetype,
                size: file.size,
              });
            } catch (cloudErr: any) {
              console.error("Cloudinary upload failed:", cloudErr);
              return res.status(500).json({
                message: `Cloudinary upload error: ${cloudErr.message || "Failed to upload to Cloudinary"}`,
              });
            }
          } else {
            console.warn(
              "[Upload API] Cloudinary env vars missing. Saving file to local /public/uploads."
            );
            const localUploadDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(localUploadDir)) {
              try { fs.mkdirSync(localUploadDir, { recursive: true }); } catch (e) {}
            }

            const fileExt = path.extname(file.originalFilename || "");
            const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}${fileExt}`;
            const finalPath = path.join(localUploadDir, uniqueName);

            try {
              fs.copyFileSync(tempPath, finalPath);
              if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            } catch (copyErr) {
              console.error("Local save error:", copyErr);
            }

            uploadedFiles.push({
              originalFilename: file.originalFilename,
              path: `/uploads/${uniqueName}`,
              mimetype: file.mimetype,
              size: file.size,
            });
          }
        }
      }

      return res.status(200).json({ message: "Upload successful", files: uploadedFiles });
    } catch (error: any) {
      console.error("Upload server error:", error);
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
}

