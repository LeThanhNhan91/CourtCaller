import { memo, useState } from "react";
import "./style.scss";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ROUTERS } from "utils/router";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Header = () => {
  // const [isShowCategories, setShowCategories] = useState(true);
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
                <div className="login_link">
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
                </div>
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
