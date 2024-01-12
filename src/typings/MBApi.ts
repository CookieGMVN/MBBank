/**
 * Typing for Balance API endpoint.
 */
export interface BalanceData {
    /** Your selected account number. */
    number: string,
    /** Your account name. */
    name: string,
    /** Your account acceptable currency. */
    currency: string,
    /** Your account balance. */
    balance: string,
}

/**
 * List of balances in all accounts.
 */
export interface BalanceList {
    /** The main list for VND currency. */
    balances?: BalanceData[],
    /** The main list for other currencies (USD, Yen, ...) */
    internationalBalances?: BalanceData[],
    /** Currency exchange (I think so). */
    currencyEquivalent: string,
    /** Your account's total balance. */
    totalBalance: string,
}

/**
 * Typing for Transactions.
 */
export interface TransactionInfo {
    /** The date that MB posted the transaction. */
    postDate: string,
    /** The date you made the transaction. */
    transactionDate: string,
    /** The account number you made the transaction. */
    accountNumber: string,
    /** Credit amount changed after the transaction. */
    creditAmount: string,
    /** Debit amount changed after the transaction. */
    debitAmount: string,
    /** Transaction currency. */
    transactionCurrency: string,
    /** Transaction description. */
    transactionDesc: string,
    /** The balance available after the transaction. */
    balanceAvailable: string,
    /** Reference number of the transaction. */
    refNo: string,
    /** (If sender) The transaction's receipt account name. */
    toAccountName?: string,
    /** (If sender) The transaction's receipt account bank. */
    toBank?: string,
    /** (If sender) The transaction's receipt account number. */
    toAccountNumber?: string,
    /** Type of the transaction. */
    type?: string,
}