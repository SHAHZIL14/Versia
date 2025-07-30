import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Menu, LogOut } from "lucide-react";
import "../index.css";
import { Tooltip, Button } from "@material-tailwind/react";
import useClickOutside from "../../Hooks/useClickOutside";
import authService from "../../services/Auth";
import { logOut } from "../../store/authentication/authenticationSlice";
import { toast } from "react-toastify";


const Header = ({ options }) => {
  const username = useSelector((state) => state.auth.userData.name);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileSrc =
    null || useSelector((state) => state.auth.userData.profileSource);
  let [isNavHidden, setIsNavHidden] = useState(true);
  const optionRef = useRef();
  const navRef = useRef();
  useClickOutside(navRef, () => setIsNavHidden(true));
  useClickOutside(optionRef, () => options.setIsOptionOpen(false));
  return (
    <>
      <div className="sticky top-0 left-0 z-10    bg-[var(--brand-color)]  flex justify-between lg:justify-center p-3 lg:p-4  box-border  items-center w-full ">
        <div className="text-3xl lg:absolute left-5  w-20 lg:w-40  text-white">
          <img
            loading="lazy-loading"
            src="/versia.png"
            className=" h-full w-full"
            alt=""
          />
        </div>
        
        <div
          ref={navRef}
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
          className={`fixed bg-[var(--brand-color)] lg:bg-none  flex justify-center top-13 py-1 px-1  gap-0    h-fit  lg:gap-5 flex-col left-0 lg:translate-x-0 lg:w-auto lg:flex-row lg:h-fit lg:opacity-100 lg:static  w-full text-white transition-all duration-500 ease-in-out
    transform rounded-b-md ${
      isNavHidden ? "-translate-x-full" : "translate-x-0  ease-out duration-50 "
    } `}
        >
          <li
            onClick={() => {
              navigate("/add-post");
            }}
            className="flex items-center cursor-pointer"
          >
            <Tooltip
              content="Add Post"
              className=" capitalize font-medium z-20 text-[var(--brand-color)] bg-white p-1"
            >
              <Button className="cursor-pointer uppercase px-2 lg:p-1 text-sm  active:text-white text-gray-500 hover:text-white shadow-none">
                <Plus className="border h-4 w-4  lg:h-5 lg:w-5 rounded text-white" />
              </Button>
            </Tooltip>
            <p className="text-xs">Add Post</p>
          </li>

          <li
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
            className="flex items-center cursor-pointer"
          >
            <Tooltip
              content="Logout"
              className=" capitalize font-medium z-20 text-[var(--brand-color)] bg-white p-1"
            >
              <Button className="cursor-pointer uppercase px-2 lg:p-1 text-sm   active:text-white text-gray-500 hover:text-white shadow-none">
                <LogOut className="border h-4 lg:h-5 w-4 lg:w-5 rounded text-white" />
              </Button>
            </Tooltip>
            <p className="text-xs">Logout</p>
          </li>
        </ul>
        <div
          id="user-profile-button"
          className="flex justify-center items-center absolute right-2   "
        >
          <div
            ref={optionRef}
            onClick={() => options.setIsOptionOpen((prev) => !prev)}
            className=" uppercase  lg:mx-2 text-center font-bold  absolute right-2  flex justify-center items-center cursor-pointer text-2xl"
          >
            <div
              onClick={() => {
                navigate("/profile");
              }}
              id="profile"
              className="h-9 w-9 lg:h-12 lg:w-12 flex justify-center items-center  rounded-[50%] overflow-hidden"
            >
              {profileSrc != null ? (
                <img
                  loading="lazy-loading"
                  className="h-full w-full lg:h-12 lg:w-12 object-center object-cover"
                  src={profileSrc}
                />
              ) : (
                <p>{username?.charAt(0)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
