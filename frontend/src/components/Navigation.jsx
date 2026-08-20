import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>MedCare Plus</h2>
      </div>
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Home
        </NavLink>
        <span className="nav-divider">|</span>
        <NavLink
          to="/doctors"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Doctors
        </NavLink>
        <span className="nav-divider">|</span>
        <NavLink
          to="/booking"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Booking
        </NavLink>
      </div>
    </nav>
  );
}