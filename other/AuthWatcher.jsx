import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/Auth";
import { ThreeDot } from "react-loading-indicators";
import {
  logIn,
  logOut,
  setLoading,
} from "../store/authentication/authenticationSlice";
import userServices from "../services/User";

const AuthWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let [refreshKey, setRefreshKey] = useState(0);
  const userId = useSelector((state) => state.auth.userData.userId);
  useEffect(() => {
    if (userId) return;
    authService
      .getUser()
      .then((user) => {
        if (user && user.emailVerification) {
          userServices.getUserInfo(user.$id).then((userDoc) => {
            dispatch(
              logIn({
                name: userDoc.name,
                userName: userDoc.username,
                userId: user.$id,
                profileSource: userDoc.profileSource,
                userBio: userDoc.userBio,
              })
            );
            if (location.pathname === "/auth") {
              navigate("/home");
            }
            dispatch(setLoading(false));
          });
        } else {
          dispatch(logOut());
          if (location.pathname !== "/auth") {
            navigate("/auth");
          }
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        console.warn(error);
        dispatch(setLoading(false));
      });
  }, [refreshKey]); // ✅ Run only once on mount

  const loading = useSelector((state) => state.auth.loading);
  return loading ? (
    <div className="w-screen h-screen gap-3 flex flex-col justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot size="small" color="white" textColor="white" />
      <p className="font-bold text-xs md:text-md tracking-wider uppercase">
        recognizing you 
      </p>
    </div>
  ) : null;
};

export default AuthWatcher;

export const runAuthWatcher = () => {
  setRefreshKey((prev) => prev + 1);
};
