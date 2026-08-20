import { useState, useEffect } from "react";

export default function BookingPage() {
  const [form, setForm] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    bloodGroup: "",
    age: "",
    doctorName: "",
    date: "",
    timeSlot: "",
    reason: ""
  });

  const [doctorsList, setDoctorsList] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Optionally populate doctor dropdown from backend
    fetch("http://localhost:5000/api/v1/doctors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDoctorsList(data);
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitStatus({ loading: true, message: "Booking appointment..." });

    fetch("http://localhost:5000/api/v1/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: form.patientName,
        patientEmail: form.patientEmail,
        patientPhone: form.patientPhone,
        bloodGroup: form.bloodGroup,
        age: form.age,
        doctorName: form.doctorName,
        date: form.date,
        timeSlot: form.timeSlot,
        reason: form.reason,
        status: "pending"
      })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Failed to book appointment");
          });
        }
        return res.json();
      })
      .then((data) => {
        setSubmitStatus({
          success: true,
          message: `Appointment successfully booked for ${form.patientName} with ${form.doctorName}!`
        });
        setForm({
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          bloodGroup: "",
          age: "",
          doctorName: "",
          date: "",
          timeSlot: "",
          reason: ""
        });
      })
      .catch((err) => {
        setSubmitStatus({
          success: false,
          message: err.message
        });
      });
  }

  return (
    <div className="page-container">
      <h1>Book Appointment</h1>

      <form className="booking-form" onSubmit={handleSubmit}>
        <h3>Patient Details</h3>

        <div className="form-group">
          <label htmlFor="patientName">Patient Name</label>
          <input
            id="patientName"
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientEmail">Email</label>
          <input
            id="patientEmail"
            type="email"
            name="patientEmail"
            value={form.patientEmail}
            onChange={handleChange}
            placeholder="Enter patient email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientPhone">Phone</label>
          <input
            id="patientPhone"
            type="tel"
            name="patientPhone"
            value={form.patientPhone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group</label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
          >
            <option value="">-- Select Blood Group --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
            min="0"
            max="120"
          />
        </div>

        <hr />
        <h3>Appointment Details</h3>

        <div className="form-group">
          <label htmlFor="doctorName">Doctor Name</label>
          {doctorsList.length > 0 ? (
            <select
              id="doctorName"
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Doctor --</option>
              {doctorsList.map((doc, i) => (
                <option key={doc._id || doc.id || i} value={doc.name}>
                  {doc.name} ({doc.specialisation})
                </option>
              ))}
            </select>
          ) : (
            <input
              id="doctorName"
              type="text"
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              placeholder="Enter doctor name"
              required
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeSlot">Time Slot</label>
          <input
            id="timeSlot"
            type="text"
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            placeholder="Example: 10:00 AM"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason (Optional)</label>
          <input
            id="reason"
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason for visit"
          />
        </div>

        <button type="submit" className="submit-btn">
          Book Appointment
        </button>
      </form>

      {submitStatus && (
        <div className={submitStatus.success ? "status-alert success" : "status-alert error"}>
          {submitStatus.message}
        </div>
      )}

      <div className="live-preview-box">
        <h3>Live Form Data</h3>
        <p><strong>Patient Name:</strong> {form.patientName || "—"}</p>
        <p><strong>Email:</strong> {form.patientEmail || "—"}</p>
        <p><strong>Phone:</strong> {form.patientPhone || "—"}</p>
        <p><strong>Blood Group:</strong> {form.bloodGroup || "—"}</p>
        <p><strong>Age:</strong> {form.age || "—"}</p>
        <p><strong>Doctor:</strong> {form.doctorName || "—"}</p>
        <p><strong>Date:</strong> {form.date || "—"}</p>
        <p><strong>Time Slot:</strong> {form.timeSlot || "—"}</p>
      </div>
    </div>
  );
}