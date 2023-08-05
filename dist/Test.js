"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MB_1 = __importDefault(require("./MB"));
(async () => {
    const mb = new MB_1.default({ username: "", password: "" });
    console.log(mb);
})();
