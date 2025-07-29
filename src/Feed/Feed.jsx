import React, { useEffect, useState } from "react";
import Card from "../components/PostCard/Card";
import { ID } from "appwrite";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import postServices from "../../services/Post";
import userServices from "../../services/User";
import { addBatch, addPostLikes } from "../../store/Post/PostSlice";
import { useUser } from "../../context/userContext";
import { ThreeDot } from "react-loading-indicators";

const Feed = () => {
  const userId = useSelector((state) => state.auth.userData.userId);
  const storedPost = useSelector((state) => state.Post.data);
  const storedPostLikes = useSelector((state) => state.Post.likesMap);
  const isFetched = useSelector((state) => state.Post.isFetched);
  const [loading, setLoading] = useState(!isFetched);
  const dispatch = useDispatch();
  const { setUserPosts } = useUser();

  const fetchPosts = async (cursorDocumentID) => {
    if (isFetched) return;

    const post = (await postServices.getPostBatch(cursorDocumentID)).documents;
    const metaPost = await postServices.getMetaPostBatch(post);

    const POST = post.map((post) => {
      const meta = metaPost.documents.find((m) => m.postId === post.$id);
      return {
        data: post,
        metaData: meta || {},
      };
    });
    dispatch(addBatch(POST));
  };

  const getPostsLikes = async () => {
    const postIds = storedPost.map((post) => post?.data?.$id);
    if (postIds.length === 0 || !userId) return;

    const res = (await postServices.getPostLikesBatch(postIds, userId))
      .documents;

    const likesMap = {};
    res.forEach((element) => {
      if (element?.postId) {
        likesMap[element.postId] = true;
      }
    });
    dispatch(addPostLikes(likesMap));
  };

  const fetchCurrentUserProfile = async () => {
    if (!userId) return;
    const userPosts = (await userServices.getUserPosts(userId)).documents;
    if (userPosts) setUserPosts(userPosts);
  };

  useEffect(() => {
    if (isFetched) return;
    fetchPosts();
    fetchCurrentUserProfile();
  }, [userId, isFetched]);

  useEffect(() => {
    if (storedPost && storedPost.length > 0) {
      getPostsLikes().then(() => setLoading(false));
    }
  }, [storedPost, userId]);

  return loading ? (
    <div className="w-screen h-screen flex justify-center items-center bg-[var(--brand-color)] fixed top-0 left-0">
      <ThreeDot
        color={["#cccccc", "#e6e6e6", "#ffffff", "#ffffff"]}
        text="Getting latest for you."
        textColor="white"
      />
    </div>
  ) : (
    <div
      id="feed"
      className="w-full lg:w-[40%] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] 
     max-h-fit overflow-scroll"
    >
      {storedPost.map((post) => {
        const mode = "general";
        const data = {
          authorId: post.data.authorId,
          authorProfileURL: post.metaData.authorProfileURL,
          authorName: post.metaData.authorName,
          authorUserName: post.metaData.authorUserName,
          imageURL: post.data.imageURL,
          likes: post.metaData.likes,
          comments: post.metaData.comments,
          caption: post.data.caption,
          postId: post.metaData.postId,
          $id: post.metaData.$id,
          isLiked: storedPostLikes[post.data.$id] == true,
        };
        return (
          <Card data={data} mode={mode} key={post.data?.$id || ID.unique()} />
        );
      })}
    </div>
  );
};

export default React.memo(Feed);
