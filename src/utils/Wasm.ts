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

import { existsSync, readFileSync, writeFileSync } from "fs";
import { request } from "undici";

import { defaultHeaders } from "./Global";

/**
 * Utility class for managing WebAssembly binary files
 */
export default class WasmUtils {
    /**
     * Downloads the WebAssembly binary from MB Bank's website
     *
     * @returns {Promise<Buffer>} A promise that resolves to the WebAssembly binary buffer
     *
     * @example
     * ```typescript
     * const wasmBinary = await WasmUtils.downloadWasm();
     * // Use the WebAssembly binary for encryption
     * ```
     */
    public static async downloadWasm(): Promise<Buffer> {
        const wasm = await request("https://online.mbbank.com.vn/assets/wasm/main.wasm", {
            headers: defaultHeaders,
        });

        return Buffer.from(await wasm.body.arrayBuffer());
    }

    /**
     * Loads WebAssembly binary, either by downloading it or retrieving from disk
     *
     * @param {string} [path] - Optional path to save/load the WebAssembly file
     * @returns {Promise<Buffer>} A promise that resolves to the WebAssembly binary buffer
     *
     * @example
     * ```typescript
     * // Download the WASM file each time
     * const wasmData = await WasmUtils.loadWasm();
     *
     * // Or save/load it from disk for caching
     * const wasmData = await WasmUtils.loadWasm('./cache/main.wasm');
     * ```
     */
    public static async loadWasm(path?: string): Promise<Buffer> {
        if (!path) {
            return this.downloadWasm();
        }

        if (!existsSync(path)) {
            const wasm = await this.downloadWasm();

            writeFileSync(path, (wasm as any), { encoding: "binary" });

            return wasm;
        }

        return Buffer.from(readFileSync(path, "binary"), "binary");
    }
}