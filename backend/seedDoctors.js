import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Anjali Mehta",
    email: "anjali.mehta@medcareplus.com",
    specialisation: "Cardiology",
    experience: 10,
    available: true
  },
  {
    name: "Dr. Rahul Shah",
    email: "rahul.shah@medcareplus.com",
    specialisation: "Dermatology",
    experience: 8,
    available: false
  },
  {
    name: "Dr. Neha Patel",
    email: "neha.patel@medcareplus.com",
    specialisation: "Pediatrics",
    experience: 6,
    available: true
  }
];

const seedDoctors = async () => {
  try {
    await connectDB();

    await Doctor.deleteMany({});

    await Doctor.insertMany(doctors);

    console.log("Doctors added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error adding doctors:", error);
    process.exit(1);
  }
};

seedDoctors();