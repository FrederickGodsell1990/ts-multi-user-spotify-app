"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// extract the schema from that mongoose object
const Schema = mongoose_1.default.Schema;
// create a new post schema
const testDataSchema = new Schema({
    testData: {
        type: String,
        required: true
    }
});
// export the model
exports.default = mongoose_1.default.model('testDataSchema', testDataSchema);
