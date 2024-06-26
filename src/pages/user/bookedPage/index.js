import { memo, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "./style.scss";

const BookedPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id || decodedToken.Id; // Check for both possible field names

        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Fetch bookings data using the user ID
        const bookingsResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Bookings/userId/${userId}`);
        // console.log('bookingsResponse', bookingsResponse);
        const allBookings = bookingsResponse.data;
        // console.log('allBookings', allBookings);

        // Fetch payment data for each booking and filter completed payments
        const filteredBookings = await Promise.all(
          allBookings.map(async (booking) => {
            try {
              const paymentResponse = await axios.get(`https://courtcaller.azurewebsites.net/api/Payments/bookingid/${booking.bookingId}`);
              console.log('paymentResponse', paymentResponse.data);
              if (paymentResponse.data.paymentMessage === "Complete") {
                return booking;
              }
            } catch (paymentError) {
              console.error(`Error fetching payment data for booking ID ${booking.bookingId}:`, paymentError);
            }
            return null;
          })
        );

        // Log filtered bookings
        // console.log('filteredBookings before filtering null values', filteredBookings);

        // Filter out null values
        const validBookings = filteredBookings.filter((booking) => booking !== null);
        // console.log('validBookings after filtering null values', validBookings);

        // Set the state
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
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Extract the day, month, and year from the Date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();

    // Format the day and month with leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Combine the parts into the desired format
    return `${formattedDay}/${formattedMonth}/${year}`;
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
                        <button className="cancel-button">✘</button>
                      </td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>No completed bookings found</td>
                  </tr>
                </tbody>
              )}
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default memo(BookedPage);
