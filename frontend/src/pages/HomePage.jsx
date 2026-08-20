import { useEffect, useState } from "react";
import AppointmentCard from "../components/AppointmentCard";

export default function HomePage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/appointments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Hospital Appointment System</h1>
        <p className="subtitle">Welcome to MedCare Plus Hospital.</p>
      </div>

      <div className="section">
        <h2>Live Appointments (API Data)</h2>
        {appointments.length > 0 ? (
          <div className="appointments-grid">
            {appointments.map((item, index) => {
              const patientName =
                item.patientId?.name || item.patientName || "Patient";
              const doctorName =
                item.doctorId?.name || item.doctorName || "Doctor";
              const formattedDate = item.date
                ? new Date(item.date).toLocaleDateString()
                : "25/08/2026";
              return (
                <AppointmentCard
                  key={item._id || index}
                  patientName={patientName}
                  doctorName={doctorName}
                  date={formattedDate}
                  timeSlot={item.timeSlot}
                  status={item.status}
                />
              );
            })}
          </div>
        ) : (
          <p>No active appointments retrieved from API.</p>
        )}
      </div>

      <div className="section">
        <h2>Demonstration Appointment Cards (Prop & Status Test)</h2>
        <div className="appointments-grid">
          <AppointmentCard
            patientName="Rahul Patel"
            doctorName="Dr. Amit Shah"
            date="25/08/2026"
            timeSlot="10:00 AM"
            status="confirmed"
          />

          <AppointmentCard
            patientName="Priya Sharma"
            doctorName="Dr. Anjali Mehta"
            date="26/08/2026"
            timeSlot="11:30 AM"
            status="pending"
          />

          <AppointmentCard
            patientName="Vikram Singh"
            doctorName="Dr. Rahul Shah"
            date="27/08/2026"
            timeSlot="02:00 PM"
            status="cancelled"
          />
        </div>
      </div>
    </div>
  );
}