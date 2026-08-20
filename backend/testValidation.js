import Patient from "./models/Patient.js";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";

console.log("=========================================");
console.log("TASK 5: MONGOOSE SCHEMA VALIDATION TESTS");
console.log("=========================================\n");

function formatErrorResponse(err) {
  if (err.name === "ValidationError") {
    const details = Object.keys(err.errors).map(field => ({
      field,
      message: err.errors[field].message
    }));
    return {
      success: false,
      errorType: "ValidationError",
      message: err.message,
      details
    };
  }
  return {
    success: false,
    message: err.message || "Unknown error"
  };
}

async function validateDocument(doc) {
  try {
    await doc.validate();
    return null;
  } catch (err) {
    return err;
  }
}

async function runValidationTests() {
  // Test 1: Patient Schema - Invalid Blood Group
  console.log("--- Test 1: Invalid Blood Group ---");
  const invalidPatient = new Patient({
    name: "John Doe",
    email: "john@example.com",
    bloodGroup: "Z+" // Invalid blood group
  });
  const err1 = await validateDocument(invalidPatient);
  if (err1) {
    console.log("Validation Failure Caught Successfully:");
    console.log(JSON.stringify(formatErrorResponse(err1), null, 2));
  } else {
    console.log("Passed unexpectedly!");
  }
  console.log("\n");

  // Test 2: Patient Schema - Missing Required Field (Name)
  console.log("--- Test 2: Missing Required Field (Name) ---");
  const missingNamePatient = new Patient({
    email: "noname@example.com"
  });
  const err2 = await validateDocument(missingNamePatient);
  if (err2) {
    console.log("Validation Failure Caught Successfully:");
    console.log(JSON.stringify(formatErrorResponse(err2), null, 2));
  } else {
    console.log("Passed unexpectedly!");
  }
  console.log("\n");

  // Test 3: Appointment Schema - Reason Exceeding 300 Characters
  console.log("--- Test 3: Reason Exceeding 300 Characters ---");
  const longReasonAppointment = new Appointment({
    patientId: "650000000000000000000001",
    doctorId: "650000000000000000000002",
    date: new Date(),
    timeSlot: "10:00 AM",
    status: "pending",
    reason: "A".repeat(305) // 305 characters
  });
  const err3 = await validateDocument(longReasonAppointment);
  if (err3) {
    console.log("Validation Failure Caught Successfully:");
    console.log(JSON.stringify(formatErrorResponse(err3), null, 2));
  } else {
    console.log("Passed unexpectedly!");
  }
  console.log("\n");

  // Test 4: Appointment Schema - Invalid Status
  console.log("--- Test 4: Invalid Appointment Status ---");
  const invalidStatusAppointment = new Appointment({
    patientId: "650000000000000000000001",
    doctorId: "650000000000000000000002",
    date: new Date(),
    timeSlot: "10:00 AM",
    status: "completed" // Invalid, must be pending/confirmed/cancelled
  });
  const err4 = await validateDocument(invalidStatusAppointment);
  if (err4) {
    console.log("Validation Failure Caught Successfully:");
    console.log(JSON.stringify(formatErrorResponse(err4), null, 2));
  } else {
    console.log("Passed unexpectedly!");
  }
  console.log("\n");

  // Test 5: Valid Appointment Schema Creation
  console.log("--- Test 5: Valid Schema Creation ---");
  const validAppointment = new Appointment({
    patientId: "650000000000000000000001",
    doctorId: "650000000000000000000002",
    date: new Date("2026-08-25"),
    timeSlot: "10:00 AM",
    status: "confirmed",
    reason: "Routine Dental Checkup"
  });
  const err5 = await validateDocument(validAppointment);
  if (!err5) {
    console.log("Schema Validated Successfully! Created Object:");
    console.log(JSON.stringify(validAppointment, null, 2));
  } else {
    console.log("Failed unexpectedly:", err5.message);
  }
}

runValidationTests();
