import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useFollowerStore = create(
    devtools(
        (set) => ({
            followersMap: {},

            setFollowerCount: (userId, followersCount, followingCount) =>
                set((state) => ({
                    followersMap: {
                        ...state.followersMap,
                        [userId]: {
                            followersCount,
                            followingCount,
                        },
                    },
                })),


            incrementFollower: (userId) =>
                set((state) => {
                    const prev = state.followersMap[userId] || { followersCount: 0, followingCount: 0 };
                    return {
                        followersMap: {
                            ...state.followersMap,
                            [userId]: {
                                ...prev,
                                followersCount: prev.followersCount + 1,
                            },
                        },
                    };
                }),


            decrementFollower: (userId) =>
                set((state) => {
                    const prev = state.followersMap[userId] || { followersCount: 1, followingCount: 0 };
                    return {
                        followersMap: {
                            ...state.followersMap,
                            [userId]: {
                                ...prev,
                                followersCount: Math.max(prev.followersCount - 1, 0),
                            },
                        },
                    };
                }),


            incrementFollowing: (userId) =>
                set((state) => {
                    const prev = state.followersMap[userId] || { followersCount: 0, followingCount: 0 };
                    return {
                        followersMap: {
                            ...state.followersMap,
                            [userId]: {
                                ...prev,
                                followingCount: prev.followingCount + 1,
                            },
                        },
                    };
                }),


            decrementFollowing: (userId) =>
                set((state) => {
                    const prev = state.followersMap[userId] || { followersCount: 0, followingCount: 1 };
                    return {
                        followersMap: {
                            ...state.followersMap,
                            [userId]: {
                                ...prev,
                                followingCount: Math.max(prev.followingCount - 1, 0),
                            },
                        },
                    };
                }),
        }),
        { name: 'FollowerStore' }
    )
);

export default useFollowerStore;
