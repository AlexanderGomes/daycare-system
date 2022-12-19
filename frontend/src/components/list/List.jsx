import React, { useEffect, useState } from "react";
import "./List.css";
import Moment from "react-moment";

// paid and unpaid are just toggling values, they just open what you want to show

//  handling the toggle will not be done here, you just filter wats displayed

//

const List = ({ history, paid, unpaid }) => {
  return (
    <div>
      {paid && history.isPaid === true ? (
        <div className="list__main">
          <div className="list__info">
            <div className="list__from">
              <span className="from">From: </span>
              <Moment format="DD/MM/YYYY" className="list__dates">
                {history.start}
              </Moment>
            </div>
            <div className="list__to">
              <span className="to">To: </span>
              <Moment format="DD/MM/YYYY" className="list__dates">
                {history.end}
              </Moment>
            </div>
            <div className="list__to">
              <span className="to">Days: {history.days}</span>
            </div>
            <div className="list__to">
              <span className="to">Price: ${history?.price} </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {unpaid === true && history.isPaid === false ? (
        <div className="list__main">
          <div className="list__info">
            <div className="list__from">
              <span className="from">From: </span>
              <Moment format="DD/MM/YYYY" className="list__dates">
                {history.start}
              </Moment>
            </div>
            <div className="list__to">
              <span className="to">To: </span>
              <Moment format="DD/MM/YYYY" className="list__dates">
                {history.end}
              </Moment>
            </div>
            <div className="list__to">
              <span className="to">Days: {history.days}</span>
            </div>
            <div className="list__to">
              <span className="to">Price: ${history?.price} </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default List;
