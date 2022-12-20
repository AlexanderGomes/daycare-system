import React from "react";
import "./Navbar.css";
import { AiOutlineSchedule } from "react-icons/ai";
import { FaAmazonPay } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { SlFeed } from "react-icons/sl";
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
            <Link to={"/calendar"}>
              <span className="navbar__schedule">
                <AiOutlineSchedule color="black" size={25} />
              </span>
            </Link>
          </li>
          <li>
            <Link to={"/schedules"}>
              <span className="navbar__history">
                <BsClockHistory color="black" size={25} />
              </span>
            </Link>
          </li>
          <li>
            <Link to={"/"}>
              <span className="navbar__feed">
                <SlFeed color="black" size={25} />
              </span>
            </Link>
          </li>
          <li>
            <Link to={"/checkout"}>
              <span className="navbar__pay">
                <FaAmazonPay color="black" size={25} />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
