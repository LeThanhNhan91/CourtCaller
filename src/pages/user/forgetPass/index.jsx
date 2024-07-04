import React, { useState } from 'react';
import axios from 'axios';
import { forgetPassword } from 'api/userApi';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await forgetPassword(email);
    if (response.success) {
      setSuccess(response.message);
      setError('');
    } else {
      setError(response.message);
      setSuccess('');
    }
      
  };

  return (
    <div>
      <h1>Forget Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgetPassword;
