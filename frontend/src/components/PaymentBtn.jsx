import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// total payment, and pay individually

const PaymentBtn = ({ totalPrice, data }) => {
  const { user } = useSelector((state) => state.auth);

  const handleCart = async () => {
    axios
      .post("/api/payment/create-checkout-session", {
        data,
        userId: user._id,
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <button onClick={() => handleCart()}>PAYMENT</button>
    </>
  );
};

export default PaymentBtn;
