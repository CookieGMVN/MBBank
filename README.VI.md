# MBBank

EN: An unofficial fully promise-based API wrapper for Vietnam Military Commercial Joint Stock Bank (MBBank, MB). [Read full English version docs](./README.md)

VN: Promise-based API wrapper không chính thức dành cho Ngân hàng Quân Đội (MB)

**Lưu ý**: Việc sử dụng thư viện này có thể trái với quy định của MB và có thể dẫn tới việc bị vô hiệu hóa tài khoản hoặc tương tự. Chúng tôi không chịu trách nhiệm nếu việc trên xảy ra.

## Giới thiệu

Mục đích của thư viện này là để giúp bạn dễ tương tác hơn với API của MB và có thể tự tạo được một cổng thanh toán riêng cho bản thân.

## Yêu cầu

Thư viện này sử dụng Tesseract để giải captcha của MB. Hãy đảm bảo rằng Tesseract đã được cài đặt: [tesseract-ocr](https://github.com/tesseract-ocr/tesseract)

## Dành cho Python

Thư viện này một phần được dựa trên dự án [MBBank](https://pypi.org/project/mbbank-lib/) của The DT.

## Ví dụ

### Lấy số dư tài khoản

```ts
(async () => {
    const { MB } = require("mbbank");
    
    const mb = new MB({ username: "0123456789", password: "foobar" });

    await mb.getBalance();
})()
```

### Lấy lịch sử giao dịch

```ts
(async () => {
    const { MB } = require("mbbank");
    
    const mb = new MB({ username: "0123456789", password: "foobar" });

    await mb.getTransactionsHistory({ accountName: "1234567890", fromDate:"dd/mm/yyyy", toDate: "dd/mm/yyyy" });
})()
```

## Ủng hộ

Nếu thư viện này hữu ích với bạn, bạn có thể ủng hộ cho mình một cốc cà phê bằng STK 0974163549 - MB - TRAN DINH TUYEN hoặc MoMo: 0888929537

## Giấy phép

Giấy phép MIT
