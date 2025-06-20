"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const search_1 = __importDefault(require("./routes/search"));
const auth_1 = __importDefault(require("./routes/auth"));
const influencers_1 = __importDefault(require("./routes/influencers"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/search', search_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/influencers', influencers_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(config_1.config.port, () => {
    console.log(`Server is running on port ${config_1.config.port}`);
});
