import moment from "moment";
import { generate } from "randomstring";

/**
 * A function that encode the time to the right format.
 * @returns The time in right format.
 */
export function getTimeNow(): string {
    return moment().format("YYYYMMDDHHmmss" + moment().millisecond().toString().slice(0, -1));
}

/**
 * A function for generating the device ID.
 * @returns The device ID generated.
 */
export function generateDeviceId() {
    return generate({ length: 8, charset: "hex" }) + "-mbib-0000-0000-" + getTimeNow();
}

/**
 * A const for default request headers.
 */
export const defaultHeaders = {
    'Authorization': 'Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
    'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.4.10 (KHTML, like Gecko) Version/8.0.4 Safari/600.4.10",
    "Origin": "https://online.mbbank.com.vn",
    "Referer": "https://online.mbbank.com.vn/",
    "Content-Type": "application/json; charset=UTF-8",
    "Connection": "keep-alive",
    "Elastic-Apm-Traceparent": "00-a05b1d8ae659c91d9254ab749abd3e90-e25b5955e860a55e-01",
};

/**
 * Recommended Tesseract OCR config.
 */
export const defaultTesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 12,
};