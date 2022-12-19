import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { List } from "../../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./History.css";
import found from "../../assets/found.gif";

const History = () => {
  const [history, setHistory] = useState([]);
  const [paid, setPaid] = useState(false);
  const [unpaid, setUnpaid] = useState(true);

  const { user } = useSelector((state) => state.auth);



  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/schedule/${user._id}`);
      setHistory(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchUser();
  }, [user._id]);

  const handlePaid = () => {
    setPaid(true);
    setUnpaid(false);
  };

  const handleUnpaid = () => {
    setUnpaid(true);
    setPaid(false);
  };

  return (
    <div className="history__main">
      <div className="history__navbar">
        <p
          className={paid === true ? "history__nav__on" : "history__nav"}
          onClick={handlePaid}
        >
          Paid Schedules
        </p>
        <p
          className={unpaid === true ? "history__nav__on" : "history__nav"}
          onClick={handleUnpaid}
        >
          Unpaid Schedules
        </p>
      </div>
      <div className="history__list">
        {history.length > 0 ? (
          history?.map((h) => (
            <div key={h._id}>
              <List
                key={h._id}
                history={h}
                setPaid={setPaid}
                setUnpaid={setUnpaid}
                paid={paid}
                unpaid={unpaid}
              />
            </div>
          ))
        ) : (
          <div className="history__noSchedule">
            <p className="history__no">No Schedules</p>
            <img className="history__img" src={found} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
