import React, { useState, useEffect } from "react";

import "./AdminHistory.css";

const AdminHistory = ({ data }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (data.isAdmin === true) {
      setVisible(true);
    }
  }, [data]);

  
  return (
    <div>
      {visible === true ? (
        <div className="earnings__main">
          <p>aaa</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminHistory;
