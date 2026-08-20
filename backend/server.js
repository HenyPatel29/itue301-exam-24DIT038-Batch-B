import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";
import Patient from "./models/Patient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory fallback dataset for Task 3 testing without MongoDB daemon
const inMemoryDoctors = [
  { _id: "doc1", name: "Dr. Anjali Mehta", specialisation: "Cardiology", available: true, email: "anjali.mehta@medcareplus.com" },
  { _id: "doc2", name: "Dr. Rahul Shah", specialisation: "Dermatology", available: false, email: "rahul.shah@medcareplus.com" },
  { _id: "doc3", name: "Dr. Neha Patel", specialisation: "Pediatrics", available: true, email: "neha.patel@medcareplus.com" }
];

const inMemoryPatients = [
  { _id: "pat1", name: "Rahul Patel", email: "rahul.patel@example.com", phone: "9876543210", bloodGroup: "O+", age: 28 },
  { _id: "pat2", name: "Kiya", email: "kiya@example.com", phone: "9876543211", bloodGroup: "A+", age: 25 }
];

const inMemoryAppointments = [
  {
    _id: "app1",
    patientId: inMemoryPatients[0],
    doctorId: inMemoryDoctors[0],
    patientName: "Rahul Patel",
    doctorName: "Dr. Anjali Mehta",
    date: "2026-08-25",
    timeSlot: "10:00 AM",
    status: "confirmed",
    reason: "Regular Consultation"
  }
];

// =======================
// Global Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Request Logger Middleware
// Task 3: Format [METHOD] [PATH] [TIMESTAMP]
// =======================
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.path} [${timestamp}]`);
  next();
}

app.use(requestLogger);

// =======================
// GET All Appointments
// Method: GET
// Endpoint: /api/v1/appointments
// Status: 200
// =======================
app.get("/api/v1/appointments", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const appointments = await Appointment.find()
        .populate("doctorId")
        .populate("patientId");
      return res.status(200).json(appointments);
    }
    return res.status(200).json(inMemoryAppointments);
  } catch (error) {
    next(error);
  }
});

// =======================
// POST New Appointment
// Method: POST
// Endpoint: /api/v1/appointments
// Status: 201 Created / 400 Bad Request
// =======================
app.post("/api/v1/appointments", async (req, res, next) => {
  try {
    const {
      patientId,
      doctorId,
      patientName,
      doctorName,
      date,
      timeSlot,
      status = "pending",
      reason = ""
    } = req.body;

    // Required Field Validation
    if ((!patientId && !patientName) || (!doctorId && !doctorName) || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "patientId/patientName, doctorId/doctorName, date and timeSlot are required"
      });
    }

    // Status Validation
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be pending, confirmed or cancelled"
      });
    }

    // Reason Validation
    if (reason && reason.length > 300) {
      return res.status(400).json({
        success: false,
        message: "reason must not exceed 300 characters"
      });
    }

    // Save to Database if connected, else update in-memory array
    if (mongoose.connection.readyState === 1 && patientId && doctorId) {
      const appointment = await Appointment.create({
        patientId,
        doctorId,
        date,
        timeSlot,
        status,
        reason
      });
      const populated = await Appointment.findById(appointment._id)
        .populate("doctorId")
        .populate("patientId");
      return res.status(201).json(populated);
    }

    // Fallback in-memory insertion
    const newAppointment = {
      _id: "app_" + Date.now(),
      patientId: patientId || "pat_demo",
      doctorId: doctorId || "doc_demo",
      patientName: patientName || "Patient",
      doctorName: doctorName || "Doctor",
      date,
      timeSlot,
      status,
      reason
    };
    inMemoryAppointments.push(newAppointment);

    return res.status(201).json(newAppointment);

  } catch (error) {
    next(error);
  }
});

// =======================
// GET All Doctors
// Method: GET
// Endpoint: /api/v1/doctors
// Status: 200
// =======================
app.get("/api/v1/doctors", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const doctors = await Doctor.find();
      if (doctors.length > 0) {
        return res.status(200).json(doctors);
      }
    }
    return res.status(200).json(inMemoryDoctors);
  } catch (error) {
    next(error);
  }
});

// =======================
// GET All Patients
// Method: GET
// Endpoint: /api/v1/patients
// Status: 200
// =======================
app.get("/api/v1/patients", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const patients = await Patient.find();
      if (patients.length > 0) {
        return res.status(200).json(patients);
      }
    }
    return res.status(200).json(inMemoryPatients);
  } catch (error) {
    next(error);
  }
});

// =======================
// Global Error Handler Middleware
// Must be last middleware in application
// Returns structured JSON response
// =======================
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught:", err.message || err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// Connect MongoDB and Start Server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});