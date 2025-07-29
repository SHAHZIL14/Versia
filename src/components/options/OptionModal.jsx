import { CircleUserRound, LogOut } from "lucide-react";
import authService from "../../../services/Auth";
import { useDispatch } from "react-redux";
import { logOut } from "../../../store/authentication/authenticationSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const OptionModal = ({ isOptionOpen, setIsOptionOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      className={`${
        isOptionOpen
          ? "translate-y-full bg-[var(--brand-color)] lg:bg-transparent opactiy-100   "
          : "-translate-y-full bg-transparent opacity-0"
      } -z-10 h-full transition -top-1 text-xs lg:text-sm ease-in-out duration-200  absolute  p-1 right-0  text-white rounded-b-lg`}
    >
      <ul className="px-2">
        <li
          onClick={() => navigate(`/profile`)}
          className="px-2 transition duration-300 rounded-lg ease-in-out cursor-pointer  my-1  flex gap-x-3 items-center capitalize"
        >
          <CircleUserRound
            color="white "
            className="h-5 w-5 lg:h-auto lg:w-auto"
          />
          <p>profile</p>
        </li>
        <li
          onClick={() => {
            
          }}
          className="px-2 transition duration-300 rounded-lg ease-in-out cursor-pointer my-1 flex gap-x-3 items-center capitalize"
        >
          <LogOut
            color="white"
            className="h-5 w-5 lg:h-auto lg:w-auto"
          />
          <p>logout</p>
        </li>
      </ul>
    </div>
  );
};

export default OptionModal;
