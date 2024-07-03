import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import "./editStyle.scss"
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import {storageDb} from "firebase.js";
import {v4} from 'uuid'
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPic, setUserPic] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [editFormValues, setEditFormValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    yearOfBirth: "",
    profilePicture: []
  });
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.name);
      setUserPic(decoded.picture);
      setUserEmail(decoded.email);

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
  console.log('user', user)

  useEffect(() => {
    if (user && userData) {
      setEditFormValues({
        fullName: userData.fullName || userName,
        userName: user.userName,
        phoneNumber: user.phoneNumber || "",
        address: userData.address || "",
        yearOfBirth: userData.yearOfBirth || "",
        profilePicture: userData.profilePicture || null
      });
    }
  }, [user, userData]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleUpdate = async () => {
    try {
      const uploadImageTask = async (selectedFile) => {
        const imageRef = ref(storageDb, `BranchImage/${v4()}`);
        await uploadBytes(imageRef, selectedFile);
        const url = await getDownloadURL(imageRef);
        return url;
      };
  
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImageTask(selectedFile);
      }
  
      // Log để kiểm tra các URL ảnh mới sau khi upload
      console.log("Image URL after upload:", imageUrl);
  
      let formData = new FormData();
      formData.append("fullName", editFormValues.fullName);
      formData.append("userName", editFormValues.userName);
      formData.append("phoneNumber", editFormValues.phoneNumber);
      formData.append("address", editFormValues.address);
      formData.append("yearOfBirth", editFormValues.yearOfBirth);
      if (imageUrl) {
        formData.append("profilePicture", imageUrl);
      }
  
      const response = await axios.put(
        `https://courtcaller.azurewebsites.net/api/UserDetails/foruser/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      setUserData(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleOnChange = (event) => {
    if(event.target.files && event.target.files.length > 0){
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const onRemoveFile = () => {
    setSelectedFile(null)
  }

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
              <img className="profile-img" src={userData.profilePicture} alt="user image" />
            </div>
            <p>Profile Picture</p>
            <p style={{ margin: 0, color: "#00c853" }}>Online</p>
          </div>
        </div>
      </div>

      <div className="btn-container">
        <div className="buttons">
          <Link to="/">
            <button className="btn-back">Back</button>
          </Link>
          <button className="btn-edit" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="edit-form-container">
          <div className="edit-container">
            <h2 className="edit-header">Update Information</h2>
            <div className="form-box">
              <div className="form-edit-group">
                <div className="account">
                  <h3>Account</h3>
                  <p>Balance: {userData.balance}</p>
                </div>
                <div className="form-edit">
                  <div className="edit-left">
                    <div className="form-field">
                      <span>Full Name</span>
                      <input
                        className="input-fname"
                        type="text"
                        id="fname"
                        name="fullName"
                        value={editFormValues.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <span>User Name</span>
                      <input
                        className="input-uname"
                        type="text"
                        id="uname"
                        name="userName"
                        value={editFormValues.userName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <span>Phone</span>
                      <input
                        className="input-phone"
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editFormValues.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div style={{marginTop: 20}}>
                      <p style={{marginBottom: 10}}>Profile Image</p>
                      <input
                        type="file"
                        ref={inputRef}
                        onChange={handleOnChange}
                        style={{margin: 0, display: "none"}}
                      />
                      <button className="file-btn" onClick={onChooseFile}>
                        <span className="material-symbol-rounded"><IoCloudUploadOutline /></span> Upload File
                      </button>
                      {selectedFile && <div className="selected-file">
                        <p>{selectedFile.name}</p>
                        <button className="file-btn" onClick={onRemoveFile}>
                          <span  style={{width: 38}} className="material-symbol-rounded"><RiDeleteBin6Line style={{width: 25}}/></span>
                        </button>
                      </div>}
                    </div>
                  </div>
                  <div className="edit-right">
                    <div className="form-field">
                      <span>Address</span>
                      <input
                        className="input-address"
                        type="text"
                        id="address"
                        name="address"
                        value={editFormValues.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <span>Date of birth</span>
                      <input
                        className="input-date"
                        type="text"
                        id="yearOfBirth"
                        name="yearOfBirth"
                        value={editFormValues.yearOfBirth}
                        onChange={handleChange}
                      />
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
