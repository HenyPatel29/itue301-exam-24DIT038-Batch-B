import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Patient from "./models/Patient.js";

dotenv.config();

const patients = [
  {
    name: "Kiya",
    email: "kiya@example.com",
    phone: "9876543210",
    bloodGroup: "O+",
    age: 25
  }
];

const seedPatients = async () => {
  try {
    await connectDB();

    await Patient.deleteMany({});

    await Patient.insertMany(patients);

    console.log("Patients added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error adding patients:", error);

    process.exit(1);
  }
};

seedPatients();