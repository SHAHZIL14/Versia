import { Client, ID, Account } from 'appwrite'
import config from '../src/config/config.js'
class AuthenticationServices {
    account;
    constructor() {
        const client = new Client();
        client.setEndpoint(config.appwriteURL);
        client.setProject(config.projectID);
        this.account = new Account(client);
    }

    async register(email, password , name) {
        try {
            return await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

        } catch (error) {
            throw error
        }
    }

    async login(email, password) {
        try {
            await this.account.createEmailPasswordSession(email, password);
            return await this.getUser();
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    async getUser() {
        try {
            return await this.account.get()
        } catch (error) {
            throw error;
        }
    }
}
const authService = new AuthenticationServices();

export default authService;