import React from "react";
import axios from "axios";

const PaymentBtn = ({ data }) => {
  console.log(data)
  const HandleCart = async () => {
    axios
      .post("/api/payment/create-checkout-session", {
        data,
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
      <button className="checkout__btn" onClick={() => HandleCart()}>PAYMENT</button>
    </>
  );
};

export default PaymentBtn;
