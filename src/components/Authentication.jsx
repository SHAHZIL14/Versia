import { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Container from "../container/Container";
const Authentication = () => {
  let [isUserNew, setIsUserNew] = useState(false);

  return (
    <Container>
      <div
        id="container-auth"
        className="bg-white h-full w-full flex justify-center items-center"
      >
        <div className="h-full w-full lg:flex overflow-hidden">
          <div
            className={`${
              isUserNew
                ? "-translate-x-0 lg:translate-0"
                : "lg:translate-0 -translate-x-full"
            } transition-all ease-in-out duration-200  absolute lg:relative h-full w-full lg:w-[50%] transform rotate-0  left-0 `}
          >
            <SignUp isUserNew={isUserNew} setIsUserNew={setIsUserNew} />
            <div
              className={`background hidden lg:flex h-full z-10 w-full transition-all duration-200 ease-in-out ${
                isUserNew ? "translate-x-full opacity-0" : "flex"
              } bg-gradient-to-bl from-black/50 to-[var(--brand-color)] text-white text-3xl flex justify-center items-center  absolute top-0 left-0`}
            >

              <strong className=" absolute uppercase tracking-wider">One Folk</strong>
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
            <Login isUserNew={isUserNew} setIsUserNew={ setIsUserNew} />
            <div
              className={`hidden lg:flex h-full  w-full transition-all duration-200 ease-in-out ${
                isUserNew ? "flex" : "-translate-x-full opacity-0"
              } bg-gradient-to-br from-black/50 to-[var(--brand-color)] text-white text-3xl flex justify-center items-center  absolute top-0 right-0`}
            >
              <strong className="uppercase tracking-wider">Versea</strong>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Authentication;
