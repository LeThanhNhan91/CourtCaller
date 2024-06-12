import { memo, useState } from "react";
import "./style.scss";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from 'AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const [menus] = useState([
    {
      name: "Home",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Schedule Booking",
      path: ROUTERS.USER.SCHEDULEPAGE,
      isShowSubmenu: false,
      child: [
        {
          name: "Fixed Schedule",
          path: "",
        },
        {
          name: "Flexible Schedule",
          path: "",
        },
        {
          name: "Schedule By Day",
          path: "",
        },
      ],
    },
    {
      name: "About",
      path: ROUTERS.USER.PROFILE,
    },
  ]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate(ROUTERS.USER.LOGIN);
  };

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-xl-3 ">
            <div className="header_logo">
              <h1>Court Caller</h1>
            </div>
          </div>
          <div className="col-xl-6 ">
            <nav className="header_menu">
              <ul>
                {menus?.map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menu?.path}>{menu?.name}</Link>
                    {menu.child && (
                      <ul className="header_menu_dropdown">
                        {menu.child.map((childItem, childKey) => (
                          <li key={`${menuKey}-${childKey}`}>
                            <Link to={childItem.path}>{childItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-xl-3">
            <div className="header_login">
              <ul>
                {user ? (
                  <li className="profile-section">
                    <div className="profile-button" >
                      <button onClick={toggleProfilePopup}>Profile</button>
                    </div>
                    <div className={`profile-popup ${showProfilePopup ? 'active' : ''}`}>
                      <div className="profile-info">
                        <div className="profile-pic">
                          <img src="/path-to-user-avatar.jpg" alt="User Avatar" />
                         
                        </div>
                        <p>{user.email}</p>
                      </div>
                      <ul className="profile-actions">
                        <li>
                          <Link to="/profile">View profile</Link>
                        </li>
                        <li>
                          <Link to="/assign-member">Assign member (flexible time)</Link>
                        </li>
                        <li onClick={handleLogout}>
                          <a>Log out</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li>
                    <ToastContainer
                      transition={Slide}
                      autoClose={1500}
                      newestOnTop={true}
                      pauseOnHover={true}
                      pauseOnFocusLoss={false}
                      limit={5}
                    />
                    <Link to={ROUTERS.USER.LOGIN}>
                      <AiOutlineUser />
                      <span>Đăng Nhập</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default memo(Header);
