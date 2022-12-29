import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Client.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";



const Client = ({ data }) => {
  const { user } = useSelector((state) => state.auth);

  const date1 = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/T/, " ")
    .replace(/\..+/, "");

  const takenCheckin = "Request failed with status code 400";

  const checkIn = async () => {
    try {
      await axios.post("/api/schedule/checkin", {
        userId: user._id,
        clientId: data._id,
        start: date1,
      });
      toast.success("Check-in done", {
        duration: 1500,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (err) {
      if (err.message === takenCheckin) {
        toast.error("Check in for the day is done", {
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="client__main">
      {data.isCheckIn === false && data.isAdmin === false ? (
        <div className="client__color">
          <p className="client__name">{data.name}</p>
          <button className="check__btn" onClick={checkIn}>
            Check-in
          </button>
          <p className="client__email">{data.email}</p>
          <div className="client__balance">
            <p className="client__paid">
              Paid Balance: ${data.paidBalance > 0 ? data.paidBalance : 0}
            </p>
            <p className="client__unpaid">
              Pending Balance: $
              {data.unpaidBalance > 0 ? data.unpaidBalance : 0}
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Client;
