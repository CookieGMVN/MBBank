/*
 * MIT License
 *
 * Copyright (c) 2024 CookieGMVN and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { createHash } from "node:crypto";

import Jimp from "jimp";
import moment from "moment";
import { recognize } from "node-tesseract-ocr";
import replaceColor from "replace-color";
import { Client } from "undici";

import { FreeOcrRes } from "./typings/FreeOcrApi";
import { BalanceData, BalanceList, TransactionInfo } from "./typings/MBApi";
import { CaptchaResponse } from "./typings/MBLogin";
import { defaultHeaders, defaultTesseractConfig, FPR, generateDeviceId, getTimeNow } from "./utils/Global";
import wasmEnc from "./utils/LoadWasm";

/**
 * Main client class for all activities.
 */
export default class MB {
    /**
     * @readonly
     * Your MB account username.
    */
    public readonly username: string;

    /**
     * @readonly
     * Your MB account username.
    */
    public readonly keyApi: string | undefined;

    /**
    * @readonly
    * Your MB account password.
    */
    public readonly password: string;

    /**
     * @private
     * MB-returned Session ID. Use it to validate the request.
    */
    private sessionId: string | null | undefined;

    /**
    * @private
    * Your non-unique, time-based Device ID.
    */
    private deviceId: string = generateDeviceId();

    /**
     * Undici client. Use it for sending the request to API.
     */
    public client = new Client("https://online.mbbank.com.vn");

    /**
     * WASM Buffer, downloaded from MB.
     */
    private wasmData!: Buffer;

    /**
     * Login to your MB account via username and password.
     * @param data - Your MB Bank login credentials: username and password.
     * @param data.username Your MB Bank login username, usually your registered phone number.
     * @param data.password Your MB Bank login password.
     * @param data.keyApi see more at https://ocr.space/ocrapi
     */
    public constructor(data: { username: string, password: string, keyApi?: string }) {
        if (!data.username || !data.password) throw new Error("You must define at least a MB account to use with this library!");

        this.keyApi = data.keyApi;
        this.username = data.username;
        this.password = data.password;
    }

    /**
     * A private function to process MB's captcha and get Session ID.
     */
    private async login(): Promise<boolean> {
        // Request ID/Ref ID for MB
        const rId = getTimeNow();

        const headers = defaultHeaders as any;
        headers["X-Request-Id"] = rId;

        const captchaReq = await this.client.request({
            method: "POST",
            path: "/api/retail-web-internetbankingms/getCaptchaImage",
            headers,
            body: JSON.stringify({
                "sessionId": "",
                "refNo": rId,
                "deviceIdCommon": this.deviceId,
            }),
        });

        const captchaRes: CaptchaResponse = await captchaReq.body.json() as CaptchaResponse;


        let captchaContent = '';
        if (this.keyApi) {
            captchaContent = await this.solveCAPTCHAwithFreeOcrApi(captchaRes.imageString);
        }
        else {
            captchaContent = await this.solveCAPTCHAwithLocal(captchaRes.imageString);
        }

        // wasm
        if (!this.wasmData) {
            const wasm = await this.client.request({
                method: "GET",
                path: "/assets/wasm/main.wasm",
                headers: defaultHeaders,
            });
            this.wasmData = Buffer.from(await wasm.body.arrayBuffer());
        }

        // Create Data
        const requestData = {
            userId: this.username,
            password: createHash("md5").update(this.password).digest("hex"),
            captcha: captchaContent,
            ibAuthen2faString: FPR,
            sessionId: null,
            refNo: getTimeNow(),
            deviceIdCommon: this.deviceId,
        };

        const loginReq = await this.client.request({
            method: "POST",
            path: "/api/retail_web/internetbanking/v2.0/doLogin",
            headers: defaultHeaders,
            body: JSON.stringify({
                dataEnc: await wasmEnc(this.wasmData, requestData, "0"),
            }),
        });

        const loginRes = await loginReq.body.json() as any;

        if (!loginRes.result) {
            throw new Error("Login failed: Unknown data");
        }

        if (loginRes.result.ok) {
            this.sessionId = loginRes.sessionId;
            return true;
        }
        else if (loginRes.result.responseCode === "GW283") {
            // Again...
            return this.login();
        }
        else {
            const e = new Error("Login failed: (" + loginRes.result.responseCode + "): " + loginRes.result.message) as any;
            e.code = loginRes.result.responseCode;
            throw e;
        }
    }

    /**
     * A private function to calculate the reference ID required by MB.
     * @returns The reference ID that is required by MB.
     */
    private getRefNo() {
        return `${this.username}-${getTimeNow()}`;
    }

    private async solveCAPTCHAwithFreeOcrApi(base64img: string) {
        const formdata = new FormData();
            formdata.append("apikey", this.keyApi);
            formdata.append("base64Image", "data:image/png;base64," + base64img);
            formdata.append("language", "eng");
            formdata.append("OCREngine", "2");

            const requestOptions : RequestInit = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };

            const ocrRes = await fetch("https://api.ocr.space/parse/image", requestOptions);

            if (ocrRes.status !== 200) {
                throw new Error('lỗi api');
            }

            const jsonData : FreeOcrRes = await ocrRes.json() as FreeOcrRes;

            const captchaContent = (jsonData.ParsedResults[0]?.ParsedText || "").replaceAll("\n", "").replaceAll(" ", "");

            return captchaContent;
    }

    /**
     * giải captch
     * @returns string
     */
    private async solveCAPTCHAwithLocal(base64img: string) {
        let captchaBuffer = Buffer.from(base64img, "base64");

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

        // tại sao lại có .slice(0, -1);
        const captchaContent = (await recognize(captchaBuffer, defaultTesseractConfig)).replaceAll("\n", "").replaceAll(" ", "").slice(0, -1);
        return captchaContent;
    }

    private async mbRequest(data: { path: string, json?: object, headers?: object }) {
        if (!this.sessionId) {
            await this.login();
            this.mbRequest(data);
        }

        const rId = this.getRefNo();

        const headers = defaultHeaders as any;
        headers["X-Request-Id"] = rId;
        headers["Deviceid"] = this.deviceId,
            headers["Refno"] = rId;

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

    /**
     * Gets your account's balance info.
     * @returns Your MB account's balance object.
     */
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
    public async getTransactionsHistory(data: { accountNumber: string, fromDate: string, toDate: string }): Promise<TransactionInfo[] | undefined> {
        if (moment().day() - moment(data.fromDate, "D/M/YYYY").day() > 90 || moment().day() - moment(data.fromDate, "D/M/YYYY").day() > 90) throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");
        if (moment(data.fromDate, "DD/MM/YYYY").day() - moment(data.toDate, "D/M/YYYY").day() > 90) throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");

        const body = {
            "accountNo": data.accountNumber,
            "fromDate": moment(data.fromDate, "D/M/YYYY").format("DD/MM/YYYY"),
            "toDate": moment(data.toDate, "D/M/YYYY").format("DD/MM/YYYY"),
        };

        const historyData = await this.mbRequest({ path: "/api/retail-transactionms/transactionms/get-account-transaction-history", json: body });

        if (!historyData || !historyData.transactionHistoryList) return;

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
