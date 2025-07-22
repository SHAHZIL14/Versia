import { Client, ID, Storage } from "appwrite";
import config from "../src/config/config";
class StorageService {
    storage;
    constructor() {
        const client = new Client()
            .setEndpoint(config.appwriteURL)
            .setProject(config.projectID);
        this.storage = new Storage(client);
    }

    async getFilesList() {
        try {
            const files = await this.storage.listFiles('687501a900076da2924b');
            return files.files;
        } catch (error) {
            throw error;
        }


    }

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                config.bucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            throw error;
        }
    }

    async getFile(fileId) {
        try {
            return await this.storage.getFile(config.bucketID, fileId)
        } catch (error) {
            error
        }

    }

    getFileView( fileId) {
        try {
            return this.storage.getFileView(config.bucketID, fileId);
        } catch (error) {
            throw error;
        }
    }
}
const storageServices = new StorageService();
export default storageServices;