import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },

    reason: {
      type: String,
      maxlength: [300, "reason must not exceed 300 characters"]
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;