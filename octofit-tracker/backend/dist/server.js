"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Octofit Tracker backend is running' });
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
