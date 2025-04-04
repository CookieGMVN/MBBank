/*
 * MIT License
 *
 * Copyright (c) 2024 CookieGMVN and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Jimp from "jimp";
import moment from "moment";

/**
 * Gets the current time in a specific format
 * @returns {string} The current time in format YYYYMMDDHHmmss + milliseconds (truncated)
 */
export function getTimeNow(): string {
    return moment().format("YYYYMMDDHHmmss" + moment().millisecond().toString().slice(0, -1));
}

/**
 * Generates a device ID for authentication purposes
 * @returns {string} A device ID string in the format "s1rmi184-mbib-0000-0000-" + timestamp
 */
export function generateDeviceId() {
    return "s1rmi184-mbib-0000-0000-" + getTimeNow();
}

/**
 * Default headers for API requests
 * @type {Object}
 */
export const defaultHeaders = {
    'Cache-Control': 'max-age=0',
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Origin": "https://online.mbbank.com.vn",
    "Referer": "https://online.mbbank.com.vn/pl/login?returnUrl=%2F",
    "Content-Type": "application/json; charset=UTF-8",
    app: "MB_WEB",
    "elastic-apm-traceparent": "00-55b950e3fcabc785fa6db4d7deb5ef73-8dbd60b04eda2f34-01",
    "Sec-Ch-Ua": '"Not.A/Brand";v="8", "Chromium";v="134", "Google Chrome";v="134"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
};

/**
 * Default configuration for Tesseract OCR
 * @type {Object}
 */
export const defaultTesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 12,
};

/**
 * Fingerprint value for authentication
 * @type {string}
 */
export const FPR = "c7a1beebb9400375bb187daa33de9659";

/**
 * Replaces a target color in an image with a different color
 * @param {Object} options - The options object
 * @param {Buffer} options.image - The image buffer to process
 * @param {string} options.target - The target color in hex format (with or without # prefix)
 * @param {string} options.replace - The replacement color in hex format (with or without # prefix)
 * @param {number} [options.tolerance=0] - The color matching tolerance (0-100)
 * @returns {Promise<Buffer>} A Promise that resolves to the modified image buffer
 * @throws {Error} If image processing fails
 */
export async function replaceColor({
    image,
    target,
    replace,
    tolerance = 0,
}: {
    image: Buffer,
    target: string,
    replace: string,
    tolerance?: number
}): Promise<Buffer> {
    try {
        // Load the image from buffer
        const jimpImage = await Jimp.read(image);

        // Parse hex colors to RGBA values
        // Handle hex colors with or without # prefix
        const targetHex = target.startsWith('#') ? target.substring(1) : target;
        const replaceHex = replace.startsWith('#') ? replace.substring(1) : replace;

        // Convert hex to RGB integers
        const targetR = parseInt(targetHex.substring(0, 2), 16);
        const targetG = parseInt(targetHex.substring(2, 4), 16);
        const targetB = parseInt(targetHex.substring(4, 6), 16);

        const replaceR = parseInt(replaceHex.substring(0, 2), 16);
        const replaceG = parseInt(replaceHex.substring(2, 4), 16);
        const replaceB = parseInt(replaceHex.substring(4, 6), 16);

        // Calculate tolerance threshold (normalize to 0-255 scale for each channel)
        const maxDiff = 255 * Math.min(tolerance / 100, 1);

        // Process each pixel
        jimpImage.scan(0, 0, jimpImage.getWidth(), jimpImage.getHeight(), function(x, y, idx) {
            // Get current pixel RGB values
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            // Alpha is at idx + 3

            // Calculate color difference using Euclidean distance
            const colorDiff = Math.sqrt(
                Math.pow(r - targetR, 2) +
                Math.pow(g - targetG, 2) +
                Math.pow(b - targetB, 2),
            );

            // Replace the color if within tolerance
            if (colorDiff <= maxDiff) {
                this.bitmap.data[idx + 0] = replaceR;
                this.bitmap.data[idx + 1] = replaceG;
                this.bitmap.data[idx + 2] = replaceB;
                // Alpha channel is preserved
            }
        });

        // Return the modified image as a buffer
        return await jimpImage.getBufferAsync(Jimp.MIME_PNG);
    } catch (error) {
        console.error('Error in replaceColor:', error);
        throw new Error(`Failed to process image: ${(error as Error).message}`);
    }
}

/**
 * Cuts a border of specified width from all sides of an image
 * @param {Object} options - The options object
 * @param {Buffer} options.image - The image buffer to process
 * @param {number} [options.borderWidth=5] - The width of the border to remove in pixels
 * @returns {Promise<Buffer>} A Promise that resolves to the modified image buffer
 * @throws {Error} If the image is too small or processing fails
 */
export async function cutBorder({
    image,
    borderWidth = 5,
}: {
    image: Buffer,
    borderWidth?: number
}): Promise<Buffer> {
    try {
        // Load the image from buffer
        const jimpImage = await Jimp.read(image);

        // Get the original dimensions
        const originalWidth = jimpImage.getWidth();
        const originalHeight = jimpImage.getHeight();

        // Check if image is large enough to cut the border
        if (originalWidth <= 2 * borderWidth || originalHeight <= 2 * borderWidth) {
            throw new Error('Image is too small to cut the specified border width');
        }

        // Calculate new dimensions
        const newWidth = originalWidth - (2 * borderWidth);
        const newHeight = originalHeight - (2 * borderWidth);

        // Crop the image (removing the border from all sides)
        const croppedImage = jimpImage.crop(
            borderWidth,
            borderWidth,
            newWidth,
            newHeight,
        );

        // Return the modified image as a buffer
        return await croppedImage.getBufferAsync(Jimp.MIME_PNG);
    } catch (error) {
        console.error('Error in cutBorder:', error);
        throw new Error(`Failed to process image: ${(error as Error).message}`);
    }
}