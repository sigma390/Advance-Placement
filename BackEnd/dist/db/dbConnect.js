"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const DB_URL = process.env.MONGODB_URL || '';
const MongoConnect = () => {
    try {
        mongoose_1.default.connect(DB_URL, {});
        console.log('Connected To DB successfully');
    }
    catch (error) {
        throw new Error('Error connecting to database');
    }
};
exports.default = MongoConnect;
