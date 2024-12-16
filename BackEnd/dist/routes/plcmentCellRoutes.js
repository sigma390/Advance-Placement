"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const placementCell_Controller_1 = require("../controllers/placementCell.Controller");
const validator_1 = __importDefault(require("../middlewares/validator"));
const zodSchema_1 = require("../utils/zodSchema");
const router = express_1.default.Router();
router.post('/register', (0, validator_1.default)(zodSchema_1.placementRegSchema), placementCell_Controller_1.registerPlacement); // Register a placement cell
// router.post('/login', loginPlacement); // Login a placement cell
router.post('/login', placementCell_Controller_1.loginPlacement);
exports.default = router;
