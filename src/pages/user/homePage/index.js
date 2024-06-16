import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "react-multi-carousel/lib/styles.css";
import feature1Img from "assets/users/images/featured/images.jpg";
import hero from "assets/users/images/categories/image.png";
import cat1Img from "assets/users/images/categories/cat-1.png";
import cat2Img from "assets/users/images/categories/cat-2.png";
import cat3Img from "assets/users/images/categories/cat-3.png";
import cat4Img from "assets/users/images/categories/cat-4.png";
import { AiOutlineSearch } from "react-icons/ai";
import "./style.scss";

Modal.setAppElement('#root'); // Add this to avoid screen readers issues

const HomePage = () => {
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [branchs, setBranchs] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 9;
  const totalPages = Math.ceil(branchs.length / itemsPerPage);

  useEffect(() => {
    const fetchBranchs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://courtcaller.azurewebsites.net/api/Branches?pageNumber=${currentPage}&pageSize=${itemsPerPage}`
        );
        const data = await response.json();
        setBranchs(data);
        await fetchPrices(data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchBranchs();
  }, [currentPage]);

  const fetchPrices = async (branchData) => {
    const pricesData = {};
    for (const branch of branchData) {
      try {
        const response = await fetch(
          `https://courtcaller.azurewebsites.net/api/Prices/showprice`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ branchId: branch.branchId }),
          }
        );
        const data = await response.json();
        pricesData[branch.branchId] = data.price;
      } catch (err) {
        console.error(`Failed to fetch price for branch ${branch.branchId}`);
      }
    }
    setPrices(pricesData);
  };

  const handleSearch = () => {
    console.log("Searching for", district, city, searchQuery);
    // Implement search functionality here
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const displayBranchs = branchs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBookNow = (branch) => {
    setSelectedBranch(branch);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleScheduleByDay = () => {
    navigate("/bookbyday", { state: { branch: selectedBranch } });
  };

  return (
    <>
    <div style={{backgroundColor: "#EAECEE"}}>
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

      {/* Search Begin */}
      <div className="select_bar container">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">City</option>
          <option value="Ho Chi Minh City">Thành phố Hồ Chí Minh</option>
          <option value="Hanoi">Hà Nội</option>
          <option value="Da Nang">Đà Nẵng</option>
        </select>

        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">District</option>
          <option value="District 1">Quận 1</option>
          <option value="District 2">Quận 2</option>
          <option value="District 3">Quận 3</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search End */}

      {/* Booking branch */}
      <div className="container booking_branch">
        <h1>Đặt Sân</h1>
        <div className="search_bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Searching branch by name"
          />
          <button onClick={handleSearch}>
            <AiOutlineSearch />
          </button>
        </div>
        <div className="row booking_branch_container">
          {displayBranchs.map((branch, index) => (
            <div
              className="booking_branch_detail col-lg-3 col-md-4 col-sm-6"
              key={index}
            >
              <img src={branch.image || feature1Img} alt="san" />
              <h3>{branch.branchName}</h3>
              {/* <p>Số sân trống: {branch.availableBranchs}</p> */}
              <p>Number of courts: 4</p>
              <p>Address: {branch.branchAddress}</p>
              <p>Price per hour: {prices[branch.branchId] || 'Loading...'} VND</p>
              <button onClick={() => handleBookNow(branch)}>Book now</button>
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
      {/* Booking branch End */}

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
          <h3>Chất lượng cao</h3>
          <p>Cung cấp chất lượng sân tốt nhất</p>
        </div>
        <div className="cat_info_pic col-lg-3 col-md-4 col-sm-6">
          <img src={cat4Img} alt="cat" />
          <h3>Hỗ trợ 24/7</h3>
          <p>Luôn sẵn sàng hỗ trợ khách hàng</p>
        </div>
      </div>
      {/* Image End */}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Select the Type of Booking</h2>
        <button onClick={() => alert("Fixed Schedule Selected")}>Fixed Schedule</button>
        <button onClick={handleScheduleByDay}>Schedule by Day</button>
      </Modal>
      </div>
    </>
  );
};

export default memo(HomePage);
