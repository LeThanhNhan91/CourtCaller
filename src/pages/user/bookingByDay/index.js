import { memo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaWifi, FaMotorcycle, FaBowlFood } from "react-icons/fa6";
import { FaCar, FaStar } from "react-icons/fa";
import { RiDrinks2Fill } from "react-icons/ri";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MdOutlineLocalDrink } from "react-icons/md";
import pic1 from "assets/users/images/byday/pic1.webp";
import pic2 from "assets/users/images/byday/pic2.webp";
import pic3 from "assets/users/images/byday/pic3.webp";
import pic4 from "assets/users/images/byday/pic4.webp";
import pic5 from "assets/users/images/byday/pic5.webp";
import { IoLocationOutline } from "react-icons/io5";
import { Box, Button, Grid, Typography, Select, MenuItem, FormControl, IconButton } from "@mui/material";
import { fetchBranches, fetchBranchById } from "api/branchApi";
import { reserveSlots } from "api/bookingApi";
import { fetchPrice } from "api/priceApi";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./styles.scss";
import "react-multi-carousel/lib/styles.css";
import "./style.scss";

dayjs.extend(isSameOrBefore);


// quy ước các ngày trong tuần thành số
const dayToNumber = {
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
  "Sunday": 7
};

//trả về mảng 2 cái ngày bắt đầu và kết thúc dạng số
const parseOpenDay = (openDay) => {
  if (!openDay || typeof openDay !== 'string') {
    console.error('Invalid openDay:', openDay);
    return [0, 0];
  }
  const days = openDay.split(' to ');
  if (days.length !== 2) {
    console.error('Invalid openDay format:', openDay);
    return [0, 0];
  }
  const [startDay, endDay] = days;
  return [dayToNumber[startDay], dayToNumber[endDay]];
};

// tạo ra mảng các ngày trong tuần
const getDaysOfWeek = (startOfWeek, openDay) => {
  let days = [];
  const [startDay, endDay] = parseOpenDay(openDay);
  if (startDay === 0 || endDay === 0) {
    console.error('Invalid days parsed:', { startDay, endDay });
    return days;
  }

  for (var i = startDay; i <= endDay; i++) {
    days.push(dayjs(startOfWeek).add(i, 'day'));
  }

  return days;
};

// hàm generate các slot từ openTime đến closeTime
const generateTimeSlots = (openTime, closeTime) => {
  let slots = [];
  for (let hour = openTime; hour < closeTime; hour++) {
    const start = formatTime(hour);
    const end = formatTime(hour + 1);
    slots.push(`${start} - ${end}`);
  }
  return slots;
};

const formatTime = (time) => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes}`;
};

const timeStringToDecimal = (timeString) => {
  const date = new Date(`1970-01-01T${timeString}Z`);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  return hours + minutes / 60 + seconds / 3600;
};

const BookByDay = () => {
  const location = useLocation();
  const { branch } = location.state;

  const [selectedBranch, setSelectedBranch] = useState(branch.branchId);
  const [showAfternoon, setShowAfternoon] = useState(false);
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf('week'));
  const [weekdayPrice, setWeekdayPrice] = useState(0);
  const [weekendPrice, setWeekendPrice] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [openTime, setOpentime] = useState(branch.openTime);
  const [closeTime, setClosetime] = useState(branch.closeTime);
  const [openDay, setOpenDay] = useState(branch.openDay);
  const [weekDays, setWeekDays] = useState([]);
  const [morningTimeSlots, setMorningTimeSlots] = useState([]);
  const [afternoonTimeSlots, setAfternoonTimeSlots] = useState([]);
  const navigate = useNavigate();
  const currentDate = dayjs();
  const [highlightedStars, setHighlightedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewFormVisible, setReviewFormVisible] = useState(false);


  console.log(branch.branchId)
  const handleStarClick = (value) => {
    setHighlightedStars(value);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.Id;
    
    const reviewData = {
      reviewText,
      rating: highlightedStars,
      userId,
      branchId: branch.branchId, // Đảm bảo rằng branchId đang được cung cấp ở đây nếu cần
    };

    try {
      await axios.post('https://courtcaller.azurewebsites.net/api/Reviews', reviewData);
      setReviewFormVisible(false);
      // Xử lý sau khi gửi đánh giá thành công (ví dụ: thông báo cho người dùng, cập nhật danh sách đánh giá, v.v.)
    } catch (error) {
      console.error('Error submitting review', error);
      // Xử lý lỗi khi gửi đánh giá
    }
  };

  // fetch giá theo branch đã chọn
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const prices = await fetchPrice(selectedBranch);
        setWeekdayPrice(prices.weekdayPrice);
        setWeekendPrice(prices.weekendPrice);
      } catch (error) {
        console.error('Error fetching prices', error);
      }
    };

    fetchPrices();
  }, [selectedBranch]);

  // Parse openDay và lấy ngày trong tuần
  useEffect(() => {
    if (openDay) {
      const days = getDaysOfWeek(startOfWeek, openDay);
      setWeekDays(days);
      //console.log('Computed weekDays:', days);
    }
  }, [openDay, startOfWeek]);

  // tạo ra các slot nhỏ sáng từ opentime đến 14h 
  useEffect(() => {
    if (openTime && '14:00:00') {
      const decimalOpenTime = timeStringToDecimal(openTime);
      const decimalCloseTime = timeStringToDecimal('14:00:00');
      //console.log('decimalOpenTime:', decimalOpenTime);
      //console.log('decimalCloseTime:', decimalCloseTime);
      const timeSlots = generateTimeSlots(decimalOpenTime, decimalCloseTime);
      setMorningTimeSlots(timeSlots);
      //console.log('generate timeSlots:', timeSlots);
    }
  }, [openTime]);

  // tạo ra các slot nhỏ chiều từ 14h đến closeTime
  useEffect(() => {
    if (closeTime && '14:00:00') {
      const decimalOpenTime = timeStringToDecimal('14:00:00');
      const decimalCloseTime = timeStringToDecimal(closeTime);
      //console.log('decimalOpenTime:', decimalOpenTime);
      //console.log('decimalCloseTime:', decimalCloseTime);
      const timeSlots = generateTimeSlots(decimalOpenTime, decimalCloseTime);
      setAfternoonTimeSlots(timeSlots);
      //console.log('generate timeSlots:', timeSlots);
    }
  }, [closeTime]);

  // xử lý khi click vào slot
  const handleSlotClick = (slot, day, price) => {
    const slotId = `${day.format('YYYY-MM-DD')}_${slot}_${price}`;
 
    // Tìm tất cả các slot cùng thời gian đã được chọn
    const sameTimeSlots = selectedSlots.filter(selectedSlot => selectedSlot.slotId.startsWith(`${day.format('YYYY-MM-DD')}_${slot}`));

    // Nếu slot đã chọn tồn tại và đã chọn đủ 2 slot cùng thời gian, hủy chọn slot đầu tiên
    if (sameTimeSlots.length >= 2) {
      const firstSlotId = sameTimeSlots[0].slotId;
      setSelectedSlots(selectedSlots.filter(selectedSlot => selectedSlot.slotId !== firstSlotId));
    } else {
      // Nếu tổng số slot đã chọn nhỏ hơn 3, thêm slot mới
      if (selectedSlots.length < 3) {
        setSelectedSlots([...selectedSlots, { slotId, slot, day, price }]);
      } else {
        alert("You can select up to 3 slots only");
      }
    }
  };

  const handleRemoveSlot = (slotId) => {
    setSelectedSlots(selectedSlots.filter(selectedSlot => selectedSlot.slotId !== slotId));
  };

  // xử lý nút sáng chiều
  const handleToggleMorning = () => {
    setShowAfternoon(false);
  };

  const handleToggleAfternoon = () => {
    setShowAfternoon(true);
  };

  // xử lý chỉ hiện 1 tuần trước và các tuần sau
  const handlePreviousWeek = () => {
    const oneWeekBeforeCurrentWeek = dayjs().startOf('week').subtract(1, 'week');
    if (!dayjs(startOfWeek).isSame(oneWeekBeforeCurrentWeek, 'week')) {
      setStartOfWeek(oneWeekBeforeCurrentWeek);
    }
  };

  const handleNextWeek = () => {
    setStartOfWeek(dayjs(startOfWeek).add(1, 'week'));
  };

  // xử lý khi click vào nút continue qua trang tiếp theo 
  //(Nhân lấy về cần chú ý là chỉ lấy các slot đã click qua trang mới chứ chưa post api booking, và chưa lấy userid)
  const handleContinue = async () => {
    if (!selectedBranch) {
      alert("Please select a branch first");
      return;
    }

    const bookingRequests = selectedSlots.map((slot) => {
      const { day, slot: timeSlot, price } = slot;
      const [slotStartTime, slotEndTime] = timeSlot.split(' - ');

      return {
        slotDate: day.format('YYYY-MM-DD'),
        timeSlot: {
          slotStartTime: `${slotStartTime}:00`,
          slotEndTime: `${slotEndTime}:00`,
        },
        price: parseFloat(price),
      };
    });

    navigate("/payment-detail", {
      state: {
        branchId: selectedBranch,
        bookingRequests,
        totalPrice: bookingRequests.reduce((totalprice, object) => totalprice + parseFloat(object.price), 0),
      },
    });
  };

  const days = weekDays;

  return (
    <>
      <div style={{ backgroundColor: "#EAECEE" }}>
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
                  <span style={{ fontWeight: 700 }}>{branch.branchId}</span>
                </div>
                <div className="item">
                  <span>Price (Weekday):</span>
                  <span style={{ fontWeight: 700 }}>{weekdayPrice} VND</span>
                </div>
                <div className="item">
                  <span>Price (Weekend):</span>
                  <span style={{ fontWeight: 700 }}>{weekendPrice} VND</span>
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

        <Box m="20px" className="max-width-box" sx={{ backgroundColor: "#F5F5F5", borderRadius: 2, p: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
            <FormControl sx={{ minWidth: 200, backgroundColor: "#0D1B34", borderRadius: 1 }}>
              <Typography
                labelid="branch-select-label"
                value={selectedBranch}
                sx={{ color: "#FFFFFF", p: 2 }}
              >
                {selectedBranch}
              </Typography>
            </FormControl>

            {/* Khung ngày */}
            <>
              {branch.branchId && (
                <Box display="flex" alignItems="center" sx={{ backgroundColor: "#E0E0E0", p: 1, borderRadius: 2 }}>
                  <IconButton onClick={handlePreviousWeek} size="small">
                    <ArrowBackIosIcon fontSize="inherit" />
                  </IconButton>
                  <Typography variant="h6" sx={{ color: "#0D1B34", mx: 1 }}>
                    From {dayjs(startOfWeek).add(1, 'day').format('D/M')} To {dayjs(startOfWeek).add(7, 'day').format('D/M')}
                  </Typography>
                  <IconButton onClick={handleNextWeek} size="small">
                    <ArrowForwardIosIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              )}
            </>
            <>
              {branch.branchId && (
                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: showAfternoon ? "#FFFFFF" : "#0D1B34",
                      color: showAfternoon ? "#0D1B34" : "white",
                      mr: 1,
                      textTransform: "none",
                      marginBottom: '0'
                    }}
                    onClick={handleToggleMorning}
                  >
                    Morning
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: showAfternoon ? "#0D1B34" : "#FFFFFF",
                      color: showAfternoon ? "white" : "#0D1B34",
                      textTransform: "none",
                      marginBottom: '0'
                    }}
                    onClick={handleToggleAfternoon}
                  >
                    Afternoon
                  </Button>
                </Box>
              )}
            </>
          </Box>

          {days.map((day, dayIndex) => (
            <Grid container spacing={2} key={dayIndex} alignItems="center">
              <Grid item xs={1} padding="8px">
                <Box
                  sx={{
                    backgroundColor: "#0D61F2",
                    color: "white",
                    width: "100%",
                    textAlign: "center",
                    padding: "8px",
                    borderRadius: "4px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body2" component="div">
                    {day.format('ddd')}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {day.format('D/M')}
                  </Typography>
                </Box>
              </Grid>

              {(showAfternoon ? afternoonTimeSlots : morningTimeSlots).map((slot, slotIndex) => {
                const price = day.day() >= 1 && day.day() <= 5 ? weekdayPrice : weekendPrice; // Monday to Friday for weekdays, Saturday to Sunday for weekends
                const slotId = `${day.format('YYYY-MM-DD')}_${slot}_${price}`;
                const isSelected = selectedSlots.some(selectedSlot => selectedSlot.slotId === slotId);
                const slotCount = selectedSlots.filter(selectedSlot => selectedSlot.slotId === slotId).length;

                return (
                  <Grid item xs key={slotIndex}>
                    <Button
                      onClick={() => handleSlotClick(slot, day, price)}
                      sx={{
                        backgroundColor: day.isBefore(currentDate, 'day') ? "#E0E0E0" : isSelected ? "#1976d2" : "#D9E9FF",
                        color: isSelected ? "#FFFFFF" : "#0D1B34",
                        p: 2,
                        borderRadius: 2,
                        width: "100%",
                        textTransform: "none",
                        border: isSelected ? '2px solid #0D61F2' : '1px solid #90CAF9',
                        textAlign: 'center',
                        marginBottom: '16px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                      m="10px"
                      disabled={day.isBefore(currentDate, 'day')}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: isSelected ? "#FFFFFF" : "#0D1B34"
                          }}
                        >
                          {slot}
                        </Typography>
                        <Typography
                          sx={{
                            color: isSelected ? "#FFFFFF" : "#0D1B34"
                          }}
                        >
                          {price}k
                        </Typography>
                        {isSelected && (
                          <IconButton
                            onClick={(e) => { e.stopPropagation(); handleRemoveSlot(slotId); }}
                            sx={{
                              position: 'absolute',
                              top: 5,
                              left: 5,
                              backgroundColor: '#FFFFFF',
                              color: '#1976d2',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            -
                          </IconButton>
                        )}
                        {isSelected && (
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              backgroundColor: '#FFFFFF',
                              color: '#1976d2',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            {slotCount}
                          </Typography>
                        )}
                      </Box>
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          ))}
          <>
            {branch.branchId && (
              <Box display="flex" justifyContent="end" mt={1} marginRight={'12px'}>
                <Button
                  variant="contained"
                  sx={{
                    color: "white",
                    backgroundColor: "#1976d2",
                    ':hover': {
                      backgroundColor: '#1565c0',
                    },
                    ':active': {
                      backgroundColor: '#1976d2',
                    },
                  }}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </Box>
            )}
          </>
        </Box>

        {/* Rating form */}
        <div className="rating-form">
      <div className="rating-container">
        <h2>Đánh giá sân thể thao</h2>
        <div className="average-rating">
          <div className="average-score">
            <span className="score">5.0</span>
            <span className="star">★</span>
          </div>
          <div>
            <button className="rating-button" onClick={() => setReviewFormVisible(true)}>Đánh giá và nhận xét</button>
          </div>
        </div>
        <div className="rating-bars">
          <div className="rating-bar">
            <span className="stars">★★★★★</span>
            <div className="bar"><div className="fill" style={{ width: '0%' }}></div></div>
            <span className="percentage">0%</span>
          </div>
          <div className="rating-bar">
            <span className="stars">★★★★☆</span>
            <div className="bar"><div className="fill" style={{ width: '0%' }}></div></div>
            <span className="percentage">0%</span>
          </div>
          <div className="rating-bar">
            <span className="stars">★★★☆☆</span>
            <div className="bar"><div className="fill" style={{ width: '0%' }}></div></div>
            <span className="percentage">0%</span>
          </div>
          <div className="rating-bar">
            <span className="stars">★★☆☆☆</span>
            <div className="bar"><div className="fill" style={{ width: '0%' }}></div></div>
            <span className="percentage">0%</span>
          </div>
          <div className="rating-bar">
            <span className="stars">★☆☆☆☆</span>
            <div className="bar"><div className="fill" style={{ width: '0%' }}></div></div>
            <span className="percentage">0%</span>
          </div>
        </div>
        {reviewFormVisible && (
          <div id="review-form">
            <h2>Gửi nhận xét của bạn</h2>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(value => (
                <span
                  key={value}
                  className={`rating-star ${highlightedStars >= value ? 'highlight' : ''}`}
                  data-value={value}
                  onClick={() => handleStarClick(value)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-review">
              <textarea
                placeholder="Nhận xét của bạn về sân này"
                value={reviewText}
                onChange={handleReviewTextChange}
              ></textarea>
            </div>
            <button className="submit-rating" onClick={handleSubmitReview}>Gửi đánh giá</button>
          </div>
        )}
      </div>
    </div>
      </div>
    </>
  );
};

export default memo(BookByDay);
