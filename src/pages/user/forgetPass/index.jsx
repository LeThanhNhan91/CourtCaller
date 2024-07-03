import React, { useState } from 'react';
import axios from 'axios';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7104/api/authentication/forget-password', {
        email,
      });

      setSuccess(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
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
