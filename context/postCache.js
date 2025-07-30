const postLikeCache = {};

export const updatePostLikeCache = (postId, likes, isLiked) => {
  postLikeCache[postId] = { likes, isLiked };
};

export const getPostLikeCache = (postId) => {
  return postLikeCache[postId];
};
