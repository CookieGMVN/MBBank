/// <reference types="node" />
import { Client } from "undici";
import { EventEmitter } from "node:events";
import { BalanceList, TransactionInfo } from "./typings/MBApi";
export default class MB extends EventEmitter {
    readonly username: string;
    readonly password: string;
    private sessionId;
    private deviceId;
    private userInfo;
    client: Client;
    constructor(data: {
        username: string;
        password: string;
    });
    private login;
    private getRefNo;
    private mbRequest;
    getBalance(): Promise<BalanceList | undefined>;
    getTransactionsHistory(data: {
        accountNumber: string;
        fromDate: string;
        toDate: string;
    }): Promise<TransactionInfo[] | undefined>;
}
