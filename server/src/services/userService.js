// server/src/services/userService.js
import User from '../models/User.js';

export const createOrUpdateUser = async (clerkUserId) => {
    try {
       
        
        // Tìm hoặc tạo user đơn giản
        const user = await User.findOneAndUpdate(
            { clerkUserId },
            { 
                clerkUserId,
                email: `user_${clerkUserId}@temp.com`, // Temporary email
                lastLogin: new Date(),
                updatedAt: new Date()
            },
            { 
                new: true, 
                upsert: true,
                setDefaultsOnInsert: true 
            }
        );

        ;
        return user;
    } catch (error) {
        console.error('Error creating/updating user:', error);
        throw error;
    }
};

export const incrementAnalysisCount = async (clerkUserId) => {
    try {
        await User.findOneAndUpdate(
            { clerkUserId },
            { 
                $inc: { analysisCount: 1 },
                updatedAt: new Date()
            },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error incrementing analysis count:', error);
    }
};