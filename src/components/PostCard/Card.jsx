import CardHeader from "./CardHeader";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
function Card({data , metaData}) {
  let [isLiked, setIsLiked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 ,repeatCount:0}}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }} 
      onDoubleClick={() => {
        console.log("clicked double");
        setIsLiked(true);
      }}
      className=" w-full flex-col flex cursor-pointer  h-fit text-xs md:text-sm lg:text-md   mx-auto overflow-hidden  border-blue-80 bg-white  py-0"
    >
      {/* card Header */}
      <CardHeader
        authorName={metaData.authorName}
        authorUserName={metaData.authorUserName}
        authorProfileURL={metaData.authorProfileURL}
      />
      <div className=""></div>
      <div className="featuredImage overflow-hidden flex justify-center items-center  bg-contain bg-no-repeat bg-center lg:rounded  h-fit w-full  ">
        <img
          src={data.imageUrl}
          className="object-center object-cover lg:rounded"
          alt=""
        />
      </div>
      <div className="about-card flex flex-col gap-2">
        <div className="actions  flex justify-start gap-x-5 border border-blak  pt-2 px-2">
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
        <div className="action-data text-black flex gap-x-3  px-2">
          <div>
            <strong>{metaData.likes.toString()} </strong>likes
          </div>
          <div>
            <strong>{metaData.comments.toString()} </strong> comments
          </div>
        </div>
        <div className="caption text-black px-2 pb-5">
          <p className="text-sm lg:text-base ">{data.caption}</p>
        </div>
      </div>
    </motion.div>
  );
}
export default Card;
