import { Client, Databases, ID } from "appwrite";
import config from "../src/config/config";
import storageServices from "./Storage";
class UserSevices {
    database;
    constructor() {
        const client = new Client()
            .setEndpoint(config.appwriteURL)
            .setProject(config.projectID)
        this.database = new Databases(client);
    }

    async addUserInfo(userId, { username, password, email, name }, profilePicFile) {
        try {
            const uploadedFileId = '' || (await storageServices.uploadFile(profilePicFile)).$id;
            const profileSource = storageServices.getFileView(uploadedFileId);
            return await this.database.createDocument(
                config.databaseID,
                config.userCollectionID,
                userId,
                {
                    username,
                    password,
                    email,
                    profileSource,
                    name
                }
            )
        } catch (error) {
            throw error;
        }

    }

    async getUserInfo(userId) {
        try {
            return await this.database.getDocument(
                config.databaseID,
                config.userCollectionID,
                userId
            )
        } catch (error) {
            throw error;
        }

    }
}

const userServices = new UserSevices();

export default userServices;