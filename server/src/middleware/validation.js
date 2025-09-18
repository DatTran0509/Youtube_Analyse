import { body, validationResult } from 'express-validator';

export const validateYouTubeUrl = [
    body('url')
        .isURL()
        .withMessage('Invalid URL format')
        .custom(value => {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            if (!youtubeRegex.test(value)) {
                throw new Error('Not a valid YouTube URL');
            }
            return true;
        }),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};