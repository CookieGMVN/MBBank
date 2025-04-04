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

import { createWriteStream, existsSync } from 'fs';
import * as ort from 'onnxruntime-node';
import * as path from 'path';
import sharp from 'sharp';
import { request } from 'undici';

const dirPath = path.dirname(require.main ? require.main.filename : __filename);

/**
 * OCR model for recognizing characters in images
 * @class
 */
export default class OCRModel {
    /**
     * Character set for recognition
     * @private
     * @type {string[]}
     */
    private chars: string[];

    /**
     * Path to the ONNX model file
     * @private
     * @type {string}
     */
    private modelPath: string;

    /**
     * ONNX inference session
     * @private
     * @type {ort.InferenceSession}
     */
    private session!: ort.InferenceSession;

    /**
     * Creates a new OCR model
     * @param {string|null} modelPath - Optional custom path to the ONNX model file
     */
    public constructor(modelPath: string | null = null) {
        // Create and sort the characters array (digits + letters)
        this.chars = [];
        // Add digits (0-9)
        for (let i = 0; i < 10; i++) {
            this.chars.push(String(i));
        }
        // Add lowercase and uppercase letters (a-z, A-Z)
        for (let i = 97; i <= 122; i++) {
            this.chars.push(String.fromCharCode(i));
        }
        for (let i = 65; i <= 90; i++) {
            this.chars.push(String.fromCharCode(i));
        }
        this.chars.sort();

        // Set the model path
        this.modelPath = modelPath || path.join(dirPath, '/../model.onnx');
    }

    /**
     * Loads the ONNX model for inference
     * @returns {Promise<void>} A promise that resolves when the model is loaded
     */
    public async loadModel(): Promise<void> {
        if (!existsSync(this.modelPath)) await this.downloadOnnxModel();
        this.session = await ort.InferenceSession.create(this.modelPath);
    }

    /**
     * Predicts text from an image
     * @param {Buffer} imageBuffer - The image buffer to process
     * @returns {Promise<string>} A promise that resolves to the recognized text
     */
    public async predict(imageBuffer: Buffer): Promise<string> {
        // Convert image to grayscale and resize
        const processedImage = await sharp(imageBuffer)
            .grayscale()
            .resize(160, 50)
            .raw()
            .toBuffer();

        // Convert to float32 array and normalize to 0-1
        const imageArray = new Float32Array(processedImage.length);
        for (let i = 0; i < processedImage.length; i++) {
            imageArray[i] = processedImage[i] / 255.0;
        }

        // Reshape to match the expected input shape [1, 1, 50, 160]
        const tensor = new ort.Tensor('float32', imageArray, [1, 1, 50, 160]);

        // Get input name
        const inputName = this.session.inputNames[0];
        const feeds: Record<string, ort.Tensor> = {};
        feeds[inputName] = tensor;

        // Run inference
        const results = await this.session.run(feeds);
        const outputData = Object.values(results)[0].data as Float32Array;
        const outputShape = Object.values(results)[0].dims as number[];

        // Process predictions
        const pred = this.reshapeTensor(outputData, outputShape);
        const predLabels = this.argmax(pred, 2);

        // Convert label indices to characters
        let predText = '';
        for (const label of predLabels[0]) {
            if (label >= 0 && label < this.chars.length) {
                predText += this.chars[label];
            }
        }

        return predText;
    }

    /**
     * Downloads the ONNX model from GitHub
     * @private
     * @returns {Promise<void>} A promise that resolves when the model is downloaded
     * @throws {Error} If the download fails
     */
    private async downloadOnnxModel(): Promise<void> {
        try {
            // Make the HTTP request
            const model = await request("https://github.com/thedtvn/mbbank-capcha-ocr/raw/refs/heads/master/mb_capcha_ocr/model.onnx", {
                maxRedirections: 10,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });

            // Create a write stream
            const fileStream = createWriteStream(this.modelPath);

            // Pipe the response body to the file
            await new Promise<void>((resolve, reject) => {
                model.body.pipe(fileStream);

                model.body.on('error', (err) => {
                    reject(err);
                });

                fileStream.on('finish', () => {
                    resolve();
                });

                fileStream.on('error', (err: Error) => {
                    reject(err);
                });
            });
        } catch (error) {
            console.error('Error downloading model:', error);
            throw error;
        }
    }

    /**
     * Reshapes a flat tensor into a 3D array
     * @private
     * @param {Float32Array} data - The flat tensor data
     * @param {number[]} shape - The target shape [batchSize, seqLength, numClasses]
     * @returns {number[][][]} Reshaped 3D array
     */
    private reshapeTensor(data: Float32Array, shape: number[]): number[][][] {
        const result: number[][][] = [];
        const [batchSize, seqLength, numClasses] = shape;

        for (let b = 0; b < batchSize; b++) {
            const batchResult: number[][] = [];
            for (let s = 0; s < seqLength; s++) {
                const classProbs: number[] = [];
                for (let c = 0; c < numClasses; c++) {
                    const idx = b * seqLength * numClasses + s * numClasses + c;
                    classProbs.push(data[idx]);
                }
                batchResult.push(classProbs);
            }
            result.push(batchResult);
        }

        return result;
    }

    /**
     * Computes argmax along a specified axis
     * @private
     * @param {number[][][]} tensor - The input tensor
     * @param {number} axis - The axis along which to compute argmax (only 2 is supported)
     * @returns {number[][]} The indices of maximum values
     */
    private argmax(tensor: number[][][], axis: number): number[][] {
        const result: number[][] = [];

        if (axis === 2) {
            for (let b = 0; b < tensor.length; b++) {
                const batchResult: number[] = [];
                for (let s = 0; s < tensor[b].length; s++) {
                    let maxIdx = 0;
                    let maxVal = tensor[b][s][0];

                    for (let c = 1; c < tensor[b][s].length; c++) {
                        if (tensor[b][s][c] > maxVal) {
                            maxVal = tensor[b][s][c];
                            maxIdx = c;
                        }
                    }

                    batchResult.push(maxIdx);
                }
                result.push(batchResult);
            }
        }

        return result;
    }
}