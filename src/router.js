import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/homePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/user/theme/masterLayout";
import ProfilePage from "./pages/user/profilePage";
import SchedulePage from "pages/user/schedulePage";
import Login from "pages/user/login";
import NewsPage from "pages/user/newsPage";
import BookedPage from "pages/user/bookedPage"
import BookByDay from "pages/user/bookingByDay"
import PaymentDetail from "pages/user/Payment/PaymentDetails";
import PaymentFailed from "pages/user/Payment/PaymentFailed";
import PaymentSuccessful from "pages/user/Payment/PaymentSuccessful";

const renderUserRouter = () => {
    const userRouters  = [
        {
            path: ROUTERS.USER.HOME,
            component: <HomePage/>
        },
        {
            path: ROUTERS.USER.SCHEDULEPAGE,
            component: <SchedulePage/>
        },
        {
            path: ROUTERS.USER.PROFILE,
            component: <ProfilePage/>
        },
        {
            path: ROUTERS.USER.NEWS,
            component: <NewsPage/>
        },
        {
            path: ROUTERS.USER.BOOKED,
            component: <BookedPage/>
        },
        {
            path: ROUTERS.USER.BYDAY,
            component: <BookByDay/>
        }
        ,
        {
            path: ROUTERS.USER.PAYMENTDETAIL,
            component: <PaymentDetail/>
        },
        {
            path: ROUTERS.USER.PAYMENTFAILED,
            component: <PaymentFailed/>
        },
        {
            path: ROUTERS.USER.PAYMENTSUCCESSFUL,
            component: <PaymentSuccessful/>
        } 
    ]

    return(
        <MasterLayout>
        <Routes>
            {
                userRouters.map((item, key)=>(
                    <Route key={key} path={item.path} element={item.component} />
                ))}
        </Routes>
        </MasterLayout>
    );
};

const RouterCustom = () => {
    return (
        <Routes>
            <Route path={ROUTERS.USER.LOGIN} element={<Login />} />
            <Route path="/*" element={renderUserRouter()} />
        </Routes>
    )
};

export default RouterCustom;