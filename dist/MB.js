"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
const Global_1 = require("./utils/Global");
const node_tesseract_ocr_1 = require("node-tesseract-ocr");
const replace_color_1 = __importDefault(require("replace-color"));
const jimp_1 = __importDefault(require("jimp"));
const node_crypto_1 = require("node:crypto");
const moment_1 = __importDefault(require("moment"));
/**
 * Main client class for all activities.
 */
class MB {
    /**
     * @readonly
     * Your MB account username.
    */
    username;
    /**
    * @readonly
    * Your MB account password.
    */
    password;
    /**
     * @private
     * MB-returned Session ID. Use it to validate the request.
    */
    sessionId;
    /**
    * @private
    * Your non-unique, time-based Device ID.
    */
    deviceId = (0, Global_1.generateDeviceId)();
    /**
     * Undici client. Use it for sending the request to API.
     */
    client = new undici_1.Client("https://online.mbbank.com.vn");
    /**
     * Login to your MB account via username and password.
     * @param data - Your MB Bank login credentials: username and password.
     * @param data.username Your MB Bank login username, usually your registered phone number.
     * @param data.password Your MB Bank login password.
     */
    constructor(data) {
        if (!data.username || !data.password)
            throw new Error("You must define at least a MB account to use with this library!");
        this.username = data.username;
        this.password = data.password;
    }
    /**
     * A private function to process MB's captcha and get Session ID.
     */
    async login() {
        // Request ID/Ref ID for MB
        const rId = (0, Global_1.getTimeNow)();
        const headers = Global_1.defaultHeaders;
        headers["X-Request-Id"] = rId;
        const captchaReq = await this.client.request({
            method: "POST",
            path: "/retail-web-internetbankingms/getCaptchaImage",
            headers,
            body: JSON.stringify({
                "sessionId": "",
                "refNo": rId,
                "deviceIdCommon": this.deviceId,
            }),
        });
        const captchaRes = await captchaReq.body.json();
        let captchaBuffer = Buffer.from(captchaRes.imageString, "base64");
        // Remove the first line with static hex code
        const captchaImagePRCLine1 = await (0, replace_color_1.default)({
            image: captchaBuffer,
            colors: {
                type: "hex",
                targetColor: "#847069",
                replaceColor: "#ffffff",
            },
        });
        captchaBuffer = await captchaImagePRCLine1.getBufferAsync(jimp_1.default.MIME_PNG);
        // Remove the second line with static hex code
        const captchaImagePRCLine2 = await (0, replace_color_1.default)({
            image: captchaBuffer,
            colors: {
                type: "hex",
                targetColor: "#ffe3d5",
                replaceColor: "#ffffff",
            },
        });
        captchaBuffer = await captchaImagePRCLine2.getBufferAsync(jimp_1.default.MIME_PNG);
        // Get captcha via OCR
        const captchaContent = (await (0, node_tesseract_ocr_1.recognize)(captchaBuffer, Global_1.defaultTesseractConfig)).replaceAll("\n", "").replaceAll(" ", "").slice(0, -1);
        const loginReq = await this.client.request({
            method: "POST",
            path: "/retail_web/internetbanking/doLogin",
            headers: Global_1.defaultHeaders,
            body: JSON.stringify({
                "userId": this.username,
                "password": (0, node_crypto_1.createHash)("md5").update(this.password).digest("hex"),
                "captcha": captchaContent,
                "sessionId": "",
                "refNo": (0, Global_1.getTimeNow)(),
                "deviceIdCommon": this.deviceId,
            }),
        });
        const loginRes = await loginReq.body.json();
        if (loginRes.result.ok) {
            this.sessionId = loginRes.sessionId;
        }
        else if (loginRes.result.responseCode === "GW283") {
            await this.login();
        }
        else {
            throw new Error("Login failed: (" + loginRes.result.responseCode + "): " + loginRes.result.message);
        }
    }
    /**
     * A private function to calculate the reference ID required by MB.
     * @returns The reference ID that is required by MB.
     */
    getRefNo() {
        return `${this.username}-${(0, Global_1.getTimeNow)()}`;
    }
    async mbRequest(data) {
        if (!this.sessionId) {
            await this.login();
            this.mbRequest(data);
        }
        const rId = this.getRefNo();
        const headers = Object.assign(Global_1.defaultHeaders, data.json);
        headers["X-Request-Id"] = rId;
        const defaultBody = {
            "sessionId": this.sessionId,
            "refNo": rId,
            "deviceIdCommon": this.deviceId,
        };
        const body = Object.assign(defaultBody, data.json);
        const httpReq = await this.client.request({
            method: "POST",
            path: data.path,
            headers,
            body: JSON.stringify(body),
        });
        const httpRes = await httpReq.body.json();
        if (!httpRes.result) {
            this.getBalance();
        }
        else if (httpRes.result.ok == true)
            return httpRes;
        else if (httpRes.result.responseCode === "GW200") {
            await this.login();
            this.mbRequest(data);
        }
        else {
            throw new Error("Request failed (" + httpRes.result.responseCode + "): " + httpRes.result.message);
        }
    }
    /**
     * Gets your account's balance info.
     * @returns Your MB account's balance object.
     */
    async getBalance() {
        const balanceData = await this.mbRequest({ path: "/api/retail-web-accountms/getBalance" });
        if (!balanceData)
            return;
        const balance = {
            totalBalance: balanceData.totalBalanceEquivalent,
            currencyEquivalent: balanceData.currencyEquivalent,
            balances: [],
        };
        balanceData.acct_list.forEach((acctInfo) => {
            const acct = acctInfo;
            const balanceData = {
                number: acct.acctNo,
                name: acct.acctNm,
                currency: acct.ccyCd,
                balance: acct.currentBalance,
            };
            balance.balances?.push(balanceData);
        });
        balanceData.internationalAcctList.forEach((acctInfo) => {
            const acct = acctInfo;
            const balanceData = {
                number: acct.acctNo,
                name: acct.acctNm,
                currency: acct.ccyCd,
                balance: acct.currentBalance,
            };
            balance.balances?.push(balanceData);
        });
        return balance;
    }
    /**
     * Gets all your transactions on MB.
     * @param data The data that function requires.
     * @param data.accountNumber The MB's account number needs to be checked.
     * @param data.fromDate The date you want to start looking up, format dd/mm/yyyy. Make sure this is not smaller than 90 days from the ending date.
     * @param data.toDate The date you want to end the lookup, format dd/mm/yyyy. Make sure this is not bigger than 90 days from the starting date.
     * @returns TransactionInfo object as an array, see TransactionInfo for more details.
     *
     * @example
     * If you want to get transactions history from account "1234567890", from 1/12/2023 to 1/1/2024:
     * ```ts
     * <MB>.getTransactionsHistory({ accountNumber: "1234567890", fromDate: "1/12/2023", toDate: "1/1/2024" });
     * ```
     */
    async getTransactionsHistory(data) {
        if ((0, moment_1.default)().day() - (0, moment_1.default)(data.fromDate, "D/M/YYYY").day() > 90 || (0, moment_1.default)().day() - (0, moment_1.default)(data.fromDate, "D/M/YYYY").day() > 90)
            throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");
        if ((0, moment_1.default)(data.fromDate, "DD/MM/YYYY").day() - (0, moment_1.default)(data.toDate, "D/M/YYYY").day() > 90)
            throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");
        const body = {
            "accountNo": data.accountNumber,
            "fromDate": (0, moment_1.default)(data.fromDate, "D/M/YYYY").format("DD/MM/YYYY"),
            "toDate": (0, moment_1.default)(data.toDate, "D/M/YYYY").format("DD/MM/YYYY"),
        };
        const historyData = await this.mbRequest({ path: "/retail-web-transactionservice/transaction/getTransactionAccountHistory", json: body });
        if (!historyData)
            return;
        const transactionHistories = [];
        historyData.transactionHistoryList.forEach((transactionRaw) => {
            const transaction = transactionRaw;
            const transactionData = {
                postDate: transaction.postingDate,
                transactionDate: transaction.transactionDate,
                accountNumber: transaction.accountNo,
                creditAmount: transaction.creditAmount,
                debitAmount: transaction.debitAmount,
                transactionCurrency: transaction.currency,
                transactionDesc: transaction.description,
                balanceAvailable: transaction.availableBalance,
                refNo: transaction.refNo,
                toAccountName: transaction.benAccountName,
                toBank: transaction.bankName,
                toAccountNumber: transaction.benAccountName,
                type: transaction.transactionType,
            };
            transactionHistories.push(transactionData);
        });
        return transactionHistories;
    }
}
exports.default = MB;
