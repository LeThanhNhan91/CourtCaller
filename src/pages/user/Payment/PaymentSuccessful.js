import React from 'react';
import './SuccessPage.css';
import { Link } from "react-router-dom";
import yesImg from "assets/users/images/byday/green_tick.png"

function PaymentSuccessful() {
  return (
    <div className="payment-container">
      <div className="success-box">
        <img src={yesImg} alt="Payment Successful" />
        <h2>Thank You!</h2>
        <p>Your booking has been successfully submitted. Thanks for choosing our service</p>
        <button><Link to="/" style={{textDecoration: "none", color: "#fff"}}>Back to Home</Link></button>
      </div>
    </div>
  );
}

export default PaymentSuccessful;
