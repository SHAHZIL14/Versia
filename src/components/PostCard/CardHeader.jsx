import { useState } from "react";
import { Check } from "lucide-react";
// { authorName,authorUserName,authorProfileURL,}
function CardHeader({ authorName='guest', authorUserName='guest', authorProfileURL}) {
  let [isFollowing, setIsFollowing] = useState(false);
  return (
    <>
      <div className="w-full  rounded-t-2xl flex gap-3 items-center justify-between bg-gray-40 px-2 py-2 ">
        <div className="flex gap-2 items-center">
          <div className="profile h-10 w-10 rounded-[50%] overflow-hidden border border-black">
              <img
                src={authorProfileURL}
                alt="Profile"
                loading="lazy"
                className="rounded-lg w-full h-full object-cover object-center"
              />
          </div>
          <div className="about-author flex flex-col  justify-center text-black">
            <span className="text-sm/tight font-medium">{authorName}</span>
            <span className="text-xs">{`@${authorUserName}`}</span>
          </div>
        </div>
        <div
          className={`following-button ${
            isFollowing
              ? "bg-white  text-[var(--brand-color)] font-medium"
              : "bg-[var(--brand-color)]"
          }  p-1 px-2 text-sm rounded-lg `}
        >
          <button
            className="cursor-pointer flex items-center gap-px "
            onClick={() => setIsFollowing((prev) => !prev)}
          >
            {isFollowing ? `Following` : "Follow"}
            <Check className={`${isFollowing ? "" : "hidden"} h-4 `} />
          </button>
        </div>
      </div>
    </>
  );
}

export default CardHeader;
