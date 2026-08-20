import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    specialisation: {
      type: String,
      required: true
    },

    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;