/*
 * MIT License
 *
 * Copyright (c) 2025 CookieGMVN and contributors
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

import { recognize } from "node-tesseract-ocr";

import { cutBorder, defaultTesseractConfig, replaceColor } from "./Global";

/**
 * Utility class for working with Tesseract OCR for captcha recognition
 */
export default class TesseractUtils {
    /**
     * Cleans a captcha image to improve OCR recognition accuracy
     *
     * @param {Buffer} image - The raw captcha image buffer
     * @returns {Promise<Buffer>} A promise that resolves to the cleaned image buffer
     *
     * @example
     * ```typescript
     * // Clean captcha image for better OCR recognition
     * const rawImage = fs.readFileSync('./captcha.png');
     * const cleanedImage = await TesseractUtils.cleanImage(rawImage);
     * ```
     */
    public static async cleanImage(image: Buffer): Promise<Buffer> {
        // Phase 1 - Replace #857069 with #ffffff
        image = await replaceColor({
            image,
            target: "#857069",
            replace: "#ffffff",
        });

        // Phase 2 - Replase #ffe4d6 with #ffffff
        image = await replaceColor({
            image,
            target: "#ffe4d6",
            replace: "#ffffff",
        });

        // Phase 3 - Cut border by 1px
        image = await cutBorder({
            image,
            borderWidth: 1,
        });

        return image;
    }

    /**
     * Recognizes text from a captcha image using Tesseract OCR
     *
     * @param {Buffer} image - The captcha image buffer to process
     * @returns {Promise<string|null>} A promise that resolves to the recognized text, or null if recognition failed
     *
     * @example
     * ```typescript
     * // Recognize text from a captcha image
     * const captchaImage = fs.readFileSync('./captcha.png');
     * const recognizedText = await TesseractUtils.recognizeText(captchaImage);
     *
     * if (recognizedText) {
     *   console.log('Captcha text:', recognizedText);
     * } else {
     *   console.log('Failed to recognize captcha');
     * }
     * ```
     */
    public static async recognizeText(image: Buffer): Promise<string | null> {
        // Clean the image before processing
        image = await this.cleanImage(image);

        // Recognize text from the image
        const captchaContent = await recognize(image, defaultTesseractConfig);

        captchaContent.replaceAll("\n", "");
        captchaContent.replaceAll(" ", "");
        captchaContent.slice(0, -1);

        if ((captchaContent.length !== 6) || !(/^[a-z0-9]+$/i.test(captchaContent))) {
            return null;
        }

        return captchaContent;
    }
}