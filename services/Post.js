import { Client, Databases, ID, Query } from "appwrite"
import config from "../src/config/config"
class PostServices {
    database;
    constructor() {
        const client = new Client()
            .setEndpoint(config.appwriteURL)
            .setProject(config.projectID)
        this.database = new Databases(client);
    }

    async addPost({ caption, imageUrl, status, userId, authorName, authorUserName, authorProfileURL }) {
        try {
            const post = await this.database.createDocument(
                config.databaseID,
                config.postCollectionID,
                ID.unique(),
                {
                    'authorId': userId,
                    'imageURL': imageUrl,
                    'status': status,
                    'caption': caption,
                }
            );

            const postData = await this.database.createDocument(
                config.databaseID,
                config.postMetaCollectionID,
                post.$id,
                {
                    'authorName': authorName,
                    'authorUserName': authorUserName,
                    'likes': 0,
                    'comments': 0,
                    'authorProfileURL': authorProfileURL,
                    'postId': post.$id
                }
            );
            return postData;
        } catch (error) {
            throw error;
        }
    }

    async getPost(postId) {
        try {
            return await this.database.getDocument(
                config.databaseID,
                config.postCollectionID,
                postId
            );
        } catch (error) {
            throw error;
        }
    }

    async getMetaPost(postId) {
        try {
            const metaPost = await this.database.getDocument(
                config.databaseID,
                config.postMetaCollectionID,
                postId
            )
            return metaPost;
        } catch (error) {
            throw error;
        }
    }

    async getIsLiked(postId, userId) {
        try {
            const getIsLiked = await this.database.listDocuments(
                config.databaseID,
                config.postLikesCollectionID,
                [
                    Query.equal('postId', postId),
                    Query.equal('userId', userId),
                ]
            );
            return getIsLiked;
        } catch (error) {
            throw error;
        }
    }

    async getPostBatch(cursorDocumentID) {
        try {
            return await this.database.listDocuments(
                config.databaseID,
                config.postCollectionID,
                [Query.orderDesc('$createdAt')]
            )
        } catch (error) {
            throw error
        }
    }

    async getMetaPostBatch(batch) {
        try {
            const postIds = batch.map((post) => post.$id);
            const metaPost = await this.database.listDocuments(
                config.databaseID,
                config.postMetaCollectionID,
                [Query.equal('postId', postIds)]
            );
            return metaPost;
        } catch (error) {

        }
    }

    async getPostLikesBatch(postIdBatch, userId) {
        try {

            if (postIdBatch.length == 0 || !userId) {
                return;
            };
            const result = await this.database.listDocuments(
                config.databaseID,
                config.postLikesCollectionID,
                [
                    Query.equal('postId', postIdBatch),
                    Query.equal('userId', userId)
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async likePost(postId, postMetaId, userId, currentLikes) {
        try {
            console.log(postId, postMetaId, userId, currentLikes);
            const likeDocument = await this.database.createDocument(
                config.databaseID,
                config.postLikesCollectionID,
                ID.unique(),
                {
                    postId: postId,
                    userId: userId
                }
            );
            const like = await this.database.updateDocument(
                config.databaseID,
                config.postMetaCollectionID,
                postMetaId,
                {
                    likes: currentLikes
                }
            );
            return like;
        } catch (error) {
            throw error;
        }
    }

    async unlikePost(postId, postMetaId, userId, currentLikes) {
        try {
            console.log(postId, postMetaId, userId, currentLikes);
            const idToDelete = (await this.database.listDocuments(
                config.databaseID,
                config.postLikesCollectionID,
                [
                    Query.equal('postId', postId),
                    Query.equal('userId', userId)
                ]
            )).documents[0].$id;

            const deleteDoc = await this.database.deleteDocument(
                config.databaseID,
                config.postLikesCollectionID,
                idToDelete
            );

            const unlike = await this.database.updateDocument(
                config.databaseID,
                config.postMetaCollectionID,
                postMetaId,
                {
                    likes: currentLikes
                }
            );
            return unlike;
        } catch (error) {
            throw error;
        }
    }
}
const postServices = new PostServices();
export default postServices;