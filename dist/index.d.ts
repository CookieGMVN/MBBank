import { Client } from 'undici';

interface BalanceData {
    number: string;
    name: string;
    currency: string;
    balance: string;
}
interface BalanceList {
    balances?: BalanceData[];
    internationalBalances?: BalanceData[];
    currencyEquivalent: string;
    totalBalance: string;
}
interface TransactionInfo {
    postDate: string;
    transactionDate: string;
    accountNumber: string;
    creditAmount: string;
    debitAmount: string;
    transactionCurrency: string;
    transactionDesc: string;
    balanceAvailable: string;
    refNo: string;
    toAccountName?: string;
    toBank?: string;
    toAccountNumber?: string;
    type?: string;
}

/**
 * Main client class for all activities.
 */
declare class MB {
    /**
     * @readonly
     * Your MB account username.
    */
    readonly username: string;
    /**
    * @readonly
    * Your MB account password.
    */
    readonly password: string;
    /**
     * @private
     * MB-returned Session ID. Use it to validate the request.
    */
    private sessionId;
    /**
    * @private
    * Your non-unique, time-based Device ID.
    */
    private deviceId;
    /**
     * Undici client. Use it for sending the request to API.
     */
    client: Client;
    /**
     * WASM Buffer, downloaded from MB.
     */
    private wasmData;
    /**
     * Login to your MB account via username and password.
     * @param data - Your MB Bank login credentials: username and password.
     * @param data.username Your MB Bank login username, usually your registered phone number.
     * @param data.password Your MB Bank login password.
     */
    constructor(data: {
        username: string;
        password: string;
    });
    /**
     * A private function to process MB's captcha and get Session ID.
     */
    private login;
    /**
     * A private function to calculate the reference ID required by MB.
     * @returns The reference ID that is required by MB.
     */
    private getRefNo;
    private mbRequest;
    /**
     * Gets your account's balance info.
     * @returns Your MB account's balance object.
     */
    getBalance(): Promise<BalanceList | undefined>;
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
    getTransactionsHistory(data: {
        accountNumber: string;
        fromDate: string;
        toDate: string;
    }): Promise<TransactionInfo[] | undefined>;
}

export { MB };
