import React from "react";
import { Welcome, Register, Login } from "./pages";
import { Feed } from "./components";
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
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/feed" element={user ? <Feed /> : <Login />} />
          <Route
            path="/auth/login"
            element={user ? <Navigate to={"/feed"} /> : <Login />}
          />
          <Route
            path="/auth/register"
            element={user ? <Navigate to={"/feed"} /> : <Register />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
