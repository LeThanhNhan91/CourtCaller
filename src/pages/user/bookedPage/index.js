import { memo, useState } from "react";
import "./style.scss"

const BookedPage = () =>{
    const schedule = [
        {
            CourtID: "C001",
            Date: "15/06/2024",
            StartTime: "9:30",
            EndTime: "10:30",
            Price: 120000
        },
        {
            CourtID: "C002",
            Date: "15/06/2024",
            StartTime: "9:30",
            EndTime: "10:30",
            Price: 120000
        },
        {
            CourtID: "C003",
            Date: "15/06/2024",
            StartTime: "9:30",
            EndTime: "10:30",
            Price: 120000
        },
        {
            CourtID: "C004",
            Date: "15/06/2024",
            StartTime: "9:30",
            EndTime: "10:30",
            Price: 120000
        },
        {
            CourtID: "C005",
            Date: "15/06/2024",
            StartTime: "9:30",
            EndTime: "10:30",
            Price: 120000
        },
    ]

    return ( 
    <>
    <div className="container">
        <div className="hero_banner_container">
          <div className="hero_banner">
            <div className="hero_text">
            <span>WELCOME TO</span>
              <h2>
                {" "}
                COURT CALLER
                <br />
                HAVE FUN
              </h2>
            </div>
          </div>
        </div>
      </div>
    
    <h1 style={{textAlign: "center"}}>Booked Page</h1>
    <main>
        <h2>List of scheduled appointments</h2>
        <table>
            <thead>
                <tr>
                    <th>CourtID</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Price</th>
                    <th>Cancel</th>
                </tr>
            </thead>
            {schedule.map((booked, index) => (
            <tbody key={index}>
                <tr>
                    <td>{booked.CourtID}</td>
                    <td>{booked.Date}</td>
                    <td>{booked.StartTime}</td>
                    <td>{booked.EndTime}</td>
                    <td>{booked.Price} VND</td>
                    <td><button className="cancel-button">✘</button></td>
                </tr>
            </tbody>
            ))}
        </table>
    </main>
    </>
    )
};

export default memo(BookedPage);