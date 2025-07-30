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
  });
  const loaderData = useLoaderData();

  React.useEffect(() => {
    if (mode === "general" && data) {
      setPostData({
        authorId: data.authorId,
        authorProfile: data.authorProfileURL,
        name: data.authorName,
        username: data.authorUserName,
        imageURL: data.imageURL,
        likes: data.likes,
        comments: data.comments,
        caption: data.caption,
        postId: data.postId,
        postMetaId: data.$id,
        isLiked: data.isLiked,
      });
    } else if (loaderData) {
      setPostData({
        authorId: loaderData.authorId,
        authorProfile: loaderData.authorProfileURL,
        name: loaderData.authorName,
        username: loaderData.authorUserName,
        imageURL: loaderData.imageURL,
        likes: loaderData.likes,
        comments: loaderData.comments,
        caption: loaderData.caption,
        postId: loaderData.postId,
        postMetaId: loaderData.$id,
        isLiked: loaderData.isLiked,
      });
    }
  }, [mode, data, loaderData]);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const postId = postData.postId;
  const postMetaId = postData.postMetaId;
  const userId = useSelector((state) => state.auth.userData.userId);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (postData && postData.postId) {
      setIsLiked(postData.isLiked);
      setLikes(postData.likes);
      setLoading(false);
    }
  }, [postData]);

  const handleHeartClick = (postId) => {
    if (isProcessing) return;
    setIsProcessing(true);
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
      postServices
        .unlikePost(postId, postMetaId, userId, likes)
        .then(() => {
          console.log("success unlike");
        })
        .catch((err) => {
          setIsLiked(true);
          setLikes((prev) => prev + 1);
          console.error(err);
        })
        .finally(() => setIsProcessing(false));
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      postServices
        .likePost(postId, postMetaId, userId, likes)
        .then(() => {
          console.log("success like");
        })
        .catch((err) => {
          setIsLiked(false);
          setLikes((prev) => prev - 1);
          console.error(err);
        })
        .finally(() => setIsProcessing(false));
    }
  };

  const handlePostDoubleClick = (postId) => {
    if (isLiked) return;
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    postServices
      .likePost(postId, postMetaId, userId, likes)
      .then(() => console.log("success"))
      .catch((err) => {
        console.log(err);
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      });
  };

  return loading ? (
    <div className="w-screen h-screen flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot
        color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
        text="Recognizing you"
        textColor="white"
      />
    </div>
  ) : (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`${mode=='specific'?'min-h-screen':'h-fit'} w-full flex-col flex  text-xs md:text-sm lg:text-md   mx-auto overflow-hidden  border-blue-80 bg-white  py-0`}
    >
      <CardHeader
        authorId={postData.authorId}
        authorName={postData.name}
        authorUserName={postData.username}
        authorProfileURL={postData.authorProfile}
      />
      <div className=""></div>
      <motion.div
        transition={{ type: "spring", stiffness: 500 }}
        onDoubleClick={() => {
          handlePostDoubleClick(postId);
          setShowDoubleTapHeart(true);
          setTimeout(() => setShowDoubleTapHeart(false), 800); // heart disappears
        }}
        className="relative featuredImage cursor-pointer overflow-hidden flex justify-center items-center bg-contain bg-no-repeat bg-center lg:rounded h-fit w-full"
      >
        {postData.imageURL && (
          <img
            loading="lazy-loading"
            src={postData.imageURL}
            className="object-center object-cover lg:rounded"
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
        <div className="actions  flex justify-start gap-x-5 border border-blak  pt-2 px-2">
          <motion.button
            whileTap={{ scale: 2 }}
            transition={{ type: "spring", stiffness: 500 }}
            onClick={() => handleHeartClick(postId)}
            className="cursor-pointer"
          >
            <Heart
              className={`${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-[var(--brand-color)]"
              } transition ease-in-out duration-500 w-5 h-5  hover:fill-red-500 `}
            />
          </motion.button>
          <button
            onClick={() => {
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
                }).showToast();
            }}
            className=""
          >
            <MessageCircle className="w-5 h-5 text-[var(--brand-color)] hover:fill-gray-500" />
          </button>
          <button
          onClick={()=>{
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
              }).showToast();

          }}
          className="">
            <Share className="w-5 h-5 text-[var(--brand-color)] hover:fill-gray-500" />
          </button>
        </div>
        <div className="action-data text-black flex gap-x-3  px-2">
          <div>
            <strong>{likes} </strong>likes
          </div>
          <div>
            <strong>{postData.comments} </strong> comments
          </div>
        </div>
        <div className="caption text-black px-2 pb-5">
          <p className="text-sm lg:text-base ">{postData.caption}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(Card);

export const postInfoLoader = async ({ params }) => {
  const { postId } = params;
  const { userId } = params;
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
  };
  return data;
};
