import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/homePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/user/theme/masterLayout";
import ProfilePage from "./pages/user/profilePage";
import SchedulePage from "pages/user/schedulePage";
import Login from "pages/user/login";


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