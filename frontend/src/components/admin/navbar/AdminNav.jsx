import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillCloseCircle } from "react-icons/ai";

const AdminNavbar = () => {
  const [toggle, setToggle] = useState(false);

  const close = () => {
    setToggle(false);
  };

  return (
    <div className="navbar__main">
      <div className="navbar__logo">
        <p className="navbar__slogan">Dashboard Admin</p>
      </div>
      <div className="navbar__icons">
        <ul className="navbar__icons__ul">
          <li>
            <Link style={{ textDecoration: "none" }} to={"/admin/history"}>
              <span className="navbar__history color">History</span>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to={"/"}>
              <span className="navbar__feed color">Schedule</span>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to={"/checkout"}>
              <span className="navbar__pay color">Notifications</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="toggle__nav">
        <GiHamburgerMenu
          onClick={() => setToggle(true)}
          className="close__icon"
        />
        {toggle && (
          <div className="toggle__color">
            <div className="toggle__main">
              <div className="toggle__top">
                <p className="slogan__toggle">Gomes Daycare</p>

                <AiFillCloseCircle onClick={close} className="close__icon " />
              </div>
              <div className="toggle__icons">
                <ul className="toggle__icons__ul">
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/calendar"}>
                      <span onClick={close} className="navbar__schedule color">
                        Earnings
                        <p className="toggle__details">
                          create your own schedules without getting charged, you
                          only get charged after the everyday check-in....{" "}
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/schedules"}>
                      <span className="navbar__history color" onClick={close}>
                        History
                        <p className="toggle__details">
                          see all your schedules, the one's that are paid for
                          already and the ones that are due...
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/"}>
                      <span className="navbar__feed color" onClick={close}>
                      Schedule
                        <p className="toggle__details">
                          daily content about the activities that the kids are
                          doing, gentle parenting and much more...
                        </p>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link style={{ textDecoration: "none" }} to={"/checkout"}>
                      <span className="navbar__pay color" onClick={close}>
                        Notifications
                        <p className="toggle__details">payment...</p>
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
