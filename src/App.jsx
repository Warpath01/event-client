import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import AdminDashboard from "./pages/Admin";
import {
  PublicRoute,
  AdminRoute,
  UserRoute,
  PublicOrUserRoute,
} from "./components/AuthRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <PublicOrUserRoute>
                <Home />
              </PublicOrUserRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PublicOrUserRoute>
                <Events />
              </PublicOrUserRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
