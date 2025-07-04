import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.get("/users/events").then((res) => setEvents(res.data));
        const token = localStorage.getItem('token');
    
      api.get("/users/my-registrations")
        .then((res) => setRegisteredEvents(res.data))
        .catch((err) => console.error("Failed to fetch registrations:", err));
  }
  }, []);

  const registerEvent = async (id) => {
    try {
      await api.post("/users/register-event", { eventId: id });
      alert("Registered! Confirmation email sent.");
      setRegisteredEvents((prev) => [...prev, id]);
    } catch (err) {
      console.log(err.response?.data?.msg || "Error");
      alert("Please Login First :)");
      navigate("/login");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold">Upcoming Events</h2>
      <div className="row">
        {events.map((e) => (
          <div className="col-md-4 mb-4" key={e._id}>
            <div className="card h-100 shadow-sm border-0 rounded-4 hover-zoom">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-semibold mb-2">{e.title}</h5>
                <p className="card-text text-muted small mb-3">
                  {e.description}
                </p>
                <div className="mt-auto">
                  <p className="mb-1 text-secondary small">
                    📅 {new Date(e.date).toLocaleString()}
                  </p>
                  <p className="mb-3 text-secondary small">
                    📍 <strong>{e.location}</strong>
                  </p>
                  {!registeredEvents.includes(e._id) ? (
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => registerEvent(e._id)}
                    >
                      Register
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm w-100" disabled>
                      Registered
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .hover-zoom:hover {
          transform: translateY(-4px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}
