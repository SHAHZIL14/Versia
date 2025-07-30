import {
  useLoaderData,
  useNavigate,
  useFetcher,
  useLocation,
} from "react-router-dom";
import userServices from "../../../services/User";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "../../../context/userContext";
import { useState, useEffect, use } from "react";
import { ThreeDot, FourSquare } from "react-loading-indicators";
import { motion } from "motion/react";
import { Cross, Edit, Save, X } from "lucide-react";
import { updateBio } from "../../../store/authentication/authenticationSlice";
function ProfilePage({ mode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [bioLoading, setBioLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [editable, setEditable] = useState(false);
  const { userPosts: currentUserPosts } = useUser();
  const currentUserData = useSelector((state) => state.auth.userData);
  const loaderData = useLoaderData();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    profileURL: "",
    userPosts: [],
    userBio: "",
  });

  useEffect(() => {
    if (mode === "current") {
      setUserData({
        name: currentUserData.name,
        username: currentUserData.userName,
        profileURL: currentUserData.profileSource,
        userPosts: currentUserPosts || [],
        userBio: currentUserData.userBio,
      });
    } else {
      setUserData({
        name: loaderData.name,
        username: loaderData.username,
        profileURL: loaderData.profileURL,
        userPosts: loaderData.userPosts || [],
        userBio: loaderData.userBio,
      });
    }
    setTimeout(() => setLoading(false), 200);
  }, [mode, currentUserData, currentUserPosts, loaderData]);

  useEffect(() => setBio(userData.userBio), [userData]);

  const handleBioSave = async () => {
    setEditable((prev) => !prev);
    setBioLoading(true);
    userServices
      .updateUserBio(bio, currentUserData.userId )
      .then(() => {
        console.log("successfully updated bio");
        dispatch(updateBio(bio));
        setBioLoading(false);
      })
      .catch(() => {
        console.log("failed updating bio");
        setBioLoading(false);
      });
  };
  return loading ? (
    <div className="w-screen h-screen z-50 flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot
        color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
        textColor="white"
      />
    </div>
  ) : (
    <div id="profile" className="min-h-screen w-screen bg-white">
      <div className="flex flex-col text-[var(--brand-color)] py-3 px-2">
        <div className="flex gap-0">
          <div className="w-[50%] py-5 flex flex-col gap-5 justify-center items-start">
            <img
              className="object-cover object-center h-24 w-24 lg:w-38 lg:h-38 rounded-full"
              src={userData.profileURL ? userData.profileURL : "a"}
              alt="profile"
            />
            <div>
              <p className="text-xs lg:text-lg font-semibold">
                {userData.name}
              </p>
              <p className="text-xs lg:text-lg ">@{userData.username}</p>
            </div>
          </div>
          <div className="w-[50%] py-7 flex flex-col gap-5 items-center justify-start">
            <div className="flex gap-x-5">
              <div className="flex flex-col text-xs lg:text-lg  items-center p-1">
                <span className="uppercase font-semibold">posts</span>
                <span>{userData.userPosts?.length || 0}</span>
              </div>
              <div className="flex flex-col text-xs lg:text-lg  items-center p-1">
                <span className="uppercase font-semibold">followers</span>
                <span>0</span>
              </div>
            </div>
            {mode !== "current" &&
              currentUserData.userId !== loaderData.userId && (
                <button className="text-xs lg:text-lg  uppercase bg-[var(--brand-color)] text-white w-36 py-1 rounded">
                  Follow
                </button>
              )}
          </div>
        </div>

        {bioLoading ? (
          <FourSquare
            size="small"
            speedPlus={2}
            color={["#000000", "#082828", "#115252", "#1a7c7c"]}
          />
        ) : (
          <div>
            <span className="font-semibold text-xs lg:text-lg justify-start items-center gap-x-5 flex ">
              <span>BIO</span>
              <span className="flex gap-x-5">
                {editable ? (
                  <>
                    <Save
                      className="h-4 w-4 lg:h-5 cursor-pointer lg:w-5"
                      onClick={handleBioSave}
                    />
                    <X
                      className="h-4 w-4 lg:h-5 cursor-pointer lg:w-5"
                      onClick={() => setEditable((prev) => !prev)}
                    />
                  </>
                ) : (
                  <>
                    {mode == "current" ? (
                      <Edit
                        className="h-4 w-4 lg:h-5 cursor-pointer lg:w-5"
                        onClick={() => setEditable((prev) => !prev)}
                      />
                    ) : (
                      currentUserData.userId == loaderData.userId && (
                        <Edit
                          className="h-4 w-4 lg:h-5 cursor-pointer lg:w-5"
                          onClick={() => setEditable((prev) => !prev)}
                        />
                      )
                    )}
                  </>
                )}
              </span>
            </span>
            <p className="text-xs lg:text-lg  flex h-fit ">
              <textarea
                className={`${
                  editable
                    ? "border-b border-black/10 caret-[var(--brand-color)]"
                    : ""
                } resize-none mt-1 w-full wrap-anywhere h-fit font-medium focus:ring-0  outline-none`}
                type="text"
                placeholder="Add your bio.."
                readOnly={!editable}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 text-black gap-0 w-full">
        {userData.userPosts?.map((eachPost) => (
          <motion.div
            key={eachPost.$id}
            className="hover:brightness-75 cursor-pointer post overflow-hidden h-60 lg:h-96 lg:w-full"
          >
            <img
              onClick={() => {
                setLoading(true);
                navigate(
                  `/user/${currentUserData.userId}/post/${eachPost.$id}`
                );
                if (location.pathname.includes("post/")) setLoading(false);
              }}
              className="object-center object-cover h-full w-full"
              src={eachPost.imageURL}
              alt="unable to fetch"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;

export const userInfoLoader = async ({ params }) => {
  const userId = params.userId;
  const userInfo = await userServices.getUserInfo(userId);
  const userPosts = (await userServices.getUserPosts(userId)).documents;
  return {
    userId,
    userPosts,
    profileURL: userInfo.profileSource,
    name: userInfo.name,
    username: userInfo.username,
    userBio: userInfo.userBio,
  };
};
