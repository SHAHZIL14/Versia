import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
import { logIn } from "../../store/authentication/authenticationSlice";
import { useDispatch } from "react-redux";
import userServices from "../../services/User";
import { motion } from "motion/react";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import { Commet, ThreeDot } from "react-loading-indicators";
const SignUp = ({ isUserNew, setIsUserNew, setAuthLoading }) => {
  const [profileInput, setProfileInput] = useState(null);
  const [profile, setProfile] = useState("Add Profile");
  const [profilePreview, setProfilePreview] = useState("");
  let [hasWarned, setHasWarned] = useState(false);
  let [previewLoading, setPreviewLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
  });

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
  
      const appwriteCompatibleFile = new File(
        [finalBlob],
        "profile.jpg", 
        { type: "image/jpeg" }
      );
  
      const previewURL = URL.createObjectURL(appwriteCompatibleFile);
      const imgCheck = new Image();
  
      imgCheck.onload = () => {
        setProfileInput(appwriteCompatibleFile); // ✅ Now a valid File object
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

  const onSubmit = async ({ name, username, email, password }) => {
    if (!hasWarned && !profileInput) {
      toast.warn(
        `You haven't upload any picture, just a reminder you can carry on...`,
        {
          autoClose: 4000,
        }
      );
      setHasWarned(true);
      return;
    }
    setAuthLoading(true);
    authService.getUser().then((userSession) => {
      if (userSession) authService.logout();
    });
    authService
      .register(email, password, name)
      .then((user) => {
        userServices
          .addUserInfo(
            user.$id,
            { username, password, email, name },
            profileInput
          )
          .then((userDoc) => {
            authService
              .login(email, password)
              .then((userSession) => {
                if (userSession) {
                  dispatch(
                    logIn({
                      name: userDoc.name,
                      userName: userDoc.username,
                      userId: user.$id,
                      profileSource: userDoc.profileSource,
                    })
                  );
                  authService
                    .sendVerificationLink()
                    .then(() => {
                      toast.info("Check your mail inbox for verification");
                    })
                    .catch((err) => console.log(err));
                } else {
                  toast.error("something went wrong");
                }
              })
              .catch((error) => toast.error(error.message));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setTimeout(() => setAuthLoading(false), 3000));
    reset();
    setProfileInput(null);
    setProfile("Add Profile");
  };

  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute lg:-top-20 muted brightness-[20%]  -left-0 w-full h-full  lg:w-[140%] lg:h-[140%]  object-cover"
      >
        <source
          src="https://res.cloudinary.com/ddoxcrq4q/video/upload/v1753309978/signUp_kwtab9.mp4"
          type="video/mp4"
        />
      </video>
      <div
        className={`${
          isUserNew ? "absolute" : "static"
        } h-full w-full flex flex-col gap-10 justify-center items-center `}
      >
        <h2 className="font-bold text-5xl text-white">Sign Up</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start justify-self-center gap-10 w-[80%] lg:w-[50%]"
        >
          <div className="self-center ">
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              placeholder="profile"
              {...register("profilepic")}
              className="hidden"
              onChange={handleProfile}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
            <div
              id="virtualInput"
              onClick={() => {
                document.getElementById("profileInput").click();
              }}
              className=" border-[var(--brand-color)] border-2 cursor-pointer  bg-cover bg-center flex justify-center items-center  w-24 h-24 rounded-[50%] text-center  bg-[var(--brand-color)] text-white  focus:outline-none focus:border-none focus:ring-0 overflow-hidden"
            >
              {previewLoading ? (
                <ThreeDot size="small" color="white" />
              ) : (
                <>
                  <img
                    loading="lazy-loading"
                    id="profilePic"
                    src={profilePreview}
                    alt="Unavailable"
                    onLoad={() => console.log("✅ Image loaded successfully")}
                    onError={(e) => console.error("❌ Failed to load image", e)}
                    className={`${
                      profileInput ? "" : "hidden"
                    } text-xs h-full w-full object-center object-cover `}
                  />
                  <span
                    className={`${profileInput ? "hidden" : ""} ${
                      profile == "Add Profile" ? "" : " text-2xl"
                    }`}
                  >
                    {profile}
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <input
              placeholder="full name"
              {...register("name")}
              className="px-3 w-full py-2 bg-[var(--brand-color)] text-white rounded-xl  focus:outline-none focus:border-none focus:ring-0"
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="username"
              {...register("username", {
                required: "username is required",
                pattern: {
                  value: /^(?![_\d])[a-z0-9_]+$/,
                  message:
                    "Only lowercase letters, numbers, underscores. Cannot start with number and _",
                },
                validate: (value) => {
                  const trimmed = value.trim();
                  const isValid = /^(?![_\d])[a-z0-9_]+$/.test(trimmed);
                  if (!isValid) {
                    return "Only lowercase letters, numbers, underscores. Cannot start with number/_";
                  }
                  return true;
                },
              })}
              className="px-3 w-full py-2 bg-[var(--brand-color)] text-white rounded-xl  focus:outline-none focus:border-none focus:ring-0"
              onChange={(e) => {
                if (
                  e.target.value.length != 0 &&
                  /^(?![_\d])[a-z0-9_]+$/.test(e.target.value.trim())
                )
                  setProfile(e.target.value.charAt(0));
                else setProfile("Add Profile");
              }}
            />
            {errors.username ? (
              <p className="text-red-500">{errors.username.message}</p>
            ) : (
              watch("username")?.length > 0 && (
                <p className="text-green-600">✅ Username is valid</p>
              )
            )}
          </div>

          <div>
            <input
              placeholder="email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="px-3 w-full py-2 bg-[var(--brand-color)] text-white rounded-xl  focus:outline-none focus:border-none focus:ring-0"
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              placeholder="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="px-3 w-full py-2 bg-[var(--brand-color)] text-white rounded-xl  focus:outline-none focus:border-none focus:ring-0"
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>

          <button
            className="btn border border-transparent active:border-white hover:border-white"
            type="submit"
          >
            Register
          </button>
        </form>
        <span className="text-white">
          Already registered?,{" "}
          <span
            className="cursor-pointer font-bold text-[var(--brand-color)]   "
            onClick={() => setIsUserNew((prev) => !prev)}
          >
            LogIn
          </span>
        </span>
      </div>
    </motion.div>
  );
};

export default SignUp;
