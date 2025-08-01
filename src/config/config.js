const config = {
    appwriteURL: String(import.meta.env.VITE_REACT_APP_APPWRITE_URL),
    projectID: String(import.meta.env.VITE_PROJECT_ID),
    databaseID: String(import.meta.env.VITE_DB_ID),
    postCollectionID: String(import.meta.env.VITE_POST_COLLECTION_ID),
    postMetaCollectionID: String(import.meta.env.VITE_POST_META_COLLECTION_ID),
    followerCollectionID: String(import.meta.env.VITE_FOLLOWER_COLLECTION_ID),
    postLikesCollectionID: String(import.meta.env.VITE_POST_LIKES_COLLECTION_ID),
    userCollectionID: String(import.meta.env.VITE_USER_COLLECTION_ID),
    bucketID: String(import.meta.env.VITE_BUCKET_ID)
}

export default config;