import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import User from "@/schema/user";
import PDFDocument from "pdfkit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

 
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${course.title.replace(/\s+/g, "_")}_Certificate.pdf"`
    );

    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      autoFirstPage: true,
    });

    doc.pipe(res); 

    const { width, height } = doc.page;

   
    doc.save();
    doc.rect(0, 0, width, height).fill("#fffaf0");
    doc.restore();

    
    doc.lineWidth(6).strokeColor("#b8860b");
    doc.rect(35, 35, width - 70, height - 70).stroke();

   
    doc
      .font("Helvetica-Bold")
      .fontSize(46)
      .fillColor("#2c3e50")
      .text("Certificate of Completion", 0, 120, {
        align: "center",
      });

  
    doc
      .font("Helvetica")
      .fontSize(20)
      .fillColor("#2c3e50")
      .text("This is to certify that", 0, 200, { align: "center" });

    doc
      .font("Helvetica-Bold")
      .fontSize(32)
      .fillColor("#006400")
      .text(user.name, 0, 240, { align: "center" });

    doc
      .font("Helvetica")
      .fontSize(20)
      .fillColor("#2c3e50")
      .text("has successfully completed the course", 0, 290, { align: "center" });

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#4b0082")
      .text(course.title, 0, 330, { align: "center" });

   
    doc
      .font("Helvetica-Oblique")
      .fontSize(16)
      .fillColor("#2c3e50")
      .text(`Awarded on ${new Date().toLocaleDateString()}`, 0, 400, {
        align: "center",
      });

  
    const sigY = 480;
    const centerX = width / 2;
    doc.moveTo(centerX - 100, sigY).lineTo(centerX + 100, sigY).stroke("#2c3e50");
    doc.font("Helvetica").fontSize(14).fillColor("#2c3e50")
      .text("Authorized Signature", 0, sigY + 10, { align: "center" });

   
    doc.fontSize(12).fillColor("#555")
      .text("© 2025 LMS Platform", 0, height - 60, { align: "center" });

    
    doc.end();
  } catch (error: any) {
    console.error("Certificate generation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
