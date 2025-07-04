import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role; // make sure your token payload includes { role: "admin" }
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          EventApp
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Show Events link for logged in users who are NOT admin */}
            {role !== "admin" && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " border-bottom border-light" : "")
                  }
                  to="/events"
                >
                  Events
                </NavLink>
              </li>
            )}

            {/* Show Register & Login for guests */}
            {!token && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link" +
                      (isActive ? " border-bottom border-light" : "")
                    }
                    to="/register"
                  >
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link" +
                      (isActive ? " border-bottom border-light" : "")
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {/* Show Logout for logged in users */}
            {token && (
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
