import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Client.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const Client = ({ data }) => {
  const [popUp, setPopUp] = useState(false);
  const [conf, setConf] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      kids: 1,
    },
    validationSchema: Yup.object({
      kids: Yup.string().required("number of kids is required"),
    }),
  });

  let currentDate = new Date();
  const time = currentDate
    .toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })
    .slice(0, 8);

  const takenCheckin = "Request failed with status code 400";
  const hasSchedule = "Request failed with status code 420";

  const checkIn = async () => {
    try {
      await axios.post("/api/schedule/checkin", {
        userId: user._id,
        clientId: data._id,
        start: time,
        kids: formik.values.kids,
      });
      toast.success("Check-in done", {
        duration: 1500,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
      if (err.message === takenCheckin) {
        toast.error("Check in for the day is done", {
          duration: 3000,
        });
      }

      if (err.message === hasSchedule) {
        toast.error("the client has a schedule for today", {
          duration: 3000,
        });
      }
    }
  };

  const confirm = () => {
    setConf(true);
    if (conf === true) {
      checkIn();
    }
  };

  useEffect(() => {
    setConf(!false);
  }, [conf]);

  let currentDates = new Date();
  const times = currentDates
    .toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    .slice(10, 20);


  return (
    <div className="client__main">
      {data.isAdmin === false && popUp === true ? (
        <div className="calendar__popup__color move">
          <div className="calendar__popup__main">
            <p className="calendar__p">
              are you sure about it's the right client?
            </p>
            <p className="calendar__p greyish">
              <span className="calendar__disclaimer"> Disclaimer: </span> any
              mistake will result in financial damage to both the client and the
              daycare
            </p>
            <p className="calendar__p greyish">$35 per kid</p>
            <input
              type="number"
              id="kids"
              name="kids"
              placeholder="kids"
              onBlur={formik.handleBlur}
              value={formik.values.kids}
              onChange={formik.handleChange}
            />
            <div className="calendar__btns">
              <button className="confirm__btn" onClick={confirm}>
                yes
              </button>
              <button className="refuse__btn" onClick={() => setPopUp(false)}>
                no
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {data.isCheckIn === false && data.isAdmin === false ? (
        <div className="client__color">
          <p className="client__name">{data.name}</p>
          {data.isBlocked === false ? (
            <button className="check__btn" onClick={() => setPopUp(true)}>
              Check-in
            </button>
          ) : (
            <p className="client__unpaid">
              user is blocked!! pending balance of 15 days
            </p>
          )}
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
