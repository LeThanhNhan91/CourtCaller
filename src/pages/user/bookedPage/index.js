import { memo, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
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
      console.log('Slot Response:', slotResponse.data);
      setSlotInfo(slotResponse.data);

      const branchResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Branches/${booking.branchId}`);
      console.log('Branch Response:', branchResponse.data);
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
            <div style={{ display: "flex", justifyContent: "space-between", width: "670px" }}>
              <div className="slot-view">
                <h2>Slot Information</h2>
                {slotInfo.length > 0 ? (
                  slotInfo.map((slot, index) => (
                    <div  key={index}>
                      <p>CourtID: {slot.courtId}</p>
                      <p>Slot Date: {formatDate(slot.slotDate)}</p>
                      <p>Start Time: {slot.slotStartTime}</p>
                      <p>End Time: {slot.slotEndTime}</p>
                    </div>
                  ))
                ) : (
                  <p>No slot information available</p>
                )}
              </div>
              <div className="branch-view">
                <h2>Branch Information</h2>
                {branchInfo ? (
                  <>
                    <p>Name: {branchInfo.branchName}</p>
                    <p>Address: {branchInfo.branchAddress}</p>
                    <p>Phone: {branchInfo.branchPhone}</p>
                    <p>Status: {branchInfo.status}</p>
                  </>
                ) : (
                  <p>No branch information available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BookedPage);
