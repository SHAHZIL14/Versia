import { useEffect, useState } from "react";
import { Check, CircleUser } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDot } from "react-loading-indicators";
import userServices from "../../../services/User";
import { updateFollowees } from "../../../store/authentication/authenticationSlice";
import useFollowerStore from "../../../store/followers/followersStore";

function CardHeader({ postData }) {
  const {
    incrementFollower,
    decrementFollower,
    incrementFollowing,
    decrementFollowing,
  } = useFollowerStore();
  const globalFollow = useSelector((state) =>
    state.auth.userData?.followees?.includes(postData?.authorId)
  );

  const [localFollow, setLocalFollow] = useState(globalFollow);

  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.userData.userId);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFollowClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (localFollow) {
      setLocalFollow(false);
      decrementFollower(postData.authorId);
      decrementFollowing(userId);
      try {
        await userServices.unfollow(postData.authorId, userId);
        dispatch(
          updateFollowees({
            type: "remove",
            authorId: postData.authorId,
          })
        );
      } catch (error) {
        setLocalFollow(true);
        incrementFollower(postData.authorId);
        incrementFollowing(userId);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setLocalFollow(true);
      incrementFollower(postData.authorId);
      incrementFollowing(userId);
      try {
        await userServices.follow(postData.authorId, userId);
        dispatch(updateFollowees({ type: "add", authorId: postData.authorId }));
      } catch (error) {
        setLocalFollow(false);
        decrementFollower(postData.authorId);
        decrementFollowing(userId);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    setLocalFollow(globalFollow);
  }, [globalFollow]);
  return (
    <>
      <div className="w-full  rounded-t-2xl flex gap-3 items-center justify-between bg-gray-40 px-2 py-2 ">
        {loading ? (
          <ThreeDot color={["var(--brand-color)"]} size="small" />
        ) : (
          <div
            onClick={() => {
              setLoading(true);
              if (userId == postData.authorId) {
                navigate("/profile");
              } else {
                navigate(`/user/${postData.authorId}`);
              }
              if (
                location.pathname.includes("/profile") ||
                location.pathname.includes("/user")
              ) {
                setLoading(false);
              }
            }}
            className="flex gap-2 items-center cursor-pointer"
          >
            <div className="cursor-pointer profile h-10 w-10 rounded-[50%] overflow-hidden ">
              {postData.authorProfile == "" ? (
                <CircleUser
                  className="h-full w-full"
                  color="var(--brand-color) "
                />
              ) : (
                <img
                  loading="lazy-loading"
                  src={postData.authorProfile}
                  alt="Profile"
                  className="rounded-lg w-full h-full object-cover object-center"
                />
              )}
            </div>
            <div className="about-author flex flex-col  justify-center transition-colors duration-300 text-black dark:text-[var(--dark-text)]">
              <span className="text-sm/tight font-medium">{postData.name}</span>
              <span className="text-xs">{`@${postData.username}`}</span>
            </div>
          </div>
        )}

        <div
          className={`following-button ${
            postData.authorId == userId ? "hidden" : ""
          }  ${
            localFollow
              ? "text-[var(--brand-color)] transition-colors duration-300 dark:text-[var(--brand-color-dark)]  font-medium"
              : "text-[var(--dark-text)] bg-[var(--brand-color)] "
          }  py-1 px-2 text-sm rounded-lg cursor-pointer `}
        >
          <button
            className={`cursor-pointer transition-all ease-in-out duration-100 flex items-center gap-px`}
            onClick={handleFollowClick}
          >
            <span className="inline-block transition-transform duration-200 scale-100">
              {localFollow ? `Following` : "Follow"}
            </span>
            <Check className={`${localFollow ? "" : "hidden"} h-4 `} />
          </button>
        </div>
      </div>
    </>
  );
}

export default CardHeader;
