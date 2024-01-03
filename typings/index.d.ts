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