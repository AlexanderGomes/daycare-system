import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./Calendar.css";

import { format } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";


const Calendar = () => {
  const [popUp, setPopUp] = useState(false);
  const [conf, setConf] = useState(false);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(date[0].endDate, date[0].startDate);

  const takenScheduleMessage = "Request failed with status code 400";
  const { user } = useSelector((state) => state.auth);

  // BUG //
  // current date is causing bugs, for some reason you're selecting the current date and receiving one day later maybe because of time zones, but
  // selecting just the current day allow you to spam it as much as you want, selecting the current day plus another one won't cause problems
  // it's only the current day that is causing problems

  const CreateSchedule = async () => {
    try {
      if (date[0].startDate === date[0].endDate) {
        await axios.post("/api/schedule", {
          userId: user._id,
          start: date[0].startDate,
          end: date[0].startDate,
          days: 1,
          price: 35,
        });
      } else {
        await axios.post("/api/schedule", {
          userId: user._id,
          start: date[0].startDate,
          end: date[0].endDate,
          days: days,
          price: 35 * days,
        });
      }
      toast.success("Schedule Created", {
        duration: 3000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    } catch (error) {
      if (error.message === takenScheduleMessage) {
        toast.error("Schedule is Taken by You", {
          duration: 3000,
        });
        setPopUp(false);
      }
    }
  };

  const confirm = () => {
    setConf(true);
    if (conf === true) {
      CreateSchedule();
    }
  };

  useEffect(() => {
    setConf(!false);
  }, [conf]);

  return (
    <div className="calendar__color">
      {popUp === true ? (
        <div className="calendar__popup__color">
          <div className="calendar__popup__main">
            <p className="calendar__p">are you sure about the schedule?</p>
            <p className="calendar__p greyish">
              <span className="calendar__disclaimer"> Disclaimer: </span> you
              can't change your schedule after being checked-in, the payment for
              the day will be required after so. You get charged $35 per day
              that you get checked-in by one of our employees.
            </p>
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
      <div className="calendar__main">
        <div className="calendar__move">
          <span className="calendar__range">{`${format(
            date[0].startDate,
            "MM/dd/yyyy"
          )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className="calendar__date"
            minDate={new Date()}
          />
          <button
            className="register__schedule__btn"
            onClick={() => setPopUp(true)}
          >
            Create Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
