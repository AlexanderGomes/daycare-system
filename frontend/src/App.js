import React from "react";
import { Welcome, Register, Login, Calendar } from "./pages";
import { Navbar } from "./components";
import "./App.css";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/calendar" element={user ? <Calendar /> : <Login />} />
          <Route
            path="/auth/login"
            element={user ? <Navigate to={"/calendar"} /> : <Login />}
          />
          <Route
            path="/auth/register"
            element={user ? <Navigate to={"/calendar"} /> : <Register />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
