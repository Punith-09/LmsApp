import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    introVideo: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sections: [sectionSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    enrolledUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
