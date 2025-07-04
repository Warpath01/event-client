import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [selectedEventAttendees, setSelectedEventAttendees] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState(""); // ✅ keep track of which event
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  useEffect(() => {
    api.get("/admin/users").then((res) => setUsers(res.data));
    api.get("/admin/events").then((res) => setEvents(res.data));
    api.get("/admin/registrations").then((res) => setRegistrations(res.data));
  }, []);

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter((u) => u._id !== id));
  };

  const deleteEvent = async (id) => {
    await api.delete(`/admin/events/${id}`);
    setEvents(events.filter((e) => e._id !== id));
  };

  const deleteRegistration = async (id) => {
    try {
      await api.delete(`/admin/registrations/${id}`);
      setRegistrations(registrations.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("events", newEvent);
      setEvents([...events, res.data]);
      setShowModal(false);
      setNewEvent({ title: "", description: "", date: "", location: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewAttendees = async (eventId, eventTitle) => {
    try {
      const res = await api.get(`/admin/events/${eventId}/attendees`);
      setSelectedEventAttendees(res.data);
      setSelectedEventTitle(eventTitle); // set event title
      setShowAttendeesModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={showModal ? "blur-background" : ""}>
      <h2 className="fs-4 mb-4 text-secondary">Admin Dashboard</h2>

      <h4 className="mb-3 d-flex align-items-center fs-5 text-secondary">
        Users
      </h4>
      <ul className="list-group mb-3">
        {users.map((u) => (
          <li
            key={u._id}
            className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row fs-6"
          >
            <div>
              <strong>Name:</strong> {u.name} <span className="mx-2">|</span>{" "}
              <strong>Email:</strong> {u.email}
            </div>
            <button
              className="btn btn-danger btn-sm mt-2 mt-md-0"
              onClick={() => deleteUser(u._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h4 className="mb-3 d-flex align-items-center fs-4 text-secondary">
        Events
        <button
          className="btn btn-primary btn-sm ms-3"
          onClick={() => setShowModal(true)}
        >
          + Add Event
        </button>
      </h4>

      <ul className="list-group mb-3">
        {events.map((e) => {
          const attendeesCount = registrations.filter(
            (r) => r.event?._id === e._id
          ).length;

          return (
            <li
              key={e._id}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 fs-6"
            >
              <div className="flex-grow-1">
                <strong>{e.title}</strong>
                <div className="text-muted small">
                  {new Date(e.date).toLocaleString()} |{" "}
                  <b>
                    <i>location:</i>
                  </b>{" "}
                  {e.location} |{" "}
                  <b>
                    <i>attendees:</i>
                  </b>{" "}
                  {attendeesCount}
                  <button
                    className="btn btn-secondary btn-sm ms-2"
                    onClick={() => handleViewAttendees(e._id, e.title)}
                  >
                    View
                  </button>
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm mt-2 mt-md-0"
                onClick={() => deleteEvent(e._id)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      <h4 className="mb-3 fs-5 text-secondary">Registrations</h4>
      <ul className="list-group mb-3">
        {registrations.map((r) => (
          <li
            key={r._id}
            className="list-group-item d-flex justify-content-between align-items-center fs-6"
          >
            <div>
              <strong>{r.user?.name}</strong>
              <div className="text-muted small">
                Registered for {r.event?.title}
              </div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteRegistration(r._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Attendees Modal */}
      {showAttendeesModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow rounded-4">
              <div className="modal-header bg-success text-white rounded-top-4">
                <h5 className="modal-title fw-semibold">
                  Attendees for <em>{selectedEventTitle}</em>
                </h5>
              </div>
              <div className="modal-body">
                {selectedEventAttendees.length > 0 ? (
                  <ul
                    className="list-group list-group-flush"
                    style={{
                      maxHeight: "300px", // adjust height to roughly fit ~5 items
                      overflowY: "auto",
                      paddingRight: "4px", // optional: prevent scrollbar from overlapping content
                    }}
                  >
                    {selectedEventAttendees.map((attendee, index) => (
                      <li
                        key={attendee._id || index}
                        className="list-group-item d-flex align-items-center justify-content-start gap-2 border-0 px-3 py-2"
                        style={{
                          borderRadius: "0.5rem",
                          backgroundColor: "#f8f9fa",
                          marginBottom: "0.5rem",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span className="badge bg-primary rounded-pill">
                          {index + 1}
                        </span>
                        <span className="fw-medium">{attendee.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No attendees registered.</p>
                )}
              </div>
              <div className="modal-footer rounded-bottom-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAttendeesModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddEvent}>
                <div className="modal-header">
                  <h5 className="modal-title fs-5">Add New Event</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body fs-6">
                  <div className="mb-2">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
