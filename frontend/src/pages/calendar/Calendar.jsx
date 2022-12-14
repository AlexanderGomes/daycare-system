import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./Calendar.css";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";

//TODO- ask for confirmation when creating a schedule
const Calendar = () => {
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const takenScheduleMessage = "Request failed with status code 400";
  const { user } = useSelector((state) => state.auth);

  // reset calendar if success
  const createSchedule = async () => {
    try {
      await axios.post("/api/schedule", {
        userId: user._id,
        start: date[0].startDate,
        end: date[0].endDate,
      });
      toast.success("Schedule Created", {
        duration: 3000,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.message === takenScheduleMessage) {
        toast.error("Schedule is Taken by You", {
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="calendar__color">
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
          <button onClick={createSchedule}>Create Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
