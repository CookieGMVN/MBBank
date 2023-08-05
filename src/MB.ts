import { Client } from "undici";
import { defaultHeaders, defaultTesseractConfig, generateDeviceId, getTimeNow } from "./utils/Global";
import { recognize } from "node-tesseract-ocr";
import { CaptchaResponse } from "./typings/MBLogin";
import replaceColor from "replace-color";
import Jimp from "jimp";
import { createHash } from "node:crypto";
import { BalanceData, BalanceList, TransactionInfo } from "./typings/MBApi";
import moment from "moment";

export default class MB {
    public readonly username: string;
    public readonly password: string;

    private sessionId: string | null | undefined;
    private deviceId: string = generateDeviceId();
    private userInfo: any = null;

    public client = new Client("https://online.mbbank.com.vn");

    public constructor(data: { username: string, password: string }) {
        if (!data.username || !data.password) throw new Error("You must define at least a MB account to use with this library!");

        this.username = data.username;
        this.password = data.password;
    }

    private async login() {
        // Request ID/Ref ID for MB
        const rId = getTimeNow();

        const headers = defaultHeaders as any;
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

        const captchaRes: CaptchaResponse = await captchaReq.body.json() as CaptchaResponse;
        let captchaBuffer = Buffer.from(captchaRes.imageString, "base64");

        // Remove the first line with static hex code
        const captchaImagePRCLine1 = await replaceColor({
            image: captchaBuffer,
            colors: {
                type: "hex",
                targetColor: "#847069",
                replaceColor: "#ffffff",
            },
        });

        captchaBuffer = await captchaImagePRCLine1.getBufferAsync(Jimp.MIME_PNG);

        // Remove the second line with static hex code
        const captchaImagePRCLine2 = await replaceColor({
            image: captchaBuffer,
            colors: {
                type: "hex",
                targetColor: "#ffe3d5",
                replaceColor: "#ffffff",
            },
        });

        captchaBuffer = await captchaImagePRCLine2.getBufferAsync(Jimp.MIME_PNG);
        captchaImagePRCLine2.write("op.png");

        // Get captcha via OCR
        const captchaContent = (await recognize(captchaBuffer, defaultTesseractConfig)).replaceAll("\n", "").replaceAll(" ", "").slice(0, -1);

        const loginReq = await this.client.request({
            method: "POST",
            path: "/retail_web/internetbanking/doLogin",
            headers: defaultHeaders,
            body: JSON.stringify({
                "userId": this.username,
                "password": createHash("md5").update(this.password).digest("hex"),
                "captcha": captchaContent,
                "sessionId": "",
                "refNo": getTimeNow(),
                "deviceIdCommon": this.deviceId,
            }),
        });

        const loginRes = await loginReq.body.json() as any;

        if (loginRes.result.ok) {
            this.sessionId = loginRes.sessionId;
            this.userInfo = loginRes;
        }
        else if (loginRes.result.responseCode === "GW283") {
            await this.login();
        }
        else {
            throw new Error("Login failed: (" + loginRes.result.responseCode + "): " + loginRes.result.message);
        }
    }

    private getRefNo() {
        return `${this.username}-${getTimeNow()}`;
    }

    private async mbRequest(data: { path: string, json?: object, headers?: object }) {
        if (!this.sessionId) {
            await this.login();
            this.mbRequest(data);
        }

        const rId = this.getRefNo();

        const headers = Object.assign(defaultHeaders, data.json) as any;
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

        const httpRes = await httpReq.body.json() as any;

        if (!httpRes.result) {
            this.getBalance();
        }
        else if (httpRes.result.ok == true) return httpRes;
        else if (httpRes.result.responseCode === "GW200") {
            await this.login();
            this.mbRequest(data);
        }
        else {
            throw new Error("Request failed (" + httpRes.result.responseCode + "): " + httpRes.result.message);
        }
    }

    public async getBalance(): Promise<BalanceList | undefined> {
        const balanceData = await this.mbRequest({ path: "/api/retail-web-accountms/getBalance" });

        if (!balanceData) return;

        const balance: BalanceList = {
            totalBalance: balanceData.totalBalanceEquivalent,
            currencyEquivalent: balanceData.currencyEquivalent,
            balances: [],
        };

        balanceData.acct_list.forEach((acctInfo: unknown) => {
            const acct = acctInfo as any;

            const balanceData: BalanceData = {
                number: acct.acctNo,
                name: acct.acctNm,
                currency: acct.ccyCd,
                balance: acct.currentBalance,
            };

            balance.balances?.push(balanceData);
        });

        balanceData.internationalAcctList.forEach((acctInfo: unknown) => {
            const acct = acctInfo as any;

            const balanceData: BalanceData = {
                number: acct.acctNo,
                name: acct.acctNm,
                currency: acct.ccyCd,
                balance: acct.currentBalance,
            };

            balance.balances?.push(balanceData);
        });

        return balance;
    }

    async getTransactionsHistory(data: { accountNumber: string, fromDate: string, toDate: string }) {
        if (moment().day() - moment(data.fromDate, "D/M/YYYY").day() > 90 || moment().day() - moment(data.fromDate, "D/M/YYYY").day() > 90) throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");
        if (moment(data.fromDate, "DD/MM/YYYY").day() - moment(data.toDate, "D/M/YYYY").day() > 90) throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");

        const body = {
            "accountNo": data.accountNumber,
            "fromDate": moment(data.fromDate, "D/M/YYYY").format("DD/MM/YYYY"),
            "toDate": moment(data.toDate, "D/M/YYYY").format("DD/MM/YYYY"),
        };

        const historyData = await this.mbRequest({ path: "/retail-web-transactionservice/transaction/getTransactionAccountHistory", json: body });

        if (!historyData) return;

        const transactionHistories: TransactionInfo[] = [];

        historyData.transactionHistoryList.forEach((transactionRaw: unknown) => {

            const transaction = transactionRaw as any;

            const transactionData: TransactionInfo = {
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