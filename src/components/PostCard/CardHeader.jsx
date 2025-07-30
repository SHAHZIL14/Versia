import { useState } from "react";
import { Check } from "lucide-react";
import { useFetcher, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useSelector } from "react-redux";

function CardHeader({
  authorId,
  authorName = "guest",
  authorUserName = "guest",
  authorProfileURL,
}) {
  let [isFollowing, setIsFollowing] = useState(false);
  let [notified, setNotified] = useState(false);
  const userId = useSelector((state) => state.auth.userData.userId);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full  rounded-t-2xl flex gap-3 items-center justify-between bg-gray-40 px-2 py-2 ">
        <div className="flex gap-2 items-center">
          <div
            onClick={() => {
              if (userId == authorId) {
                navigate("/profile");
              } else {
                navigate(`/user/${authorId}`);
              }
            }}
            className="cursor-pointer profile h-10 w-10 rounded-[50%] overflow-hidden border border-black"
          >
            {authorProfileURL && (
              <img
                loading="lazy-loading"
                src={authorProfileURL}
                alt="Profile"
                className="rounded-lg w-full h-full object-cover object-center"
              />
            )}
          </div>
          <div className="about-author flex flex-col  justify-center text-black">
            <span className="text-sm/tight font-medium">{authorName}</span>
            <span className="text-xs">{`@${authorUserName}`}</span>
          </div>
        </div>
        <div
          className={`following-button ${authorId == userId ? "hidden" : ""}  ${
            isFollowing
              ? "bg-white  text-[var(--brand-color)] font-medium"
              : "bg-[var(--brand-color)]"
          }  py-1 px-2 text-sm rounded-lg cursor-pointer `}
        >
          <button
            className={`cursor-pointer transition-all ease-in-out duration-100 flex items-center gap-px`}
            onClick={() => {
              setIsFollowing((prev) => !prev);
              if (!notified) {
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
                setNotified(true);
              }
            }}
          >
            <span className="inline-block transition-transform duration-200 scale-100">
              {isFollowing ? `Following` : "Follow"}
            </span>
            <Check className={`${isFollowing ? "" : "hidden"} h-4 `} />
          </button>
        </div>
      </div>
    </>
  );
}

export default CardHeader;
