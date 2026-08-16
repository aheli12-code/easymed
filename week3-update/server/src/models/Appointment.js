import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["booked", "rescheduled", "cancelled", "completed"],
      default: "booked",
    },
    reason: { type: String, trim: true, maxlength: 500 },
    // Set when a video consult is linked (Week 5 telemedicine)
    telemedicineRoomId: { type: String, default: null },
  },
  { timestamps: true }
);

// A doctor can't be double-booked for overlapping time ranges
appointmentSchema.index({ doctor: 1, startsAt: 1, endsAt: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
