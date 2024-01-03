# MBBank

EN: An unofficial fully promise-based API wrapper for Vietnam Military Commercial Joint Stock Bank (MBBank, MB).

VN: Promise-based API wrapper không chính thức dành cho Ngân hàng Quân Đội (MB). [Đọc phiên bản tiếng Việt](./README.VI.md)

**Warning**: For using this library, your MB account maybe suspended for malicious activities. We do not take any responsibility for your account.

## Introduction

This library is to help you to interact with MB's API in a easier way and you can create a payment gateway for yourself.

## Requirement

- [tesseract-ocr](https://github.com/tesseract-ocr/tesseract) installed

## For Python

This library is based/inspired from Python lib [MBBank](https://pypi.org/project/mbbank-lib/) by The DT.

Thư viện này một phần được dựa trên dự án [MBBank](https://pypi.org/project/mbbank-lib/) của The DT.

## Examples

### Get account balance

```ts
(async () => {
    const { MB } = require("mbbank");
    
    const mb = new MB({ username: "0123456789", password: "foobar" });

    await mb.getBalance();
})()
```

### Get transaction history

```ts
(async () => {
    const { MB } = require("mbbank");
    
    const mb = new MB({ username: "0123456789", password: "foobar" });

    await mb.getTransactionsHistory({ accountName: "1234567890", fromDate:"dd/mm/yyyy", toDate: "dd/mm/yyyy" });
})()
```

## Donations

If you think this is helpful for you, you can give me a cup of coffee via bank account: 0974163549 - MB - TRAN DINH TUYEN or MoMo wallet: 0888929537

## License

MIT License
