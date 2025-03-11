# MBBank

EN: An unofficial fully promise-based API wrapper for Vietnam Military Commercial Joint Stock Bank (MBBank, MB).

VN: Promise-based API wrapper không chính thức dành cho Ngân hàng Quân Đội (MB). [Đọc phiên bản tiếng Việt](./README.VI.md)

**Warning**: For using this library, your MB account maybe suspended for malicious activities. We do not take any responsibility for your account.

## Introduction

This library is to help you to interact with MB's API in a easier way and you can create a payment gateway for yourself.

## Requirements

- [tesseract-ocr](https://github.com/tesseract-ocr/tesseract) installed (if you want to use `tesseract` solving option)

## For Python

This library is based/inspired from Python lib [MBBank](https://pypi.org/project/mbbank-lib/) by [The DT](https://github.com/thedtvn).

## Getting Started

Initialize a MB client:

```ts
new MB({
  username: "YOUR-MB-USERNAME",
  password: "YOUR-MB-PASSWORD",
  
  // In "preferredOCRMethod", please note that if you use "default", the library will need to
  // download the model from Internet (GitHub) and it will take about 5-10s, depends on your internet
  // If the mode "tesseract" is selected, please make sure that 'tesseract' - an open source OCR
  // sofware, is installed on your device. Please read 'Requirement' section. "custom" option
  // allows you to pass a function to the client, and the client will get the captcha content
  // through this function. Default 'undefined' for "default".
  preferredOCRMethod: "default" | "tesseract" | "custom" | undefined,
  
  // If you want to use "customOCRFunction", please update the "preferredOCRMethod" to "custom",
  // otherwise it won't run. Default 'undefined'.
  customOCRFunction: (image: Buffer) => Promise<string>,

  // Allows the WASM file will be downloaded to your local filesystem to skip the downloading
  // process everytime the library run, which will speed up your login process, depends on your
  // disk's speed. Please note that you will need to manually delete the file if it gets outdated
  // to the MBBank's server. Default 'false'.
  saveWasm: true | false,
});
```

## Examples

### Login and get account login data
```ts
(async () => {
  const { MB } = require("mbbank");

  const mb = new MB({
    username: "0123456789",
    password: "foobar",
    ...customSettings,
  });

  await mb.login();
})();
```

### Get account balance

```ts
(async () => {
  const { MB } = require("mbbank");

  const mb = new MB({
    username: "0123456789",
    password: "foobar",
    ...customSettings,
  });

  // Manual login, skip if you want the library to login automatically.
  await mb.login();

  await mb.getBalance();
})();
```

### Get transaction history

```ts
(async () => {
  const { MB } = require("mbbank");

  const mb = new MB({
    username: "0123456789",
    password: "foobar",
    ...customSettings,
  });

  // Manual login, skip if you want the library to login automatically.
  await mb.login();

  await mb.getTransactionsHistory({
    accountNumber: "1234567890",
    fromDate: "dd/mm/yyyy",
    toDate: "dd/mm/yyyy",
  });
})();
```

## OCR Model credit

The dataset is collected by me (and it's open on [Kaggle](https://www.kaggle.com/datasets/cookiegmvn/mbbank-captcha-images)), but the OCR model is trained by [The DT](https://github.com/thedtvn). Full model and the training code can be found at [his GitHub repository](https://github.com/thedtvn/mbbank-capcha-ocr)

## Donations

If you think this is helpful for you, you can give me a cup of coffee via bank account: 0974163549 - MB - TRAN DINH TUYEN or MoMo wallet: 0888929537

## License

MIT License
