import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
      <div className="navbar__main">
        <div className="navbar__logo">
          <p className="navbar__slogan">Gomes Daycare</p>
        </div>

        <div className="navbar__icons">
          <ul className="navbar__icons__ul">
            <li>
              <Link style={{ textDecoration: "none" }} to={"/calendar"}>
                <span className="navbar__schedule color">Calendar</span>
              </Link>
            </li>
            <li>
              <Link style={{ textDecoration: "none" }} to={"/schedules"}>
                <span className="navbar__history color">History</span>
              </Link>
            </li>
            <li>
              <Link style={{ textDecoration: "none" }} to={"/"}>
                <span className="navbar__feed color">Feed</span>
              </Link>
            </li>
            <li>
              <Link style={{ textDecoration: "none" }} to={"/checkout"}>
                <span className="navbar__pay color">Checkout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Navbar;
