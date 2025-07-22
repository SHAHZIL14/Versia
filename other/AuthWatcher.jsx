import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/Auth";
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

  useEffect(() => {
    authService
      .getUser()
      .then((user) => {
        if (user) {
          userServices
            .getUserInfo(user.$id)
            .then((userDoc) => {
              dispatch(
                logIn({
                  name: userDoc.username,
                  userId: user.$id,
                  profile: userDoc.profileSource,
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
  }, []); // ✅ Run only once on mount

  const loading = useSelector((state) => state.auth.loading);
  return loading ? (
    <div className="w-screen h-screen bg-black fixed top-0 left-0">Loading</div>
  ) : null;
};

export default AuthWatcher;
