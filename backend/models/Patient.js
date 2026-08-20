import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
      ]
    },

    age: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;