import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["history", "prescription", "diagnostic_report"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, maxlength: 2000 },
    fileUrl: { type: String, default: null },
    fileKey: { type: String, default: null }, // storage key/path for signed-URL regeneration
    mimeType: { type: String, default: null },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ patient: 1, createdAt: -1 });

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
