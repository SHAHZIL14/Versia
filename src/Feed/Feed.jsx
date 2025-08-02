import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/PostCard/Card";
import { ID } from "appwrite";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import postServices from "../../services/Post";
import userServices from "../../services/User";
import { addBatch, addPostLikes } from "../../store/Post/PostSlice";
import { useUser } from "../../context/userContext";
import { ThreeDot } from "react-loading-indicators";
import { updateFollowees } from "../../store/authentication/authenticationSlice";
import useFollowerStore from "../../store/followers/followersStore";

const Feed = () => {
  const dispatch = useDispatch();
  const { setUserPosts } = useUser();
  const { setFollowerCount, followersMap } = useFollowerStore();
  const userId = useSelector((state) => state.auth.userData?.userId);
  const followees = useSelector((state) => state.auth.userData?.followees);
  const storedPost = useSelector((state) => state.Post.data, shallowEqual);
  const storedPostLikes = useSelector(
    (state) => state.Post.likesMap,
    shallowEqual
  );
  const isFetched = useSelector((state) => state.Post.isFetched);

  const [loading, setLoading] = useState(!isFetched);
  const [followeeList, setFolloweeList] = useState(null);
  useEffect(() => {
    if (!isFetched) {
      fetchPosts();
      fetchCurrentUserProfile();
      getCurrentUserFolloweeList();
    }
  }, [isFetched, userId]);

  const fetchPosts = async () => {
    const post = (await postServices.getPostBatch()).documents;
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
    if (!userId || postIds.length === 0) return;

    const res = (await postServices.getPostLikesBatch(postIds, userId))
      .documents;
    const likesMap = {};
    res.forEach((element) => {
      if (element?.postId) likesMap[element.postId] = true;
    });

    dispatch(addPostLikes(likesMap));
  };

  const fetchCurrentUserProfile = async () => {
    if (!userId) return;
    const userPosts = (await userServices.getUserPosts(userId)).documents;
    if (userPosts) setUserPosts(userPosts);
  };

  const getCurrentUserFolloweeList = async () => {
    if (!userId) return;
    try {
      const followersDocs = await userServices.getUsersFollowee(userId);
      const followeeIdList = followersDocs.map((doc) => doc.followeeId);
      setFolloweeList(followeeIdList);
      dispatch(updateFollowees(followeeIdList));
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowersCount = async () => {
    if (Object.keys(followersMap).length != 0) return;
    const authorIds = storedPost.map((post) => post?.data?.authorId);
    if (!userId || authorIds.length === 0) return;
    const uniqueAuthorIds = [...new Set(authorIds)];
    const followersCount = await userServices.getFollowersCountBatch(
      uniqueAuthorIds
    );
    followersCount.forEach((doc) => {
      setFollowerCount(doc.id, doc.follower, doc.following);
    });
  };

  useEffect(() => {
    if (storedPost?.length > 0) {
      getPostsLikes().then(() => setLoading(false));
      getFollowersCount();
    }
  }, [storedPost, userId]);

  const memoizedPosts = useMemo(() => {
    return storedPost.map((post) => {
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
        isLiked: storedPostLikes[post.data.$id] === true,
        isFollowing: false || followees?.includes(post.data.authorId),
      };

      return (
        <Card data={data} mode={mode} key={post.data?.$id || ID.unique()} />
      );
    });
  }, [storedPost, storedPostLikes]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-[var(--brand-color)] flex flex-col gap-3 justify-center items-center z-[1000]">
        <ThreeDot color="white" textColor="white" />
        <p className="font-bold text-xs md:text-md tracking-wider uppercase">
          Getting latest for you
        </p>
      </div>
    );
  }

  return (
    <div
      id="feed"
      className="w-full lg:w-[40%] max-h-screen overflow-y-scroll scrollbar-hide"
    >
      {memoizedPosts}
    </div>
  );
};

export default React.memo(Feed);
