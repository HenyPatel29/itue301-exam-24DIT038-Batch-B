export default function AppointmentCard({
  patientName,
  doctorName,
  date,
  timeSlot,
  status
}) {
  return (
    <div className="appointment-card">
      <div className="card-header">
        <h3>Appointment</h3>
        <span className={`status status-${status}`}>
          {status}
        </span>
      </div>

      <div className="card-body">
        <p>
          <strong>Patient:</strong> {patientName}
        </p>

        <p>
          <strong>Doctor:</strong> {doctorName}
        </p>

        <p>
          <strong>Date:</strong> {date}
        </p>

        <p>
          <strong>Time Slot:</strong> {timeSlot}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`status status-${status}`}>
            {status}
          </span>
        </p>
      </div>
    </div>
  );
}