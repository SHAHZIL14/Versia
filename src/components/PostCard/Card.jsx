import CardHeader from "./CardHeader";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import React from "react";
import postServices from "../../../services/Post";
import { useSelector } from "react-redux";
import { useLoaderData, useParams } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import { AnimatePresence } from "framer-motion";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import {
  getPostLikeCache,
  updatePostLikeCache,
} from "../../utilities/postCache";
import userServices from "../../../services/User";

function Card({ data, mode }) {
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState({
    authorId: "",
    authorProfile: "",
    name: "",
    username: "",
    imageURL: "",
    likes: 0,
    comments: 0,
    caption: "",
    postId: "",
    postMetaId: "",
    isLiked: false,
    createdAt: null,
  });

  const loaderData = useLoaderData();
  const userId = useSelector((state) => state.auth.userData.userId);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (mode === "general" && data) {
        const fetchedAuthorProfile = (
          await userServices.getUserInfo(data.authorId)
        ).profileSource;

        setPostData({
          authorId: data.authorId,
          authorProfile: fetchedAuthorProfile,
          name: data.authorName,
          username: data.authorUserName,
          imageURL: data.imageURL,
          likes: data.likes,
          comments: data.comments,
          caption: data.caption,
          postId: data.postId,
          postMetaId: data.$id,
          isLiked: data.isLiked,
          createdAt: formatDate(data.createdAt),
        });
      } else if (loaderData) {
        const fetchedAuthorProfile = (
          await userServices.getUserInfo(loaderData.authorId)
        ).profileSource;

        setPostData({
          authorId: loaderData.authorId,
          authorProfile: fetchedAuthorProfile,
          name: loaderData.authorName,
          username: loaderData.authorUserName,
          imageURL: loaderData.imageURL,
          likes: loaderData.likes,
          comments: loaderData.comments,
          caption: loaderData.caption,
          postId: loaderData.postId,
          postMetaId: loaderData.$id,
          isLiked: loaderData.isLiked,
          createdAt: formatDate(loaderData.createdAt),
        });
      }
    };

    fetchAuthorProfile();
  }, [mode, data, loaderData]);

  useEffect(() => {
    if (postData && postData.postId) {
      const cachedLikes = getPostLikeCache(postData.postId);
      if (cachedLikes) {
        setLikes(cachedLikes.likes);
        setIsLiked(cachedLikes.isLiked);
      } else {
        setLikes(postData.likes);
        setIsLiked(postData.isLiked);
      }
      setLoading(false);
    }
  }, [postData]);

  const handleHeartClick = async (postId) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (isLiked) {
      const updatedLikes = likes - 1;
      setLikes(updatedLikes);
      setIsLiked(false);
      updatePostLikeCache(postId, updatedLikes, false);

      try {
        const result = await postServices.unlikePost(
          postId,
          postData.postMetaId,
          userId,
          updatedLikes
        );
      } catch (error) {
        setLikes((prev) => prev + 1);
        setIsLiked(true);
        updatePostLikeCache(postId, likes, true);
      } finally {
        setIsProcessing(false);
      }
    } else {
      const updatedLikes = likes + 1;
      setLikes(updatedLikes);
      setIsLiked(true);
      updatePostLikeCache(postId, updatedLikes, true);

      try {
        const result = await postServices.likePost(
          postId,
          postData.postMetaId,
          userId,
          updatedLikes
        );
      } catch (error) {
        console.error("Like failed:", error);
        setLikes((prev) => prev - 1);
        setIsLiked(false);
        updatePostLikeCache(postId, likes, false);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePostDoubleClick = (postId) => {
    if (isLiked || isProcessing) return;

    const newLikes = likes + 1;
    setLikes(newLikes);
    setIsLiked(true);
    updatePostLikeCache(postId, newLikes, true);

    postServices
      .likePost(postId, postData.postMetaId, userId, newLikes)
      .then(() => console.log("Double tap liked"))
      .catch((err) => {
        setLikes(likes);
        setIsLiked(false);
        updatePostLikeCache(postId, likes, false);
        console.error(err);
      });
  };

  const formatDate = (createdAt) => {
    const monthMap = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "june",
      "july",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    const [year, month, day] = createdAt.split("T")[0].split("-");

    return {
      date: String(Number(day)),
      month: monthMap[Number(month) - 1],
      year: year.slice(2),
    };
  };

  return loading ? (
    <div className="w-screen h-screen flex flex-col gap-3 justify-center items-center bg-[var(--brand-color)] dark:bg-[var(--dark-bg)] fixed top-0 left-0">
      <ThreeDot size="small" color="white" textColor="white" />
      <p className="font-bold text-xs md:text-md tracking-wider uppercase">
        Almost there
      </p>
    </div>
  ) : (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`${
        mode === "specific" ? "min-h-screen w-screen" : "h-fit"
      } w-full flex-col lg:items-center flex text-xs md:text-sm lg:text-md mx-auto overflow-hidden border-blue-80 pb-5 transition-colors duration-300 dark:bg-[var(--dark-bg)]`}
    >
      <div className="lg:w-96 ">
        <CardHeader postData={postData} />

        <motion.div
          transition={{ type: "spring", stiffness: 500 }}
          onDoubleClick={() => {
            handlePostDoubleClick(postData.postId);
            setShowDoubleTapHeart(true);
            setTimeout(() => setShowDoubleTapHeart(false), 800);
          }}
          className={`${
            mode === "specific"
              ? "max-h-[75vh]"
              : "max-h-[400px] lg:max-h-[600px]"
          } relative featuredImage cursor-pointer overflow-hidden flex justify-center items-center bg-contain bg-no-repeat bg-center lg:rounded h-fit w-full`}
        >
          {postData.imageURL && (
            <img
              loading="lazy"
              src={postData.imageURL}
              className="w-full max-h-[500px] lg:max-h-[800px] object-cover object-center"
              alt=""
            />
          )}
          <AnimatePresence>
            {showDoubleTapHeart && (
              <motion.div
                key="doubleTapHeart"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
              >
                <Heart className="w-14 h-14 text-red-600/80 fill-red-600/80 drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="about-card flex flex-col gap-2">
          <div className="actions flex justify-start gap-x-5  pt-2 px-2">
            <motion.button
              whileTap={{ scale: 2 }}
              transition={{ type: "spring", stiffness: 500 }}
              onClick={() => handleHeartClick(postData.postId)}
              className="cursor-pointer"
            >
              <Heart
                className={`${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-[var(--brand-color)] dark:text-[var(--brand-color-dark)]   "
                } transition ease-in-out duration-500 w-5 h-5 hover:fill-red-500`}
              />
            </motion.button>
            <button
              onClick={() =>
                Toastify({
                  text: "Comment feature will be available soon",
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
                }).showToast()
              }
            >
              <MessageCircle className="w-5 h-5 text-[var(--brand-color)] dark:text-[var(--brand-color-dark)]  hover:fill-gray-500" />
            </button>
            <button
              onClick={() =>
                Toastify({
                  text: "Share feature will be available soon",
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
                }).showToast()
              }
            >
              <Share className="w-5 h-5 text-[var(--brand-color)] dark:text-[var(--brand-color-dark)]  hover:fill-gray-500" />
            </button>
          </div>

          <div className="action-data text-black dark:text-[var(--dark-text)] flex gap-x-3 px-2">
            <div>
              <strong>{likes}</strong> likes
            </div>
            <div>
              <strong>{postData.comments}</strong> comments
            </div>
          </div>

          <div className={`caption text-black dark:text-[var(--dark-text)] px-2 flex flex-col gap-1 `}>
            <p className={`${postData.caption?'':"hidden"}  text-sm lg:text-base `}>
              <strong className="mr-2">{postData.username}</strong> 
              {postData.caption}
            </p>
            <p className=" lg:text-base flex gap-x-[2px] capitalize ">
              <span className="text-xs">{postData.createdAt["date"]}</span>
              <span className="text-xs">{postData.createdAt["month"]}</span>
              <span className="text-xs">{postData.createdAt["year"]}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(Card);

export const postInfoLoader = async ({ params, request }) => {
  const { postId } = params;
  const { userId } = params;
  const url = new URL(request.url);
  const followees = JSON.parse(url.searchParams.get("followeeList") || "[]");
  const postData = await postServices.getPost(postId);
  const postMetaData = await postServices.getMetaPost(postData.$id);
  const isLiked = await postServices.getIsLiked(postData.$id, userId);

  const data = {
    authorId: postData.authorId,
    authorProfileURL: postMetaData.authorProfileURL,
    authorName: postMetaData.authorName,
    authorUserName: postMetaData.authorUserName,
    imageURL: postData.imageURL,
    likes: postMetaData.likes,
    comments: postMetaData.comments,
    caption: postData.caption,
    postId: postMetaData.postId,
    $id: postMetaData.$id,
    isLiked: false || isLiked,
    createdAt: postData.$createdAt,
  };
  return data;
};
