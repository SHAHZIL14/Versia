import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import authService from "../../services/Auth";
import { logOut } from "../../store/authentication/authenticationSlice";
import { toast } from "react-toastify";
import { Plus, Menu } from "lucide-react";
import "../index.css";
import { Tooltip, Button } from "@material-tailwind/react";
const Header = ({ isModalOpen, setIsModalOpen }) => {
  const username = useSelector((state) => state.auth.userData.name);
  const profileSrc = null || useSelector((state) => state.auth.userData.profileSource);
  const dispatch = useDispatch();
  let [isNavHidden, setIsNavHidden] = useState(true);
  let navItems = [
    {
      name: "Home",
      slug: "/home",
    },
  ];
  return (
    <>
      <div className="sticky top-0 left-0 z-10  overflow-hidden  bg-[var(--brand-color)]  flex justify-between lg:justify-center p-3 lg:p-2  box-border  items-center w-full ">
        <div className="text-3xl lg:absolute left-5  w-20 lg:w-40  text-white">
          <img src="/versia.png" className=" h-full w-full" alt="" />
        </div>
        <div
          className="h-8 w-8 absolute right-15 lg:hidden"
          id="nav-icon"
          onClick={() => setIsNavHidden((prev) => !prev)}
        >
          <Menu
            className={`${
              isNavHidden ? "" : "rotate-90 transition duration-200 ease-out"
            } h-full w-full`}
          />
        </div>
        <ul
          id=""
          className={`fixed bg-[var(--brand-color)] lg:bg-none  flex justify-between top-13 py-3 px-1  gap-0    h-fit  lg:gap-5 flex-col left-0 lg:translate-x-0 lg:w-auto lg:flex-row lg:h-fit lg:opacity-100 lg:static  w-full text-white transition-all duration-500 ease-in-out
    transform rounded-b-md ${
      isNavHidden ? "-translate-x-full" : "translate-x-0  ease-out duration-50 "
    } `}
        >
          {navItems.map((navItem) => (
            <NavLink
              to={navItem.slug}
              className={({ isActive }) =>
                `${
                  isActive ? "text-white" : "text-gray-500"
                } uppercase text-sm cursor-pointer p-2  active:text-white text-gray-500 hover:text-white`
              }
              key={navItem.slug}
            >
              {navItem.name}
            </NavLink>
          ))}
          <Tooltip
            content="Add Post"
            className=" capitalize font-medium z-20 text-[var(--brand-color)] bg-white p-1"
          >
            <Button
              onClick={() => {
                setIsNavHidden(true);
                setIsModalOpen((prev) => !prev);
              }}
              className="uppercase px-2 lg:p-1 text-sm cursor-pointer  active:text-white text-gray-500 hover:text-white shadow-none"
            >
              <Plus className="border rounded text-white" />
            </Button>
          </Tooltip>
        </ul>
        <div
          id="user-profile-button"
          className="flex justify-center items-center absolute right-2 lg:right-4  "
        >
          <Tooltip
            content="logout"
            className=" capitalize font-medium z-20 text-[var(--brand-color)] bg-white"
          >
            <Button
              sx={{
                "&:focus": {
                  backgroundColor: "transparent",
                },
                "&:active": {
                  backgroundColor: "transparent",
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={() => {
                authService
                  .logout()
                  .then(() => {
                    dispatch(logOut());
                    toast.success("Logged out successfully", {
                      className: "my-toast",
                      bodyClassName: "my-toast-body",
                    });
                  })
                  .catch((error) => {
                    toast.error(error);
                  });
              }}
              className=" uppercase  lg:mx-2 text-center font-bold  absolute right-2 lg:right-4 flex justify-center items-center cursor-pointer text-2xl"
            >
              <div
                id="profile"
                className="min-h-8 min-w-8 lg:h-12 lg:w-12 flex justify-center items-center  rounded-[50%] overflow-hidden"
              >
                {profileSrc !=null ? (
                  <img
                    className="h-8 w-8 lg:h-12 lg:w-12"
                    src={profileSrc}

                  />
                ) : (
                  <p>{username?.charAt(0)}</p>
                )}
              </div>

              {/* <CircleUserRound
              className={`h-6 w-6 text-white hover:fill-blue-400 `}
            /> */}
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
export default Header;
