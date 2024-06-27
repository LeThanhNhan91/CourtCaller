import React from 'react';
import './FailurePage.css';
import { Link } from "react-router-dom";

function PaymentFailed() {
  return (
    <div className="payment-container">
      <div className="success-box">
        <img src="../../../assets/users/images/byday/red_cross.png" alt="Payment Failed" />
        <h2>OOPS !!!</h2>
        <p>Something went wrong! Please try again or contact <a href="mailto:courtcallers@gmail.com" className="contact-email">courtcallers@gmail.com</a></p>
        <button><Link to="/reject">Back to Booking Page</Link></button>
      </div>
    </div>
  );
}

export default PaymentFailed;
