"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MB_1 = __importDefault(require("./MB"));
(async () => {
    const mb = new MB_1.default({ username: "0974163549", password: "CookieGMVN2007@" });
    const transactions = await mb.getTransactionsHistory({ accountNumber: "0974163549", fromDate: "1/11/2023", toDate: "12/1/2024" });
    console.log(transactions);
})();
