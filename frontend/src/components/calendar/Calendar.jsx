import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./Calendar.css";
import { format } from "date-fns";

const Calendar = () => {
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  console.log(date)

  return (
    <div className="calendar__main">
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
    </div>
  );
};

export default Calendar;
