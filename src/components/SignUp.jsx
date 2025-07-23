import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../services/Auth";
import { toast } from "react-toastify";
import { logIn } from "../../store/authentication/authenticationSlice";
import { useDispatch } from "react-redux";
import userServices from "../../services/User";
import { useNavigate } from "react-router-dom";

const SignUp = ({ isUserNew, setIsUserNew, setAuthLoading }) => {
  let [profileInput, setProfileInput] = useState(null);
  let [profile, setProfile] = useState("Add Profile");
  let [hasWarned, setHasWarned] = useState(false);
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
  const handleProfile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setProfileInput(file);
    document.getElementById("profilePic").src = `${URL.createObjectURL(file)}`;
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
                      userId: user.$id,
                      profile: userDoc.profileSource,
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
    <div className="">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute lg:-top-20 muted brightness-[20%]  -left-0 w-full h-full  lg:w-[140%] lg:h-[140%]  object-cover"
      >
      <source src="https://res.cloudinary.com/ddoxcrq4q/video/upload/v1753309978/signUp_kwtab9.mp4" type="video/mp4"/>  
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
              <img
                id="profilePic"
                className={`${
                  profileInput ? "" : "hidden"
                }  h-full w-full object-center object-cover `}
              />
              <span
                className={`${profileInput ? "hidden" : ""} ${
                  profile == "Add Profile" ? "" : " text-2xl"
                }`}
              >
                {profile}
              </span>
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
                  value: 6,
                  message: "Password must be at least 6 characters",
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
            className="cursor-pointer font-bold text-[#089999]  "
            onClick={() => setIsUserNew((prev) => !prev)}
          >
            LogIn
          </span>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
