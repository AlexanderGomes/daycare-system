import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Schedule.css";

//create schedule
// change backend to indicate the schedule was created by an admin

const Schedule = () => {
  const [popUp, setPopUp] = useState(false);
  const [conf, setConf] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);



  const CreateSchedule = async () => {
    try {
      if (date[0].startDate === date[0].endDate) {
        await axios.post("/api/schedule/admin", {
          userId: user._id,
          dates: [date[0].startDate],
        });
      } else {
        await axios.post("/api/schedule/admin", {
          userId: user._id,
          dates: [date[0].startDate, date[0].endDate],
        });
      }
      toast.success("Schedule Created", {
        duration: 3000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error.message);
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
        <div className="calendar__popup__sch">
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

export default Schedule;
