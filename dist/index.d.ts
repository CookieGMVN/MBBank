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
interface LoginResponseData {
    refNo: string;
    result: {
        message: string;
        ok: boolean;
        responseCode: string;
    };
    sessionId: string;
    cust: {
        id: string;
        addr1: string;
        addr2: string;
        addr3: string | null;
        chrgAcctCd: string;
        cityCd: string | null;
        correspondentEmail: string;
        createdBy: string;
        creditFrameworkBranch: string | null;
        creditFrameworkContract: string | null;
        custSectorCd: string;
        email1: string;
        email2: string | null;
        entrustId: string;
        hndlingOfficerCd: string;
        hostCifId: string;
        idTypDt: number;
        idTypDtValue: null;
        idTypNo: string;
        idTypPlace: string;
        idTypType: string;
        idExpiryDate: number;
        isDelete: string;
        isInactive: string;
        isLoan: string;
        mobilePhoneNo1: string;
        mobilePhoneNo2: string | null;
        dob: string;
        dobObj: number;
        nm: string;
        orgUnitCd: string;
        phoneNo: string;
        secHndlingOfficerCd: string;
        spiUsrCd: string;
        srvcPcCd: string;
        stateCd: string | null;
        userId: string;
        state: number;
        gender: string;
        password: string;
        imUserStatus: string;
        auth_type: string | null;
        device_no: string | null;
        chargeCd: string | null;
        menuCd: string | null;
        limitCd: string | null;
        acct_list: {
            [accountNumber: string]: {
                acctNo: string;
                acctAlias: string;
                acctNm: string;
                acctTypCd: string;
                ccyCd: string;
                custId: string;
                hostCustId: string;
                inactiveSts: string;
                orgUnitCd: string;
                isCrdt: string;
                isDebit: string;
                isInq: string;
                currentBalance: string | null;
                isSync: string | null;
                category: string;
                productType: string;
            };
        };
        cardList: {
            [cardNumber: string]: {
                id: string | null;
                acctNm: string;
                acctNo: string;
                alwOverLmtPerDay: string | null;
                alwOverNoTrxPerDay: string | null;
                billingDt: string | null;
                cardCatCd: string | null;
                cardFlag: string | null;
                cardLvl: string;
                cardNm: string;
                cardNo: string;
                cardPrdCd: string;
                cardTyp: string;
                ccyCd: string;
                creditLmt: number | null;
                hostCustId: string;
                isAccsEbanking: string | null;
                orgUnitCd: string | null;
                pmryCardNm: string;
                pmryCardNo: string;
                prdTypCd: string | null;
                splmtryFlag: string | null;
                sts: string;
                stsCard: string | null;
                stsInetUsage: string;
                validThrough: string;
                cardCtkd: string | null;
                branchCode: string | null;
                cardDisplay: string | null;
                amountAvailable: string | null;
                interestRate: string | null;
                type: string | null;
                activeDate: string | null;
                groupDebit: string | null;
                outstandingBalance: string | null;
                totalWithDrawInMonth: string | null;
                maxWithDraw: string | null;
                err: string | null;
                messageErr: string | null;
                embossedName: string | null;
                minPaymentAmount: string | null;
                cardStatusDetail: string | null;
                contractStatusName: string | null;
                regNumber: string | null;
                isConfirm: string;
                isSourceDebit: string | null;
                cardNumber: string | null;
                packIncActive: string | null;
                plasticStatus: string | null;
                productStatus: string | null;
                contractStatusCode: string | null;
                approvalStatus: string | null;
                cardCode: string | null;
                cardClassDetail: string | null;
                isExtendValid: string | null;
                paidAmount: string | null;
                currentMinPayment: string | null;
                currentPayment: string | null;
                debtMoment: string | null;
                totalDebitAmount: string | null;
                printingStatus: string | null;
                cardProgramCd: string | null;
                debitMethod: string | null;
                cardOpenDate: string | null;
                printAddress: string | null;
                printDt: string | null;
                channel: string | null;
                htnt: string | null;
                addtionalCard: string | null;
                rbsNumber: string | null;
                typeTemplate: string | null;
                tokenStatus: string | null;
                tokenCode: string | null;
                serialId: string | null;
            };
        };
        saving_acct_list: Record<string, unknown>;
        photoStr: string | null;
        maxInactiveInterval: string;
        menuList: Array<{
            code: string;
            name: string;
            parentCode: string | null;
            priority: string;
            menuType: string;
            icon: string | null;
            url: string;
        }>;
        lastLogin: string;
        ctryCd: string;
        refNumber: string | null;
        createdDt: number;
        isSoftToken: string;
        softTokenList: Array<{
            deviceNo: string;
            custId: string;
            deviceType: string;
            isDefault: string;
            clazz: string;
            isReset: string | null;
            isMtAssigned: string | null;
            deviceId: string;
            token: string;
            status: string;
            retry: number;
            mobileDeviceId: string;
            phoneId: string;
            assignedDt: string | null;
            registeredDt: number;
            userId: string | null;
            activedOtp: string | null;
            smsCount: string | null;
            hashUserId: string | null;
            bioId: string | null;
            bioLevel: string | null;
            dotpPin: string | null;
            pinUpdateDate: string;
            hashDeviceNo: string | null;
            hashCifId: string;
            finalHashbankUID: string | null;
        }>;
        deviceId: string;
        authDevice: string | null;
        isMBCust: string;
        promotionUserList: string | null;
        isAcceptDigitalOTP: string;
        sectorDetail: {
            "Priority Sector": string;
            "Private sector": string;
        };
        isOnlineSector: string;
        smsCount: string | null;
        corpBook: string;
        isNeedUpdateLimit: string | null;
        biomatricAuthDeviceList: Array<{
            deviceNo: string;
            custId: string;
            deviceType: string;
            isDefault: string;
            clazz: string;
            isReset: string | null;
            isMtAssigned: string | null;
            deviceId: string;
            token: string | null;
            status: string;
            retry: number;
            mobileDeviceId: string | null;
            phoneId: string | null;
            assignedDt: string | null;
            registeredDt: number;
            userId: string | null;
            activedOtp: string | null;
            smsCount: string | null;
            hashUserId: string;
            bioId: string;
            bioLevel: string;
            dotpPin: string | null;
            pinUpdateDate: string;
            hashDeviceNo: string | null;
            hashCifId: string;
            finalHashbankUID: string;
        }>;
        inactiveReason: string | null;
        defaultAccount: string | null;
        passportExpDate: string | null;
        requestId: string | null;
        rcfromState: string;
        kyc: string | null;
    };
    menuManager: Array<{
        code: string;
        version: string;
        isActive: string;
        maintenanceStartTime: string | null;
        maintenanceEndTime: string | null;
    }>;
    interfaceType: {
        code: string;
        name: string;
    };
    maskingPhone: string | null;
    listPhoneId: string | null;
    existPin: string | null;
    flagLoginSms: string | null;
    webSecurityToken: string | null;
}

/**
 * Main client class for MB Bank API integration.
 * Provides functionality for authentication, account balance queries, and transaction history.
 *
 * @example
 * ```typescript
 * // Initialize the MB client
 * const mb = new MB({
 *   username: '0123456789',   // Your MB Bank phone number
 *   password: 'your_password' // Your MB Bank password
 * });
 *
 * // Login and get account balance
 * async function checkBalance() {
 *   await mb.login();
 *   const balance = await mb.getBalance();
 *   console.log('Total balance:', balance.totalBalance);
 *   console.log('Accounts:', balance.balances);
 * }
 *
 * checkBalance().catch(console.error);
 * ```
 */
declare class MB {
    /**
     * MB Bank account username (usually phone number).
     * @readonly
     * @type {string}
     */
    readonly username: string;
    /**
     * MB Bank account password.
     * @readonly
     * @type {string}
     */
    readonly password: string;
    /**
     * Session identifier returned by MB Bank's API after successful authentication.
     * Used to validate subsequent requests.
     * @type {string|null|undefined}
     */
    sessionId: string | null | undefined;
    /**
     * Device identifier used for authentication with MB Bank API.
     * This is automatically generated for each session.
     * @type {string}
     */
    deviceId: string;
    /**
     * HTTP client for making requests to MB Bank's API.
     * @type {Client}
     */
    client: Client;
    /**
     * WASM binary data downloaded from MB Bank.
     * Used for request encryption.
     * @private
     * @type {Buffer}
     */
    private wasmData;
    /**
     * Custom OCR function for captcha recognition.
     * Allows implementing your own captcha recognition logic.
     *
     * @private
     * @type {Function|undefined}
     * @param {Buffer} image - The captcha image buffer to be recognized
     * @returns {Promise<string>} Recognized text from the captcha
     *
     * @example
     * ```typescript
     * const mb = new MB({
     *   username: '0123456789',
     *   password: 'your_password',
     *   preferredOCRMethod: 'custom',
     *   customOCRFunction: async (imageBuffer) => {
     *     // Your custom OCR logic here
     *     // For example, using a third-party OCR service:
     *     const result = await someOCRService.recognize(imageBuffer);
     *     return result.text;
     *   }
     * });
     * ```
     */
    private customOCRFunction?;
    /**
     * The OCR method to use for captcha recognition.
     * - "default": Uses the pre-trained OCR model (recommended)
     * - "tesseract": Uses Tesseract OCR engine
     * - "custom": Uses the custom OCR function provided
     *
     * @private
     * @type {"default"|"tesseract"|"custom"}
     * @default "default"
     */
    private preferredOCRMethod;
    /**
     * Whether to save the WASM file to disk.
     * Useful for debugging or caching purposes.
     *
     * @private
     * @type {boolean}
     * @default false
     */
    private saveWasm;
    /**
     * Creates a new MB client instance.
     *
     * @param {Object} data - Configuration options
     * @param {string} data.username - MB Bank login username (usually your registered phone number)
     * @param {string} data.password - MB Bank login password
     * @param {"default"|"tesseract"|"custom"} [data.preferredOCRMethod="default"] - OCR method for captcha recognition
     * @param {Function} [data.customOCRFunction] - Custom OCR function (required if preferredOCRMethod is "custom")
     * @param {boolean} [data.saveWasm=false] - Whether to save the WASM file to disk
     *
     * @throws {Error} If username or password is not provided
     *
     * @example
     * ```typescript
     * // Basic usage with default OCR
     * const mbClient = new MB({
     *   username: '0123456789',
     *   password: 'your_password'
     * });
     *
     * // Using Tesseract OCR
     * const mbWithTesseract = new MB({
     *   username: '0123456789',
     *   password: 'your_password',
     *   preferredOCRMethod: 'tesseract'
     * });
     *
     * // Using custom OCR function
     * const mbWithCustomOCR = new MB({
     *   username: '0123456789',
     *   password: 'your_password',
     *   preferredOCRMethod: 'custom',
     *   customOCRFunction: async (image) => {
     *     // Your custom captcha recognition logic
     *     return recognizedText;
     *   }
     * });
     * ```
     */
    constructor(data: {
        username: string;
        password: string;
        preferredOCRMethod?: "default" | "tesseract" | "custom";
        customOCRFunction?: (image: Buffer) => Promise<string>;
        saveWasm?: boolean;
    });
    /**
     * Processes captcha image according to the configured OCR method.
     *
     * @private
     * @param {Buffer} image - Captcha image buffer
     * @returns {Promise<string|null>} Recognized captcha text or null if recognition failed
     */
    private recognizeCaptcha;
    /**
     * Authenticates with MB Bank API by solving captcha and sending login credentials.
     * Sets the session ID upon successful login.
     *
     * @returns {Promise<LoginResponseData>} Login response from the API
     * @throws {Error} If login fails with specific error code and message
     *
     * @example
     * ```typescript
     * const mb = new MB({
     *   username: '0123456789',
     *   password: 'your_password'
     * });
     *
     * try {
     *   const loginResponse = await mb.login();
     *   console.log('Login successful!');
     *   console.log('Session ID:', mb.sessionId);
     * } catch (error) {
     *   console.error('Login failed:', error.message);
     * }
     * ```
     */
    login(): Promise<LoginResponseData>;
    /**
     * Generates a reference ID required by MB Bank API.
     * The format is "{username}-{timestamp}".
     *
     * @private
     * @returns {string} Reference ID for API requests
     */
    private getRefNo;
    /**
     * Makes an authenticated request to MB Bank API.
     * Handles session expiration by automatically re-logging in.
     *
     * @private
     * @param {Object} data - Request parameters
     * @param {string} data.path - API endpoint path
     * @param {Object} [data.json] - Request body data
     * @param {Object} [data.headers] - Additional request headers
     * @returns {Promise<any>} API response
     * @throws {Error} If the request fails with error code and message
     */
    private mbRequest;
    /**
     * Retrieves account balance information for all accounts.
     *
     * @returns {Promise<BalanceList|undefined>} Account balance data or undefined if request fails
     *
     * @example
     * ```typescript
     * const mb = new MB({
     *   username: '0123456789',
     *   password: 'your_password'
     * });
     *
     * async function getAccountInfo() {
     *   await mb.login();
     *   const balanceInfo = await mb.getBalance();
     *
     *   if (balanceInfo) {
     *     console.log(`Total balance: ${balanceInfo.totalBalance} ${balanceInfo.currencyEquivalent}`);
     *
     *     // Display each account's details
     *     balanceInfo.balances.forEach(account => {
     *       console.log(`Account: ${account.name} (${account.number})`);
     *       console.log(`Balance: ${account.balance} ${account.currency}`);
     *       console.log('---');
     *     });
     *   }
     * }
     *
     * getAccountInfo().catch(console.error);
     * ```
     */
    getBalance(): Promise<BalanceList | undefined>;
    /**
     * Retrieves transaction history for a specific account within a date range.
     *
     * @param {Object} data - Request parameters
     * @param {string} data.accountNumber - MB Bank account number to query
     * @param {string} data.fromDate - Start date in format "DD/MM/YYYY" or "D/M/YYYY"
     * @param {string} data.toDate - End date in format "DD/MM/YYYY" or "D/M/YYYY"
     * @returns {Promise<TransactionInfo[]|undefined>} Array of transaction details or undefined if request fails
     * @throws {Error} If date range exceeds 90 days or date format is invalid
     *
     * @example
     * ```typescript
     * const mb = new MB({
     *   username: '0123456789',
     *   password: 'your_password'
     * });
     *
     * async function getLastMonthTransactions() {
     *   await mb.login();
     *
     *   // Get account first
     *   const balanceInfo = await mb.getBalance();
     *   if (!balanceInfo?.balances?.length) {
     *     console.log('No accounts found');
     *     return;
     *   }
     *
     *   const accountNumber = balanceInfo.balances[0].number;
     *
     *   // Get transactions for the last 30 days
     *   const today = new Date();
     *   const lastMonth = new Date();
     *   lastMonth.setDate(today.getDate() - 30);
     *
     *   const fromDate = `${lastMonth.getDate()}/${lastMonth.getMonth() + 1}/${lastMonth.getFullYear()}`;
     *   const toDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
     *
     *   const transactions = await mb.getTransactionsHistory({
     *     accountNumber,
     *     fromDate,
     *     toDate
     *   });
     *
     *   if (transactions) {
     *     console.log(`Found ${transactions.length} transactions`);
     *
     *     transactions.forEach(tx => {
     *       const amount = tx.creditAmount || tx.debitAmount;
     *       const type = tx.creditAmount ? 'CREDIT' : 'DEBIT';
     *
     *       console.log(`${tx.transactionDate} | ${type} | ${amount} ${tx.transactionCurrency}`);
     *       console.log(`Description: ${tx.transactionDesc}`);
     *       if (tx.toAccountName) {
     *         console.log(`To: ${tx.toAccountName} (${tx.toAccountNumber}) at ${tx.toBank}`);
     *       }
     *       console.log('---');
     *     });
     *   }
     * }
     *
     * getLastMonthTransactions().catch(console.error);
     * ```
     */
    getTransactionsHistory(data: {
        accountNumber: string;
        fromDate: string;
        toDate: string;
    }): Promise<TransactionInfo[] | undefined>;
}

export { MB };
