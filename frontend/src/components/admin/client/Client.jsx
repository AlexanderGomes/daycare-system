import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Client.css";

const Client = ({ user }) => {
  return (
    <div className="client__main">
      <div className="client__color">
        <p className="client__name">{user.name}</p>
        <p className="client__email">{user.email}</p>
        <div className="client__balance">
          <p className="client__paid">Paid Balance: ${user.paidBalance}</p>
          <p className="client__unpaid">Pending Balance: ${user.unpaidBalance}</p>
        </div>
      </div>
    </div>
  );
};

export default Client;
