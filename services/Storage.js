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
        const files = await this.storage.listFiles(config.bucketID);
        return files.files;
    }

    async uploadFile(file) {
        return await this.storage.createFile(
            config.bucketID,
            ID.unique(),
            file
        )
    }

    async getFile(fileId) {
        return await this.storage.getFile(config.bucketID, fileId)
    }

    getFileView(fileId) {
        return this.storage.getFileView(config.bucketID, fileId);
    }
}
const storageServices = new StorageService();
export default storageServices;
