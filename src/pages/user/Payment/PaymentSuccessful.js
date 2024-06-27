import React from 'react';
import './SuccessPage.css';
import { Link } from "react-router-dom";

function PaymentSuccessful() {
  return (
    <div className="payment-container">
      <div className="success-box">
        <img src="../../../assets/users/images/byday/green_tick.png" alt="Payment Successful" />
        <h2>Thank You!</h2>
        <p>Your booking has been successfully submitted. Thanks for choosing our service</p>
        <button><Link to="/">Back to Home</Link></button>
      </div>
    </div>
  );
}

export default PaymentSuccessful;
