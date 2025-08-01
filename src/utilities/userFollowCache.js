const userFollowCache = {};

export const updateUserFollowCache = (authorId, isFollowing) => {
    userFollowCache[authorId] = isFollowing;
    console.log(userFollowCache);
}
export const getUserFollowCache = (authorId) => {
    return userFollowCache[authorId];
}
