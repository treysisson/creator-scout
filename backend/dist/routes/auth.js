"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const router = express_1.default.Router();
// Instagram OAuth login
router.get('/instagram', (req, res) => {
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${config_1.config.instagram.clientId}&redirect_uri=${config_1.config.instagram.redirectUri}&scope=user_profile,user_media&response_type=code`;
    res.redirect(instagramAuthUrl);
});
// Instagram OAuth callback
router.get('/instagram/callback', async (req, res) => {
    const { code } = req.query;
    try {
        // Exchange code for access token
        const tokenResponse = await axios_1.default.post('https://api.instagram.com/oauth/access_token', {
            client_id: config_1.config.instagram.clientId,
            client_secret: config_1.config.instagram.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: config_1.config.instagram.redirectUri,
            code: code
        });
        const { access_token, user_id } = tokenResponse.data;
        // Get long-lived access token
        const longLivedTokenResponse = await axios_1.default.get('https://graph.instagram.com/access_token', {
            params: {
                grant_type: 'ig_exchange_token',
                client_secret: config_1.config.instagram.clientSecret,
                access_token: access_token
            }
        });
        // Store the token securely (in a real app, you'd want to store this in a secure way)
        // For MVP, we'll send it back to the client
        res.json({
            access_token: longLivedTokenResponse.data.access_token,
            user_id
        });
    }
    catch (error) {
        console.error('Instagram auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
exports.default = router;
