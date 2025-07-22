import { Outlet } from "react-router-dom";
import AuthWatcher from "../other/AuthWatcher";

const AuthLayout = () => {
  return (
    <>
      <AuthWatcher />
      <Outlet />
    </>
  );
};

export default AuthLayout;
