import React, { useState, useEffect } from "react";
import { AdminNavbar } from "../../../components";
import {Earnings} from '../../'
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./dash.css";

const Dash = ({ data }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (data.isAdmin === true) {
      setVisible(true);
    }
  }, [data]);

  return (
    <div>
      {visible === true ? (
        <div className="dash__main">
        
          <p>a</p>
          
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dash;
