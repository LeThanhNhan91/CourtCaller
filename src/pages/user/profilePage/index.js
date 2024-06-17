import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';  // Ensure you have this CSS file
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Card, CardGroup, Container, Button } from 'react-bootstrap';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);

      const fetchUserData = async (id, isGoogle) => {
        try {
          if (isGoogle) {
            const response = await axios.get(`https://courtcaller.azurewebsites.net/api/UserDetails/GetUserDetailByUserEmail/${id}`);
            setUserData(response.data);
            const userResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Users/GetUserDetailByUserEmail/${id}?searchValue=${id}`);
            setUser(userResponse.data);
          } else {
            const response = await axios.get(`https://courtcaller.azurewebsites.net/api/UserDetails/${id}`);
            setUserData(response.data);
            const userResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Users/${id}`);
            setUser(userResponse.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      if (decoded.iss !== 'https://accounts.google.com') {
        const userId = decoded.Id;
        setUserId(userId);
        fetchUserData(userId, false);
      } else {
        const userId = decoded.email;
        setUserId(userId);
        fetchUserData(userId, true);
      }
    }
  }, []);

  if (!userData || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card className="mt-5">
        <Card.Header>
          <h2>Thông tin người dùng</h2>
        </Card.Header>
        <Card.Body>
          <CardGroup>
            <Card className="mb-3">
              <Card.Body>
                <div className="profile-info-item">
                  <span className="label">Full Name</span>
                  <span className="value">{userData.fullName}</span>
                </div>
                <div className="profile-info-item">
                  <span className="label">Username</span>
                  <span className="value">{user.userName}</span>
                </div>
                <div className="profile-info-item">
                  <span className="label">Email</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="profile-info-item">
                  <span className="label">Phone Number</span>
                  <span className="value">{user.phoneNumber}</span>
                </div>
                <div className="profile-info-item">
                  <span className="label">Address</span>
                  <span className="value">{userData.address}</span>
                </div>
                <div className="profile-info-item">
                  <span className="label">YOB</span>
                  <span className="value">{userData.yearOfBirth}</span>
                </div>
                <div className="profile-info-item last-item">
                  <Link to="/profile/edit-name">
                    <Button className="edit-button">Edit</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
            <Card className="mb-3 image">
              <Card.Body >
                <div className="profile-image-section">
                  <img src={userData.profilePicture} alt="User" className="profile-image" />
                  <div className="username">{userData.username}</div>
                  <div className="status">Online</div>
                  <h3>Lịch sử đăng nhập</h3>
                </div>
              </Card.Body>
            </Card>
          </CardGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
