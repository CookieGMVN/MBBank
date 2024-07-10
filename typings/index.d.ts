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

import { Client } from "undici";

export class MB {
    public readonly username: string;
    public readonly password: string;
    private sessionId: string | null | undefined;
    private deviceId: string;

    public client: Client;
    public constructor(data: { username: string, password: string });

    private login(): Promise<void>;
    private getRefNo(): string;
    private mbRequest(data: { path: string, json?: object, headers?: object }): Promise<any>;
    public getBalance(): Promise<BalanceList | undefined>;
    public getTransactionsHistory(data: { accountNumber: string, fromDate: string, toDate: string }): Promise<TransactionInfo[] | undefined>;
}

export interface BalanceData {
    number: string,
    name: string,
    currency: string,
    balance: string,
}

export interface BalanceList {
    balances?: BalanceData[],
    internationalBalances?: BalanceData[],
    currencyEquivalent: string,
    totalBalance: string,
}

export interface TransactionInfo {
    postDate: string,
    transactionDate: string,
    accountNumber: string,
    creditAmount: string,
    debitAmount: string,
    transactionCurrency: string,
    transactionDesc: string,
    balanceAvailable: string,
    refNo: string,
    toAccountName?: string,
    toBank?: string,
    toAccountNumber?: string,
    type?: string,
}

export interface CaptchaResponse {
    refNo: string,
    result: {
        message: string,
        responseCode: string,
        ok: boolean
    },
    imageString: string
}