import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";

import HomePage from "./pages/HomePage";
import DoctorsPage from "./pages/DoctorsPage";
import BookingPage from "./pages/BookingPage";

function App() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </>
  );
}

export default App;