import { useEffect, useState } from "react";

export default function DoctorsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/doctors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        return response.json();
      })
      .then((doctors) => {
        setData(doctors);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading doctors...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container error-container">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Doctors List</h1>

      <div className="doctors-grid">
        {data.map((doctor, index) => (
          <div key={doctor._id || doctor.id || index} className="doctor-card">
            <h2>{doctor.name}</h2>
            <p>
              <strong>Specialisation:</strong> {doctor.specialisation}
            </p>
            {doctor.email && (
              <p>
                <strong>Email:</strong> {doctor.email}
              </p>
            )}
            <p>
              <strong>Availability:</strong>{" "}
              <span className={doctor.available ? "badge available" : "badge unavailable"}>
                {doctor.available ? "Available" : "Not Available"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}