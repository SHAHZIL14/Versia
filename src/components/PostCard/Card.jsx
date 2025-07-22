import CardHeader from "./CardHeader";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
function Card({
  caption,
  image,
  likes = 0,
  comments = 0,
  authorName,
  authorUsername,
  authorProfileURL,
}) {
  let [isLiked, setIsLiked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 ,repeatCount:0}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }} 
      onDoubleClick={() => {
        console.log("clicked double");
        setIsLiked(true);
      }}
      className=" w-full flex-col flex cursor-pointer min-h-96 h-fit text-xs md:text-sm lg:text-md  mx-auto overflow-hidden  border-blue-80 bg-white  shadow-md py-0"
    >
      {/* card Header */}
      <CardHeader
        authorName={authorName}
        authorUserName={authorUsername}
        authorProfileURL={authorProfileURL}
      />
      <div className=""></div>
      <div className="featuredImage overflow-hidden flex justify-center items-center  bg-contain bg-no-repeat bg-center lg:rounded  h-fit w-full  ">
        <img
          src={image}
          className="object-center object-cover lg:rounded"
          alt=""
        />
      </div>
      <div className="about-card">
        <div className="actions  flex justify-start gap-x-5 border border-blak   p-3">
          <button className=" ">
            <Heart
              className={`${
                isLiked ? "fill-red-500" : ""
              } w-5 h-5 text-[var(--brand-color)] hover:fill-red-500 `}
            />
          </button>
          <button className="">
            <MessageCircle className="w-5 h-5 text-[var(--brand-color)] hover:fill-gray-500" />
          </button>
          <button className="">
            <Share className="w-5 h-5 text-[var(--brand-color)] hover:fill-gray-500" />
          </button>
        </div>
        <div className="action-data text-black flex gap-x-3 py- px-2">
          <div>
            <strong>{likes.toString()} </strong>likes
          </div>
          <div>
            <strong>{comments.toString()} </strong> comments
          </div>
        </div>
        <div className="caption text-black px-2 pb-5">
          <p>{caption}</p>
        </div>
      </div>
    </motion.div>
  );
}
export default Card;
