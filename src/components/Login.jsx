import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../services/Auth";
import { useDispatch } from "react-redux";
import { logIn } from "../../store/authentication/authenticationSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userServices from "../../services/User";
import { ThreeDot } from "react-loading-indicators";
const Login = ({ isUserNew, setIsUserNew, setAuthLoading }) => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }) => {
    setAuthLoading(true);
    authService.getUser().then((userSession) => {
      if (userSession) authService.logout();
      console.log("loggedout");
    });

    authService
      .login(email, password)
      .then((user) => {
        if (user) {
          userServices
            .getUserInfo(user.$id)
            .then((userDoc) => {
              if (userDoc) {
                dispatch(
                  logIn({
                    name: userDoc.name,
                    userName:userDoc.username,
                    userId: user.$id,
                    profileSource: userDoc.profileSource,
                  })
                );
                if (user.emailVerification) {
                  navigateTo("/home");
                  setTimeout(() => setAuthLoading(false), 2000);
                  toast.success("Login successfully", {
                    className: "my-toast",
                    bodyClassName: "my-toast-body",
                  });
                } else {
                  authService
                    .sendVerificationLink()
                    .then(() => {
                      toast.info(
                        "Your email is not verified!!.Check your mail inbox for verification first."
                      );
                    })
                    .catch((err) => console.log(err));
                }
              } else {
                toast.error("something went wrong");
              }
            })
            .catch((err) => toast.error(err));
        } else {
          throw new Error("Can't get user infromation");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setTimeout(() => setAuthLoading(false), 3000));
    reset();
  };

  return (
    <div>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute lg:-top-20 muted brightness-[20%] -left-0 w-full h-full lg:w-[140%] lg:h-[140%]  object-cover"
      >
      <source src="https://res.cloudinary.com/ddoxcrq4q/video/upload/v1753309882/logIn_w1eyr5.mp4" type="video/mp4" />  
      </video>
      <div
        className={`${
          isUserNew ? "static" : "absolute"
        }  z-50 h-full w-full flex flex-col gap-10 justify-center items-center `}
      >
        <h2 className="font-bold  text-5xl text-white">Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 w-[80%] lg:w-[50%]"
        >
          <div className="">
            <input
              className="px-3 w-full py-2 bg-[var(--brand-color)] text-white rounded-xl  focus:outline-none focus:border-none focus:ring-0"
              placeholder="email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>

          <div className="">
            <input
              placeholder="password"
              className="px-3 py-2 w-full bg-[var(--brand-color)] text-white rounded-xl  focus:outline-none focus:border-none focus:ring-0"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>

          <button className="btn" type="submit">
            Login
          </button>
        </form>
        <span className=" text-white">
          New user?{" "}
          <span
            className="cursor-pointer font-bold text-[#089999]  "
            onClick={() => setIsUserNew((prev) => !prev)}
          >
            Register
          </span>
        </span>
      </div>
    </div>
  );
};

export default Login;
