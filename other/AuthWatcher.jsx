import { useSelector, useDispatch } from "react-redux";
import { useEffect,useState } from "react";
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
  let [refreshKey,setRefreshKey] = useState(0);
  useEffect(() => {
    authService
      .getUser()
      .then((user) => {
        if (user && user.emailVerification) {
          userServices.getUserInfo(user.$id).then((userDoc) => {
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
            setTimeout(() => dispatch(setLoading(false)), 1000);
          });
        } else {
          dispatch(logOut());
          if (location.pathname !== "/auth") {
            navigate("/auth");
          }
          setTimeout(() => dispatch(setLoading(false)), 1000);
        }
      })
      .catch((error) => {
        console.warn(error);
        dispatch(setLoading(false));
      });
  }, [refreshKey]); // ✅ Run only once on mount

  const loading = useSelector((state) => state.auth.loading);
  return loading ? (
    <div className="w-screen h-screen flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot
        color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
        text="Recognizing you"
        textColor="white"
      />
    </div>
  ) : null;
};

export default AuthWatcher;

export const runAuthWatcher =()=>{setRefreshKey((prev)=>prev+1)};