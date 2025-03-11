# MBBank

EN: An unofficial fully promise-based API wrapper for Vietnam Military Commercial Joint Stock Bank (MBBank, MB). [Read full English version docs](./README.md)

VN: Promise-based API wrapper không chính thức dành cho Ngân hàng Quân Đội (MB)

**Lưu ý**: Việc sử dụng thư viện này có thể trái với quy định của MB và có thể dẫn tới việc bị vô hiệu hóa tài khoản hoặc tương tự. Chúng tôi không chịu trách nhiệm nếu việc trên xảy ra.

## Giới thiệu

Mục đích của thư viện này là để giúp bạn dễ tương tác hơn với API của MB và có thể tự tạo được một cổng thanh toán riêng cho bản thân.

## Yêu cầu

Nếu bạn chọn cách giải captcha là `tesseract`, hãy đảm bảo rằng Tesseract đã được cài đặt: [tesseract-ocr](https://github.com/tesseract-ocr/tesseract)

## Dành cho Python

Thư viện này được dựa trên dự án [MBBank](https://pypi.org/project/mbbank-lib/) của The DT.

## Bắt đầu

Khởi tạo đối tượng `MB`:

```ts
new MB({
  username: "YOUR-MB-USERNAME",
  password: "YOUR-MB-PASSWORD",

  // Với tùy chọn "preferredOCRMethod", vui lòng lưu ý rằng nếu bạn chọn lựa chọn "default" - lựa
  // chọn mặc định, thư viện sẽ cần phải tải model OCR từ Internet (GitHub) và có thể sẽ mất từ 5-
  // 15s để tải xuống, phụ thuộc vào đường truyền Internet của bạn. Nếu lựa chọn "tesseract" được
  // chọn, hãy đảm bảo rằng 'tesseract' đã được cài trên máy của bạn. Chi tiết vui lòng xem mục
  // "Yêu cầu". Lựa chọn "custom" cho phép bạn truyền một hàm tới đối tượng MB, và thư viện sẽ gọi
  // hàm được tuyền vào để giải captcha. Mặc định 'undefined', tương đương chế độ "default".
  preferredOCRMethod: "default" | "tesseract" | "custom" | undefined,

  // Nếu bạn muốn sử dụng hàm OCR tùy chỉnh, hãy cập nhật "preferredOCRMethod" thành "custom", nếu
  // không hàm sẽ không được gọi. Mặc định 'undefined'.
  customOCRFunction: (image: Buffer) => Promise<string>,

  // Tùy chọn này cho phép tập tin WebAssembly được tải xuống vào tập tin nội bộ của bạn để bỏ qua
  // việc tải đi tải lại mỗi khi thư viện được khởi chạy. Điều này cho phép thư viện chạy với tốc độ
  // nhanh hơn, tùy thuộc vào ổ cứng của bạn. Tuy nhiên, khi sử dụng lựa chọn này, bạn sẽ cần phải
  // xóa thủ công tập tin WebAssembly nếu MB cập nhật tập tin mới. Mặc định 'false'.
  saveWasm: true | false,
});
```

## Ví dụ

### Đăng nhập và lấy dữ liệu đăng nhập

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

### Lấy số dư tài khoản

```ts
(async () => {
  const { MB } = require("mbbank");

  const mb = new MB({
    username: "0123456789",
    password: "foobar",
    ...customSettings,
  });

  // Login bằng tay, có thể bỏ qua để thư viện login tự động.
  await mb.login();

  await mb.getBalance();
})();
```

### Lấy lịch sử giao dịch

```ts
(async () => {
  const { MB } = require("mbbank");

  const mb = new MB({
    username: "0123456789",
    password: "foobar",
    ...customSettings,
  });

  // Login bằng tay, có thể bỏ qua để thư viện login tự động.
  await mb.login();

  await mb.getTransactionsHistory({
    accountNumber: "1234567890",
    fromDate: "dd/mm/yyyy",
    toDate: "dd/mm/yyyy",
  });
})();
```

## Ghi công Model OCR

Mặc dù dataset là do tôi thu thập (và nó ở trên [Kaggle](https://www.kaggle.com/datasets/cookiegmvn/mbbank-captcha-images)), nhưng mô hình OCR thì được huấn luyện bởi [The DT](https://github.com/thedtvn). Mô hình và code để huấn luyện có sẵn tại [GitHub repository này](https://github.com/thedtvn/mbbank-capcha-ocr).

## Ủng hộ

Nếu thư viện này hữu ích với bạn, bạn có thể ủng hộ cho mình một cốc cà phê bằng STK 0974163549 - MB - TRAN DINH TUYEN hoặc MoMo: 0888929537

## Giấy phép

Giấy phép MIT
