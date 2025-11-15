import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";


export const config = {
  api: {
    bodyParser: false,
  },
};


const uploadDir = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ message: "Upload failed", error: err });
    }

    try {
      const uploadedFiles: any[] = [];

      for (const key in files) {
        const fileData = files[key];

        
        const fileArray = Array.isArray(fileData) ? fileData : [fileData];

        for (const file of fileArray) {
           if (!file || !file.filepath) {
    continue; 
  }
          const tempPath = file.filepath;
          const fileExt = path.extname(file.originalFilename || "");
          const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}${fileExt}`;
          const finalPath = path.join(uploadDir, uniqueName);

         
          fs.renameSync(tempPath, finalPath);

          uploadedFiles.push({
            originalFilename: file.originalFilename,
            path: `/uploads/${uniqueName}`,
            mimetype: file.mimetype,
            size: file.size,
          });
        }
      }

      return res.status(200).json({ message: "Upload successful", files: uploadedFiles });
    } catch (error) {
      console.error("Upload server error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}
