import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import authService from "../../services/Auth";
import { logOut } from "../../store/authentication/authenticationSlice";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import "../index.css";
import { Tooltip, Button } from "@material-tailwind/react";
const Header = ({ setIsModalOpen }) => {
  const username = useSelector((state) => state.auth.userData.name);
  const profileSrc = useSelector((state) => state.auth.userData.profile);
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
      <div className="sticky z-10 top-0 left-0  overflow-hidden bg-[var(--brand-color)] flex justify-between lg:justify-center p-3 lg:p-2  box-border  items-center w-full ">
        <div className="text-3xl lg:absolute left-5  w-20 lg:w-40  text-white">
          <img src="/versia.png" className=" h-full w-full" alt="" />
        </div>
        <div
          className="h-10 w-10 absolute right-15 lg:hidden"
          id="nav-icon"
          onClick={() => setIsNavHidden((prev) => !prev)}
        >
          <img src="/hamburgerIcon.svg" alt="" />
        </div>
        <ul
          id=""
          className={`fixed bg-[var(--brand-color)] flex justify-between top-13 p-3  gap-2    h-fit  lg:gap-5 flex-col left-0 lg:translate-x-0 lg:w-auto lg:flex-row lg:h-fit lg:opacity-100 lg:static  w-full text-white transition-all duration-500 ease-in-out
    transform ${
      isNavHidden
        ? "-translate-x-full opacity-0 "
        : "translate-x-0 opacity-100 "
    } `}
        >
          {navItems.map((navItem) => (
            <NavLink
              to={navItem.slug}
              className={({ isActive }) =>
                `${
                  isActive ? "text-white" : "text-gray-500"
                } uppercase text-sm cursor-pointer  active:text-white text-gray-500 hover:text-white`
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
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="uppercase text-sm cursor-pointer  active:text-white text-gray-500 hover:text-white shadow-none"
            >
              <Plus className="border rounded text-white" />
            </Button>
          </Tooltip>
        </ul>
        <div
          id="user-profile-button"
          className="flex justify-center items-center  "
        >
          <Tooltip content='logout' className=' capitalize font-medium z-20 text-[var(--brand-color)] bg-white p-1'>
            <Button
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
              className="rounded-[50%] uppercase  lg:mx-2 text-center font-bold  absolute right-2 lg:right-4 flex justify-center items-center cursor-pointer text-2xl"
            >
              <div
                id="profile"
                className="h-7 w-7 lg:h-10 lg:w-10 flex justify-center items-center  rounded-[50%] overflow-hidden"
              >
                {profileSrc ? (
                  <img
                    className="h-full w-full"
                    src={profileSrc}
                    alt={username.charAt(0)}
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
