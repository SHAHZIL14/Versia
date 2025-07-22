import { Client, Databases, ID, Query } from "appwrite"
import config from "../src/config/config"
import userServices from "./User";
class PostServices {
    database;
    constructor() {
        const client = new Client()
            .setEndpoint(config.appwriteURL)
            .setProject(config.projectID)
        this.database = new Databases(client);
    }

    async addPost({ caption = '', imageUrl, userId, status }) {
        try {
            const userInfo = await userServices.getUserInfo(userId);
            let likes = 0;
            let comments = 0;
            return await this.database.createDocument(
                config.databaseID,
                config.postCollectionID,
                ID.unique(),
                {
                    caption,
                    imageUrl,
                    likes,
                    comments,
                    status,
                    authorName: userInfo.name,
                    authorUserName:userInfo.username,
                    authorProfileURL:userInfo.profileSource
                }
            )
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
}
const postServices = new PostServices();
export default postServices;