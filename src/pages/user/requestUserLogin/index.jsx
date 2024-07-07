import React from 'react';
import './style.css';

const RequestLogin = () => {
  return (
    <div className="requestCard">
      <p className="requestHeading">Login Request.</p>
      <p className="requestDescription">
        You haven't signed in yet. Please log in to fully experience our application. Thanks a lot.
      </p>
      <button className="acceptButton">Login</button>
    </div>
  );
};

export default RequestLogin;
