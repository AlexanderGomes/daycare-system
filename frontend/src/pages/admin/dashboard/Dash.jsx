import React, { useState, useEffect } from "react";
import { Client } from "../../../components";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dash.css";

// sort of a navbar, elements:
// -- list of active and non active clients (history)
// -- create unavailable times (schedule)
// -- list of unavailable times
// -- check in and check out users (check-in)

// client component:
// active/non active clients
// name, email, phone-number, total paid and unpaid values per client

const Dash = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [toggleClient, setToggleClient] = useState(true);
  const [toggleHistory, setToggleHistory] = useState(false);
  const [toggleSchedule, setToggleSchedule] = useState(false);

  useEffect(() => {
    if (data.isAdmin === true) {
      setVisible(true);
    }
  }, [data]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`/api/user/info/all`);
      setUsers(res.data);
    };
    fetchUsers();
  }, []);



  const handleClient = () => {
    setToggleClient(true);
    setToggleHistory(false);
    setToggleSchedule(false);
  };

  const handleHistory = () => {
    setToggleHistory(true);
    setToggleClient(false);
    setToggleSchedule(false);
  };

  const handleSchedule = () => {
    setToggleSchedule(true);
    setToggleClient(false);
    setToggleHistory(false);
  };

  return (
    <div>
      {visible === true ? (
        <div className="dash__main">
          <div className="dash__nav__main">
            <ul className="dash__nav__ul">
              <li
                className={toggleClient === true ? "toggle__active" : ""}
                onClick={handleClient}
              >
                Clients
              </li>
              <li
                className={toggleHistory === true ? "toggle__active" : ""}
                onClick={handleHistory}
              >
                Check-in
              </li>
              <li
                className={toggleSchedule === true ? "toggle__active" : ""}
                onClick={handleSchedule}
              >
                Schedule
              </li>
            </ul>
          </div>

          <div className="dash__toggle__main">
            {toggleClient === true ? (
              <div className="toggle">
                {users.map((user) => (
                  <Client user={user} key={user._id} />
                ))}
              </div>
            ) : (
              ""
            )}
            {toggleHistory === true ? (
              <div className="toggle">
                <p>b</p>
              </div>
            ) : (
              ""
            )}
            {toggleSchedule === true ? (
              <div className="toggle">
                <p>c</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dash;
