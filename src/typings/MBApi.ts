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