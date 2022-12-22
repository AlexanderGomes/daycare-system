import React from "react";

import "driver.js/dist/driver.min.css";
import {
  Welcome,
  Register,
  Login,
  Calendar,
  History,
  Checkout,
  Success,
} from "./pages";
import { Navbar, Footer } from "./components";
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
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={user ? <Calendar /> : <Welcome />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Login />} />
          <Route path="/checkout/success" element={<Success />} />
          <Route path="/calendar" element={user ? <Calendar /> : <Login />} />
          <Route
            path="/auth/login"
            element={user ? <Navigate to={"/calendar"} /> : <Login />}
          />
          <Route
            path="/auth/register"
            element={user ? <Navigate to={"/calendar"} /> : <Register />}
          />
          <Route path="/schedules" element={user ? <History /> : <Login />} />
        </Routes>
        {user && <Footer />}
      </Router>
    </>
  );
}

export default App;
