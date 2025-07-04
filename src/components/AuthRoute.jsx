import { Navigate } from "react-router-dom";

// Helper to get role from token
function getUserRole() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
  return null;
}

// PublicRoute: accessible only if NOT logged in; logged in users get redirected
export function PublicRoute({ children }) {
  const role = getUserRole();
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (role === "user") {
    return <Navigate to="/events" replace />;
  }
  return children;
}

// AdminRoute: only admins can access
export function AdminRoute({ children }) {
  const role = getUserRole();
  if (role === "admin") {
    return children;
  } else if (role === "user") {
    return <Navigate to="/events" replace />;
  }
  return <Navigate to="/" replace />;
}

// UserRoute: only users can access
export function UserRoute({ children }) {
  const role = getUserRole();
  if (role === "user") {
    return children;
  } else if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/" replace />;
}

// PublicOrUserRoute: accessible to logged out users AND normal users; but NOT admins
export function PublicOrUserRoute({ children }) {
  const role = getUserRole();
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
