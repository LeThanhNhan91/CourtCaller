import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.scss"; 
import "./editStyle.scss"
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { Card, CardGroup, Container, Button } from "react-bootstrap";
import userImg from "assets/users/images/hero/user.png"

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editFormValues, setEditFormValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    facebook: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      const fetchUserData = async (id, isGoogle) => {
        try {
          if (isGoogle) {
            const response = await axios.get(
              `https://courtcaller.azurewebsites.net/api/UserDetails/GetUserDetailByUserEmail/${id}`
            );
            setUserData(response.data);
            const userResponse = await axios.get(
              `https://courtcaller.azurewebsites.net/api/Users/GetUserDetailByUserEmail/${id}?searchValue=${id}`
            );
            setUser(userResponse.data);
          } else {
            const response = await axios.get(
              `https://courtcaller.azurewebsites.net/api/UserDetails/${id}`
            );
            setUserData(response.data);
            const userResponse = await axios.get(
              `https://courtcaller.azurewebsites.net/api/Users/${id}`
            );
            setUser(userResponse.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      if (decoded.iss !== "https://accounts.google.com") {
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

  useEffect(() => {
    if (user && userData) {
      setEditFormValues({
        fullName: userData.fullName,
        email: user.email,
        phone: user.phoneNumber,
        facebook: user.facebook || "",
      });
    }
  }, [user, userData]);

  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditPopupOpen(false);
  };

  const handleUpdate = async () => {
    // Logic to update the user information
    // Make API call to update user data
    // On success, update the state and close the popup
    try {
      const response = await axios.put(
        `https://courtcaller.azurewebsites.net/api/UserDetails/${userId}`,
        editFormValues
      );
      setUserData(response.data);
      setIsEditPopupOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!userData || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="user-info">
        <div className="info-container">
          <div className="info-box">
            <h2>Basic Information</h2>
            <div className="form-group">
              <p className="info-field">Full Name</p>
              <p className="info">{userData.fullName}</p>
            </div>
            <div className="form-group">
              <p className="info-field">User Name</p>
              <p className="info">{user.userName}</p>
            </div>
            <div className="form-group">
              <p className="info-field">Date of Birth</p>
              <p className="info">{userData.yearOfBirth}</p>
            </div>
            <div className="form-group">
              <p className="info-field">Address</p>
              <p className="info">{userData.address}</p>
            </div>
          </div>
          <div className="contact-box">
            <h2>Contact Information</h2>
            <div className="form-group">
              <p className="info-field">Email</p>
              <p className="info">{user.email}</p>
            </div>
            <div className="form-group">
              <p className="info-field">Phone</p>
              <p className="info">{user.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="user-image-container">
          <div className="user-image">         
          <div className="image-placeholder">
            <img src={userImg} alt="user image" />
          </div>
          <p>Profile Picture</p>
          <p style={{margin: 0, color: "#00c853"}}>Online</p>
          </div>
        </div>
      </div>

      <div className="btn-container">
        <div className="buttons">
        <Link to="/">
          <button className="btn-back">Back</button>
        </Link>

        <button className="btn-edit" onClick={handleEditClick}>Edit</button>
        </div>
      </div>

      {isEditPopupOpen && (
        <div className="form-container">
        <div class="edit-container">
          <h2 className="edit-header">Update Information</h2>
          <div class="form-box">
            <div class="form-edit-group">
              <div class="account">
                <h3>Account</h3>
                <p>halinhtvn3a</p>
              </div>
              <div className="form-edit">
                <div className="edit-left">
                  <div class="form-field">
                    <span>Full Name</span>
                    <input className="input-fname" type="text" id="name" />
                  </div>
                  <div class="form-field">
                    <span>Phone</span>
                    <input className="input-phone" type="text" id="phone" />
                  </div>
                </div>
                <div className="edit-right">
                  <div class="form-field">
                    <span>Email</span>
                    <input
                      className="input-email"
                      type="email"
                      id="email"
                      value="duonghaingu@gmail.com"
                    />
                  </div>
                  <div class="form-field">
                    <span>Facebook</span>
                    <input className="input-fb" type="text" id="facebook" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons-edit">
              <button className="btn-back" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="btn-update" onClick={handleUpdate}>
                Update
              </button>
            </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Profile;
