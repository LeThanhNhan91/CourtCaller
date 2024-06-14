import { memo, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import feature1Img from "assets/users/images/featured/images.jpg";
import hero from "assets/users/images/categories/image.png";
import cat1Img from "assets/users/images/categories/cat-1.png";
import cat2Img from "assets/users/images/categories/cat-2.png";
import cat3Img from "assets/users/images/categories/cat-3.png";
import cat4Img from "assets/users/images/categories/cat-4.png";
import { AiOutlinePhone, AiOutlineSearch } from "react-icons/ai";
import "./style.scss";

const HomePage = () => {
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const courts = [
    {
      name: "Sân 1",
      area: "Quận 1",
      availableCourts: 5,
      pricePerHour: 100000,
      image: feature1Img,
    },
    {
      name: "Sân 2",
      area: "Quận 2",
      availableCourts: 3,
      pricePerHour: 120000,
      image: feature1Img,
    },
    {
      name: "Sân 3",
      area: "Quận 3",
      availableCourts: 2,
      pricePerHour: 150000,
      image: feature1Img,
    },
    {
      name: "Sân 4",
      area: "Quận 4",
      availableCourts: 4,
      pricePerHour: 130000,
      image: feature1Img,
    },
    {
      name: "Sân 5",
      area: "Quận 5",
      availableCourts: 1,
      pricePerHour: 140000,
      image: feature1Img,
    },
    {
      name: "Sân 6",
      area: "Quận 6",
      availableCourts: 6,
      pricePerHour: 110000,
      image: feature1Img,
    },
    {
      name: "Sân 7",
      area: "Quận 7",
      availableCourts: 2,
      pricePerHour: 125000,
      image: feature1Img,
    },
    {
      name: "Sân 8",
      area: "Quận 8",
      availableCourts: 3,
      pricePerHour: 135000,
      image: feature1Img,
    },
    {
      name: "Sân 9",
      area: "Quận 9",
      availableCourts: 4,
      pricePerHour: 140000,
      image: feature1Img,
    },
    {
      name: "Sân 10",
      area: "Quận 10",
      availableCourts: 5,
      pricePerHour: 150000,
      image: feature1Img,
    },
    {
      name: "Sân 11",
      area: "Quận 11",
      availableCourts: 6,
      pricePerHour: 160000,
      image: feature1Img,
    },
    {
      name: "Sân 12",
      area: "Quận 12",
      availableCourts: 7,
      pricePerHour: 170000,
      image: feature1Img,
    },
    {
      name: "Sân 13",
      area: "Quận 13",
      availableCourts: 7,
      pricePerHour: 170000,
      image: feature1Img,
    },
  ];

  const itemsPerPage = 9;
  const totalPages = Math.ceil(courts.length / itemsPerPage);

  const handleSearch = () => {
    console.log("Searching for", district, city, searchQuery);
    // Implement search functionality here
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const displayCourts = courts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Search Begin */}
      <div className="select_bar container">
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">Chọn quận</option>
          <option value="District 1">Quận 1</option>
          <option value="District 2">Quận 2</option>
          <option value="District 3">Quận 3</option>
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Chọn thành phố</option>
          <option value="Ho Chi Minh City">Thành phố Hồ Chí Minh</option>
          <option value="Hanoi">Hà Nội</option>
          <option value="Da Nang">Đà Nẵng</option>
        </select>
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {/* Search End */}

      {/* Booking court */}
      <div className="container booking_court">
        <h1>Đặt Sân</h1>
        <div className="search_bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm, địa điểm, v.v."
          />
          <button onClick={handleSearch}>
            <AiOutlineSearch />
          </button>
        </div>
        <div className="row booking_court_container">
          {displayCourts.map((court, index) => (
            <div
              className="booking_court_detail col-lg-3 col-md-4 col-sm-6"
              key={index}
            >
              <img src={court.image} alt="san" />
              <h3>{court.name}</h3>
              <p>Khu vực: {court.area}</p>
              <p>Số sân trống: {court.availableCourts}</p>
              <p>Giá cho mỗi giờ: {court.pricePerHour} VND</p>
              <button>Đặt ngay</button>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {/* Booking court End */}

      {/* Introduction Begin */}
      <div className="container">
        <h1>Lý do chọn đặt sân</h1>
        <div className="">
          <img src={hero} alt="hero" />
        </div>
      </div>
      {/* Introduction End */}

      {/* Image Begin */}
      <div className="cat_info container">
        <div className="cat_info_pic col-lg-3 col-md-4 col-sm-6">
          <img src={cat1Img} alt="cat" />
          <h3>Đặt lịch nhanh chóng</h3>
          <p>Hoạt động trong 60 thành phố</p>
        </div>
        <div className="cat_info_pic col-lg-3 col-md-4 col-sm-6">
          <img src={cat2Img} alt="cat" />
          <h3>Tiết kiệm thời gian</h3>
          <p>Luôn đảm bảo đúng giờ</p>
        </div>
        <div className="cat_info_pic col-lg-3 col-md-4 col-sm-6">
          <img src={cat3Img} alt="cat" />
          <h3>Giao dịch an toàn</h3>
          <p>100% đáng tin cậy</p>
        </div>
        <div className="cat_info_pic col-lg-3 col-md-4 col-sm-6">
          <img src={cat4Img} alt="cat" />
          <h3>Nhiều dịch vụ đa dạng</h3>
          <p>Nhiều ưu đãi hấp dẫn</p>
        </div>
      </div>
      {/* Image End */}
    </>
  );
};

export default memo(HomePage);
