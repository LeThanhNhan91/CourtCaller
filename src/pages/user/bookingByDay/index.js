import { memo } from "react";
import { useLocation } from "react-router-dom";
import { FaWifi, FaMotorcycle, FaBowlFood } from "react-icons/fa6";
import { FaCar, FaStar } from "react-icons/fa";
import { RiDrinks2Fill } from "react-icons/ri";
import { MdOutlineLocalDrink } from "react-icons/md";
import pic1 from "assets/users/images/byday/pic1.webp";
import pic2 from "assets/users/images/byday/pic2.webp";
import pic3 from "assets/users/images/byday/pic3.webp";
import pic4 from "assets/users/images/byday/pic4.webp";
import pic5 from "assets/users/images/byday/pic5.webp";
import { IoLocationOutline } from "react-icons/io5";
import "react-multi-carousel/lib/styles.css";
import "./style.scss";

const BookByDay = () => {
  const location = useLocation();
  const { branch } = location.state;

  return (
    <>
      <div style={{backgroundColor: "#EAECEE"}}>
      <div className="header-container">
        <div className="brief-info">
          <h1>{branch.branchName}</h1>
          <p><IoLocationOutline style={{ fontSize: 22 }} /> {branch.branchAddress}</p>
          <p>{branch.description}</p>
        </div>

        <div className="header-info">
          <div className="branch-img">
            <div className="images">
              <div className="inner-image"><img src={pic1} alt="img-fluid" /></div>
              <div className="inner-image"><img src={pic2} alt="img-fluid" /></div>
              <div className="inner-image"><img src={pic3} alt="img-fluid" /></div>
              <div className="inner-image"><img src={pic5} alt="img-fluid" /></div>
              <div className="inner-image"><img src={pic4} alt="img-fluid" /></div>
            </div>
          </div>

          <div className="service">
            <div className="title">Branch Information</div>
            <div className="info">
              <div className="item">
                <span>Open Time:</span>
                <span style={{ fontWeight: 700 }}>{branch.openTime}</span>
              </div>
              <div className="item">
                <span>Close Time:</span>
                <span style={{ fontWeight: 700 }}>{branch.closeTime}</span>
              </div>
              <div className="item">
                <span>Number of courts:</span>
                <span style={{ fontWeight: 700 }}>4</span>
              </div>
              <div className="item">
                <span>Price:</span>
                <span style={{ fontWeight: 700 }}>{branch.price}</span>
              </div>
              <div className="item">
                <span>Rating:</span>
                <span style={{ fontWeight: 700 }}>4/5 <FaStar style={{ color: "#F1C40F" }} /></span>
              </div>
            </div>
            <div className="services-info">
              <div className="service-title">Convenient Service</div>
              <div className="service-list">
                <span className="service-item"><FaWifi className="icon" /> Wifi</span>
                <span className="service-item"><FaMotorcycle className="icon" /> Motorbike Parking</span>
                <span className="service-item"><FaCar className="icon" /> Car Parking</span>
                <span className="service-item"><FaBowlFood className="icon" /> Food</span>
                <span className="service-item"><RiDrinks2Fill className="icon" /> Drinks</span>
                <span className="service-item"><MdOutlineLocalDrink className="icon" /> Free Ice Tea</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating form */}
      <div className="rating">
        <div className="rating-container">
          <h1>RATING BRANCH</h1>
          <textarea placeholder=" Please share with us some of your impressions..."></textarea>
          <div className="rating-stars">
            <p style={{ fontSize: "large" }}>How do you feel about the branch and the service? (Choosing star)</p>
            <div className="stars">
              <label>
                <input type="radio" name="rating" value="1" />
                <span> Very bad</span>
              </label>
              <label>
                <input type="radio" name="rating" value="2" />
                <span> Bad</span>
              </label>
              <label>
                <input type="radio" name="rating" value="3" />
                <span> Normal</span>
              </label>
              <label>
                <input type="radio" name="rating" value="4" />
                <span> Good</span>
              </label>
              <label>
                <input type="radio" name="rating" value="5" />
                <span> Very Good</span>
              </label>
            </div>
          </div>
          <button type="button">Rating</button>
        </div>
      </div>
      </div>
    </>
  );
};

export default memo(BookByDay);
