import { memo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaRegCalendarCheck } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";
import qrCheckIn from "assets/users/images/hero/qr.png";
import "./style.scss";

const BookedPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [slotInfo, setSlotInfo] = useState([]);
  const [branchInfo, setBranchInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id || decodedToken.Id;
        if (!userId) throw new Error("User ID not found in token");

        const bookingsResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Bookings/userId/${userId}`);
        const allBookings = bookingsResponse.data;

        const filteredBookings = await Promise.all(
          allBookings.map(async (booking) => {
            try {
              const paymentResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Payments/bookingid/${booking.bookingId}`);
              if (paymentResponse.data.paymentMessage === "Complete") return booking;
            } catch (paymentError) {
              console.error(`Error fetching payment data for booking ID ${booking.bookingId}:`, paymentError);
            }
            return null;
          })
        );

        const validBookings = filteredBookings.filter((booking) => booking !== null);
        setBookings(validBookings);
      } catch (error) {
        console.error("Error fetching bookings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
  };

  const handleCancelBooking = async (bookingId) => {
    const userConfirmed = window.confirm("Do you want to cancel your appointment?");
    if (!userConfirmed) return;

    try {
      await axios.delete(`https://courtcaller.azurewebsites.net/api/Bookings/cancelBooking/${bookingId}`);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.bookingId !== bookingId));
    } catch (error) {
      console.error(`Error canceling booking ID ${bookingId}:`, error);
    }
  };

  const handleViewBooking = async (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);

    try {
      const slotResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/TimeSlots/bookingId/${booking.bookingId}`);
      const sortedSlots = slotResponse.data.sort((a, b) => {
        const dateA = new Date(a.slotDate);
        const dateB = new Date(b.slotDate);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        // If dates are equal, compare start times
        const startTimeA = new Date(`1970-01-01T${a.slotStartTime}`);
        const startTimeB = new Date(`1970-01-01T${b.slotStartTime}`);
        return startTimeA - startTimeB;
      });
      setSlotInfo(sortedSlots);

      const branchResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Branches/${booking.branchId}`);
      setBranchInfo(branchResponse.data);
    } catch (error) {
      console.error("Error fetching slot or branch data:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setSlotInfo([]);
    setBranchInfo(null);
  };

  return (
    <div style={{ backgroundColor: "#EAECEE" }}>
      <div className="container">
        <div className="hero_banner_container">
          <div className="hero_banner">
            <div className="hero_text">
              <span>WELCOME TO</span>
              <h2>
                COURT CALLER
                <br />
                HAVE FUN
              </h2>
            </div>
          </div>
        </div>
      </div>

      <h1 style={{ textAlign: "center" }}>Booked Page</h1>
      <div style={{ height: 500 }}>
        <main>
          <h2>List of scheduled appointments</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>BookingID</th>
                  <th>Date</th>
                  <th>Number of slots</th>
                  <th>Booking Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              {bookings.length > 0 ? (
                bookings.map((booked, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{booked.bookingId}</td>
                      <td>{formatDate(booked.bookingDate)}</td>
                      <td>{booked.numberOfSlot}</td>
                      <td>{booked.bookingType}</td>
                      <td>{booked.totalPrice} VND</td>
                      <td>{booked.status}</td>
                      <td>
                        <button className="view-button" onClick={() => handleViewBooking(booked)}>
                          View
                        </button>
                      </td>
                      <td>
                        <button className="cancel-button" onClick={() => handleCancelBooking(booked.bookingId)}>
                          ✘
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>No completed bookings found</td>
                  </tr>
                </tbody>
              )}
            </table>
          )}
        </main>
      </div>

      {showModal && selectedBooking && (
        <div className="modal-container">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div style={{marginRight: 30}}>
              <div className="slot-view">
                <h2>Slot Information <FaRegCalendarCheck style={{color: "blue", verticalAlign: -3}}/></h2>
                <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
                <table>
                  <thead>
                    <tr>
                      <th>CourtID</th>
                      <th>Slot Date</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                 
                  {slotInfo.length>0 ? (
                    slotInfo.map((slot, index) => (
                      <tbody key = {index}>
                        <tr>
                          <td>{slot.courtId}</td>
                          <td>{formatDate(slot.slotDate)}</td>
                          <td>{slot.slotStartTime}</td>
                          <td>{slot.slotEndTime}</td>
                        </tr>
                      </tbody>
                    ))
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>No slot information available</td>
                      </tr>
                    </tbody>
                  )}
                  
                </table>
                </div>
              </div>
              <div className="branch-view">
                <h2>Branch Information <GiShuttlecock style={{fontSize: 25, color: "green", verticalAlign: -3}}/></h2>
                {branchInfo ? (
                  <>
                  <div className="branch-detail">
                    <p className="branch-field">Name: </p>
                    <p className="branch-info">{branchInfo.branchName}</p>
                  </div>
                  <div className="branch-detail">
                    <p className="branch-field">Address: </p>
                    <p className="branch-info">{branchInfo.branchAddress}</p>
                  </div>
                  <div className="branch-detail">
                    <p className="branch-field">Phone: </p>
                    <p className="branch-info">{branchInfo.branchPhone}</p>
                  </div>
                  <div className="branch-detail">
                    <p className="branch-field">Status: </p>
                    <p className="branch-info">{branchInfo.status}</p>
                  </div>
                  </>
                ) : (
                  <p>No branch information available</p>
                )}
              </div>
            </div>

            <div className="user-qr-checking">
              <div className="user-qr">
                <div className="qr-placeholder">
                  <img className="qr" src={qrCheckIn} alt="user image" />
                </div>
                <p>QR Code for Checking In</p>
                <p style={{ margin: 0, color: "#00c853" }}>Checked</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BookedPage);
