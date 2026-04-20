const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

const googleAuth = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400);
            throw new Error('No Google token provided');
        }

        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        
        const payload = userResponse.data;
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ googleId: sub });

        if (user) {
            user.avatar = picture;
            user.name = name;
            await user.save();
        } else {
            user = await User.create({
                googleId: sub,
                name,
                email,
                avatar: picture
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '30d'
        });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token
        });

    } catch (error) {
        res.status(401);
        next(new Error('Invalid Google authentication'));
    }
};

module.exports = {
    googleAuth
};
