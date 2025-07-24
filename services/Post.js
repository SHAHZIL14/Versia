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
                    'caption': caption,
                    'imageUrl': imageUrl,
                    'status': status,
                    'authorId': userId
                }
            );
            
            const postData = await this.database.createDocument(
                config.databaseID,
                config.postMetaCollectionID,
                ID.unique(),
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
}
const postServices = new PostServices();
export default postServices;