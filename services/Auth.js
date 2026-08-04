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

    async register(email, password, name) {
                return await this.account.create(
            ID.unique(),
            email,
            password,
            name
        );

    }

    async login(email, password) {
                await this.account.createEmailPasswordSession(email, password);
        return await this.getUser();
    }

    async logout() {
                return await this.account.deleteSessions();
    }

    async getUser() {
                return await this.account.get()
    }

    async sendVerificationLink() {
                return await this.account.createVerification('https://versia.vercel.app/verify');
    }

    async verifyEmailAddress(userId, secret) {
                return await this.account.updateVerification(userId, secret);
    }
}
const authService = new AuthenticationServices();

export default authService;