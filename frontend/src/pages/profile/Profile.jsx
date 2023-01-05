import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Profile.css";


//don't allow user to change email
//after sending code show the input to type it
const Profile = ({ data }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (data.isAdmin === true) {
      navigate("/admin/history");
    }
  }, [data, user]);

  return (
    <div className="profile__main">
      {data.isAdmin === false ? (
        //give a color to this div
        <div>
          <div className="profile__top">
            <p className="top__text">Welcome to your profile</p>
          </div>

          <div className="profile__info__main">
            <div className="profile__user__balance">
              <div className="profile__top__info">
                <p className="profile__name">{data.name}</p>
                <button className="profile__logout">Log out</button>
                <div className="profile__email__main">
                  <p>{data.email}</p>
                  <div className="profile__email">
                    <p>verify email: </p>
                    <button className="code__btn">send code</button>
                  </div>
                </div>

                <div className="profile__email__main">
                  <p>{data.phoneNumber}</p>
                  <div className="profile__email">
                    <p>verify number: </p>
                    <button className="code__btn">send code</button>
                  </div>
                </div>
              </div>
              <div className="profile__balance__p">
                <p className="balance__p">Total Balance</p>
              </div>
              <div className="profile__balance">
                <p>paid: </p>
                <p className="balance__paid">
                  ${data.paidBalance > 0 ? data.paidBalance : 0}
                </p>
                <p>unpaid: </p>
                <p className="balance__unpaid">
                  ${data.unpaidBalance > 0 ? data.unpaidBalance : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
