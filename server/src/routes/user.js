// server/src/routes/auth.js
import express from 'express';
import User from '../models/User.js';

const userRoutes = express.Router();

userRoutes.post('/sync', async (req, res) => {
    try {
        const { clerkId, email, name } = req.body;
        
        if (!clerkId || clerkId.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'ClerkId is required'
            });
        }

        const cleanClerkId = clerkId.trim();
        const cleanEmail = email ? email.trim() : null;
        const cleanName = name ? name.trim() : null;

        let user = await User.findOne({ clerkUserId: cleanClerkId });

        if (user) {
            let updated = false;
            
            if (cleanEmail && user.email !== cleanEmail) {
                user.email = cleanEmail;
                updated = true;
            }
            
            if (cleanName && user.name !== cleanName) {
                user.name = cleanName;
                updated = true;
            }
            
            if (updated) {
                user.updatedAt = new Date();
                await user.save();
            }
            
            return res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        clerkUserId: user.clerkUserId,
                        email: user.email,
                        name: user.name
                    },
                    action: updated ? 'updated' : 'no_change'
                }
            });
        } else {
            user = new User({
                clerkUserId: cleanClerkId,
                email: cleanEmail || `user_${cleanClerkId}@temp.com`,
                name: cleanName || 'User',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await user.save();

            return res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        clerkUserId: user.clerkUserId,
                        email: user.email,
                        name: user.name
                    },
                    action: 'created'
                }
            });
        }

    } catch (error) {
        console.error('Sync user error:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to sync user',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default userRoutes;