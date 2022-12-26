import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./dash.css";

const Dash = ({data}) => {
  const [visible, setVisible] = useState(false)
 
useEffect(() => {
if(data.isAdmin === true) {
  setVisible(true)
}
}, [data])

  return (
    <div>
      {visible === true ? (
        <p>allowed</p>
      ) : (
       ''
      )}
    </div>
  )
};

export default Dash;
