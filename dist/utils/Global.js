"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTesseractConfig = exports.defaultHeaders = exports.generateDeviceId = exports.getTimeNow = void 0;
const moment_1 = __importDefault(require("moment"));
function getTimeNow() {
    return (0, moment_1.default)().format("YYYYMMDDHHmmss" + (0, moment_1.default)().millisecond().toString().slice(0, -1));
}
exports.getTimeNow = getTimeNow;
function generateDeviceId() {
    return "s1rmi184-mbib-0000-0000-" + getTimeNow();
}
exports.generateDeviceId = generateDeviceId;
exports.defaultHeaders = {
    'Cache-Control': 'no-cache',
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Origin": "https://online.mbbank.com.vn",
    "Referer": "https://online.mbbank.com.vn/",
    "Content-Type": "application/json; charset=UTF-8",
};
exports.defaultTesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 12,
};
