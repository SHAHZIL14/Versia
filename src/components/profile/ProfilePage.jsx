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
import {
  Camera,
  CircleUser,
  Cross,
  Edit,
  Edit2Icon,
  ImagePlusIcon,
  Save,
  X,
} from "lucide-react";
import {
  updateBio,
  updateProfile,
} from "../../../store/authentication/authenticationSlice";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import { toast } from "react-toastify";

function ProfilePage({ mode }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [bioLoading, setBioLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [userCurrentProfile, setUserCurrentProfile] = useState("");
  const [editable, setEditable] = useState(false);
  const [profileInput, setProfileInput] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");
  const [isProfileEditable, setIsProfileEditable] = useState(false);

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
        profileURL: false || currentUserData.profileSource,
        userPosts: currentUserPosts || [],
        userBio: currentUserData.userBio,
      });
    } else {
      setUserData({
        name: loaderData.name,
        username: loaderData.username,
        profileURL: false || loaderData.profileURL,
        userPosts: loaderData.userPosts || [],
        userBio: loaderData.userBio,
      });
    }
    setTimeout(() => setLoading(false), 200);
  }, [mode, currentUserData, currentUserPosts, loaderData]);

  useEffect(() => {
    setBio(userData.userBio);
    setUserCurrentProfile(userData.profileURL);
  }, [userData]);

  const handleBioSave = async () => {
    setEditable((prev) => !prev);
    setBioLoading(true);
    userServices
      .updateUserBio(bio, currentUserData.userId)
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

  const handleProfile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    setPreviewLoading(true);

    try {
      let finalBlob;

      if (fileExt === "heic") {
        console.log("HEIC entered");
        finalBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.7,
        });
      } else if (fileExt === "jpeg" || fileExt === "jpg") {
        console.log("JPEG/JPG entered");
        finalBlob = file;
      } else {
        console.log("OTHER image entered");
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/jpeg",
          initialQuality: 0.7,
        };
        finalBlob = await imageCompression(file, options);
      }

      const appwriteCompatibleFile = new File([finalBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      const previewURL = URL.createObjectURL(appwriteCompatibleFile);
      const imgCheck = new Image();

      imgCheck.onload = () => {
        setProfileInput(appwriteCompatibleFile);
        setProfilePreview(previewURL);
        setPreviewLoading(false);
      };

      imgCheck.onerror = () => {
        URL.revokeObjectURL(previewURL);
        toast.error("Invalid file, please upload a different one.");
        setProfilePreview("");
        setProfileInput("");
        setPreviewLoading(false);
      };

      imgCheck.src = previewURL;
    } catch (error) {
      console.error("File handling error:", error);
      toast.error("Error occurred. Please upload your profile again.");
      setProfilePreview("");
      setProfileInput("");
      setPreviewLoading(false);
    }
  };

  const updateProfilePic = async () => {
    setUpdateLoading(true);
    userServices
      .updateUserProfilePic(profileInput, currentUserData.userId)
      .then(() => {
        toast.success("Profile Updated.");
        dispatch(updateProfile(profilePreview));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update!");
        setProfilePreview(userData.profileURL);
      })
      .finally(() => {
        setUpdateLoading(false);
        setIsProfileEditable(false);
        setProfileInput("");
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
    <div
      id="profile"
      className="min-h-screen w-screen flex flex-col gap-y-5 bg-white"
    >
      <div className="flex flex-col text-[var(--brand-color)] py-3 px-2">
        <div className="flex gap-0">
          <div className="w-[50%] py-5 flex flex-col gap-5 justify-center items-start relative">
            <div className="flex items-center gap-3 flex-row-reverse">
              {mode == "current" && (
                <div
                  className={`${
                    updateLoading ? "hidden" : ""
                  }  top-0  right-[20%] flex flex-col  gap-5 h-fit w-fit`}
                >
                  {isProfileEditable ? (
                    <>
                      <button onClick={() => setIsProfileEditable(false)}>
                        <X />
                      </button>
                      <button onClick={updateProfilePic}>
                        <Save />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsProfileEditable(true)}>
                      <Edit2Icon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              <div className={`${updateLoading ? "hidden" : ""}`}>
                {isProfileEditable ? (
                  <div
                    onClick={() =>
                      document.getElementById("profileChange").click()
                    }
                    className={`h-24 w-24 lg:w-38 lg:h-38 rounded-full ${
                      profilePreview ? "" : "border border-[var(--brand-color)]"
                    } flex justify-center items-center overflow-hidden relative `}
                  >
                    {profilePreview ? (
                      <img
                        className="object-cover object-center h-24 w-24 lg:w-38 lg:h-38 rounded-full"
                        src={profilePreview}
                        alt="profile"
                      />
                    ) : (
                      <ImagePlusIcon
                        className={`${previewLoading ? "hidden" : ""} w-[50%]`}
                      />
                    )}
                    <input
                      id="profileChange"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfile}
                    />
                    <div
                      className={`${
                        previewLoading ? "" : "hidden"
                      } absolute h-full w-full bg-white flex justify-center items-center z-10 `}
                    >
                      <FourSquare size="small" color={"var(--brand-color)"} />
                    </div>
                  </div>
                ) : userCurrentProfile ? (
                  <img
                    className="object-cover object-center h-24 w-24 lg:w-38 lg:h-38 rounded-full"
                    src={userCurrentProfile}
                    alt="profile"
                  />
                ) : (
                  <CircleUser color="var(--brand-color)" size={100} />
                )}
              </div>

              <div
                className={`${
                  updateLoading ? "" : "hidden"
                }  h-24 w-24 flex flex-col justify-center items-center rounded-full `}
              >
                <FourSquare size="small" color="var(--brand-color)" />
                <p className="text-xs md:text-md">updating...</p>
              </div>
            </div>

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
                <button
                  onClick={() => {
                    Toastify({
                      text: "Follow feature will be available soon",
                      duration: 3000,
                      gravity: "top",
                      position: "right",
                      style: {
                        background: "var(--brand-color)",
                        color: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 0 12px rgba(255,255,255,0.8)",
                        fontWeight: "300",
                        border: "1px solid var(--brand-color)",
                        fontSize: "12px",
                      },
                    }).showToast();
                  }}
                  className="cursor-pointer text-xs lg:text-lg  uppercase bg-[var(--brand-color)] text-white w-36 py-1 rounded"
                >
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
          <div className={`${userData.userBio ? "" : "hidden"} `}>
            <span
              className={`font-semibold text-xs lg:text-lg justify-start items-center gap-x-5 flex `}
            >
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
                      <Edit2Icon
                        className="h-3 w-3 lg:h-5 cursor-pointer lg:w-5"
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

      {userData.userPosts.length == 0 ? (
        <motion.div className="w-full text-[var(--brand-color)] flex flex-col items-center justify-center lg:text-lg text-xs gap-3  text-center">
          <p>No post uploaded yet</p>
          <motion.button
            onClick={() => {
              navigate("/add-post");
            }}
          >
            <Camera color="var(--brand-color)" />
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 text-black gap-1 w-full   min-h-auto">
          {userData.userPosts?.map((eachPost) => (
            <motion.div
              key={eachPost.$id}
              className="hover:brightness-75 active:brightness-75 cursor-pointer rounded  overflow-hidden h-60 lg:h-96 lg:w-full"
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
      )}
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
