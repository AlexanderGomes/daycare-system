import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./Checkout.css";
import Moment from "react-moment";
import PaymentBtn from "../../components/PaymentBtn";

const Checkout = () => {
  const [schedule, setSchedule] = useState({});

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/schedule/${user._id}`);
      setSchedule(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchUser();
  }, [user._id]);

  let dataArr = Array.from(schedule);
  let result = [];
  let price;
  let data = []

  dataArr?.map((p) => {
    if (p.isPaid === false) {
      result.push(p.price);
      price = result.reduce((a, b) => a + b, 0);
    }
  });

  dataArr?.map((p) => {
    if (p.isPaid === false) {
       data.push(p)
    }
  })

  return (
    <div className="check__main">
      <div className="check__info">
        <p className="check__explanation">
          All unpaid schedules are being shown for confirmation, if there's any
          error please contact the daycare so we can solve the issue. Be aware
          that we have payment plans for clients going through a hard time, here
          we don't see you as an asset but as a human being, we're going to help
          you on everything we can.
        </p>
        <p>All unpaid schedules</p>
      </div>
      <div className="check__schedules">
        <p>Total price: $ {price ? price : 0}</p>
        {schedule.length === 0 ? "" : <PaymentBtn data={data} />}
      </div>
      <div className="history__list">
        {dataArr?.map((history) =>
          history?.isPaid === false ? (
            <div className="list__main" key={history._id}>
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
          )
        )}
      </div>
    </div>
  );
};

export default Checkout;
