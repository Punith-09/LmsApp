
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: String }],
    lastWatchedLesson: { type: String },   
    lastTimestamp: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

export default mongoose.models.Progress || mongoose.model("Progress", progressSchema);
