import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Container from "../container/Container";
import { ThreeDot } from "react-loading-indicators";
const Authentication = () => {
  let [isUserNew, setIsUserNew] = useState(false);
  let [authLoading,setAuthLoading] = useState(false);
  return (
    <Container>
      <div
        className={`${
          authLoading ? "" : "hidden"
        } fixed top-0 z-[1000] left-0 muted bg-[var(--brand-color)] dark:bg-[var(--dark-bg)] w-screen h-full object-cover flex flex-col gap-3 justify-center items-center`}
      >
        <ThreeDot color="white" textColor="white"  />
        <p className="font-bold text-xs md:text-md tracking-wider uppercase">Teleporting you into the app</p>
      </div>
      <div
        id="container-auth"
        className="bg-white h-full w-full lg:h-screen lg:w-screen flex justify-center items-center"
      >
        <div className="h-full w-full lg:flex overflow-hidden">
          <div
            className={`${
              isUserNew
                ? "-translate-x-0 lg:translate-0"
                : "lg:translate-0 -translate-x-full"
            } transition-all ease-in-out duration-200  absolute lg:relative h-full w-full lg:w-[50%] transform rotate-0  left-0 `}
          >
            <SignUp isUserNew={isUserNew} setIsUserNew={setIsUserNew}  setAuthLoading={setAuthLoading} />
            <div
              className={`background hidden lg:flex h-full z-10 w-full transition-all duration-200 ease-in-out ${
                isUserNew ? "translate-x-full opacity-0" : "flex"
              } bg-gradient-to-bl from-black/50 to-[var(--brand-color)] text-white text-3xl flex justify-center items-center  absolute top-0 left-0`}
            >
             <img loading="lazy-loading" className="h-15" src='/versia.png'/>
            </div>
          </div>
          <div
            className={`${
              isUserNew
                ? "lg:translate-0 -translate-x-full"
                : "lg:translate-0 -translate-x-0"
            } transition-all ease-in-out duration-200
            absolute lg:relative h-full w-full lg:w-[50%] transform rotate-0  right-0 `}
          >
            <Login isUserNew={isUserNew} setIsUserNew={setIsUserNew}  setAuthLoading={setAuthLoading} />
            <div
              className={`hidden lg:flex h-full  w-full transition-all duration-200 ease-in-out ${
                isUserNew ? "flex" : "-translate-x-full opacity-0"
              } bg-gradient-to-br from-black/50 to-[var(--brand-color)] text-white text-3xl flex justify-center items-center  absolute top-0 right-0`}
            >
              <img loading="lazy-loading" src="/versia.png" className="h-15" alt="" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Authentication;
