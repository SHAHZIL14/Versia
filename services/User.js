import { Client, Databases, ID, Query } from "appwrite";
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
            let profileSource = ''
            if (profilePicFile) {
                profileSource = storageServices.getFileView((await storageServices.uploadFile(profilePicFile)).$id);
            }

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

    async getUserPosts(userId) {
        return await this.database.listDocuments(
            config.databaseID,
            config.postCollectionID,
            [Query.equal('authorId', userId)]
        );
    }

    async updateUserBio(bio, userDataId) {
        try {
            const updateBio = await this.database.updateDocument(
                config.databaseID,
                config.userCollectionID,
                userDataId,
                {
                    userBio: bio
                }
            );
            return updateBio;
        } catch (error) {
            throw error
        }
    }

    async updateUserProfilePic(file, userId) {
        try {
            const newProfileSource = storageServices.getFileView((await storageServices.uploadFile(file)).$id);
            const updateProfileSource = await this.database.updateDocument(
                config.databaseID,
                config.userCollectionID,
                userId,
                {
                    profileSource: newProfileSource
                }
            )
            return updateProfileSource;
        } catch (error) {
            throw error;
        }
    }

    async getUsersFollowee(userId) {
        try {
            const followeeList = (await this.database.listDocuments(
                config.databaseID,
                config.followerCollectionID,
                [
                    Query.equal('followerId', userId)
                ]
            )).documents;
            return followeeList;
        } catch (error) {
            throw error;
        }
    }

    async follow(followeeUserId, followerUserId) {
        try {
            await this.database.createDocument(
                config.databaseID,
                config.followerCollectionID,
                ID.unique(),
                {
                    followerId: followerUserId,
                    followeeId: followeeUserId
                }
            );

            const prevFollowers = (await this.database.getDocument(
                config.databaseID,
                config.userCollectionID,
                followeeUserId
            )).followers;
            await this.database.updateDocument(
                config.databaseID,
                config.userCollectionID,
                followeeUserId,
                {
                    followers: prevFollowers + 1
                }
            )

            const prevFollowing = (await this.database.getDocument(
                config.databaseID,
                config.userCollectionID,
                followerUserId
            )).following;
            return await this.database.updateDocument(
                config.databaseID,
                config.userCollectionID,
                followerUserId,
                {
                    following: prevFollowing + 1
                }
            )

        } catch (error) {
            throw error;
        }
    }

    async unfollow(followeeUserId, followerUserId) {
        try {
            const followDocId = (await this.database.listDocuments(
                config.databaseID,
                config.followerCollectionID,
                [
                    Query.equal('followeeId', followeeUserId),
                    Query.equal('followerId', followerUserId)
                ]
            )).documents[0].$id;
            await this.database.deleteDocument(
                config.databaseID,
                config.followerCollectionID,
                followDocId
            );

            const prevFollowing = (await this.database.getDocument(
                config.databaseID,
                config.userCollectionID,
                followerUserId
            )).following;
            await this.database.updateDocument(
                config.databaseID,
                config.userCollectionID,
                followerUserId,
                {
                    following: prevFollowing - 1
                }
            )

            const prevFollowers = (await this.database.getDocument(
                config.databaseID,
                config.userCollectionID,
                followeeUserId
            )).followers;
            return await this.database.updateDocument(
                config.databaseID,
                config.userCollectionID,
                followeeUserId,
                {
                    followers: prevFollowers - 1
                }
            )

        } catch (error) {
            throw error;
        }
    }

    async getFollowersCountBatch(batchIds) {
        try {
            if (batchIds.length == 0) return;
            const userDocs = (await this.database.listDocuments(
                config.databaseID,
                config.userCollectionID,
                [
                    Query.equal('$id', batchIds)
                ]
            )).documents;
            return userDocs.map((doc) => {
                return {
                    id: doc.$id,
                    follower: doc.followers,
                    following: doc.following
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

const userServices = new UserSevices();

export default userServices;