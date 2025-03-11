import { request } from "undici";
import { existsSync, writeFileSync, readFileSync } from "fs";

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
        const wasm = await request("https://online.mbbank.com.vn/assets/wasm/main.wasm");

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