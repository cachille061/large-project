// backend/src/services/user.service.ts
import mongoose from 'mongoose';

/**
 * Fetch a single user by their ID from Better Auth's user collection
 * @param userId - The user's ID
 * @returns User object or null if not found
 */
export const getUserById = async (userId: string) => {
    try {
        const usersCollection = mongoose.connection.collection('user');

        const user = await usersCollection.findOne(
            { id: userId },
            {
                projection: {
                    id: 1,
                    name: 1,
                    email: 1,
                    image: 1,
                    createdAt: 1,
                    _id: 0 // Exclude MongoDB's internal _id
                }
            }
        );

        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
    }
};

/**
 * Fetch a single user by their email from Better Auth's user collection
 * @param email - The user's email address
 * @returns User object or null if not found
 */
export const getUserByEmail = async (email: string) => {
    try {
        const usersCollection = mongoose.connection.collection('user');

        const user = await usersCollection.findOne(
            { email },
            {
                projection: {
                    id: 1,
                    name: 1,
                    email: 1,
                    image: 1,
                    createdAt: 1,
                    _id: 0
                }
            }
        );

        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
};

/**
 * Fetch multiple users by their IDs (useful for batch operations)
 * @param userIds - Array of user IDs
 * @returns Array of user objects
 */
export const getUsersByIds = async (userIds: string[]) => {
    try {
        const usersCollection = mongoose.connection.collection('user');

        const users = await usersCollection.find(
            { id: { $in: userIds } },
            {
                projection: {
                    id: 1,
                    name: 1,
                    email: 1,
                    image: 1,
                    _id: 0
                }
            }
        ).toArray();

        return users;
    } catch (error) {
        console.error('Error fetching users by IDs:', error);
        return [];
    }
};