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

/* eslint-disable */
// @ts-nocheck

const window = {
    globalThis,
    document: {
        welovemb: true
    }
};

globalThis.window = window;
globalThis.location = new URL("https://online.mbbank.com.vn/pl/login");

const processAsync = (param1, param2, generatorFunction) =>
    new Promise((resolve, reject) => {
        var handleResult = (result) => {
            try {
                processStep(generatorFunction.next(result));
            } catch (error) {
                reject(error);
            }
        },
            handleError = (error) => {
                try {
                    processStep(generatorFunction.throw(error));
                } catch (err) {
                    reject(err);
                }
            },
            processStep = (step) =>
                step.done
                    ? resolve(step.value)
                    : Promise.resolve(step.value).then(handleResult, handleError);
        processStep(
            (generatorFunction = generatorFunction.apply(param1, param2)).next(),
        );
    });

(() => {
    const ErrENOSYS = () => {
        const err = new Error("not implemented");
        err.code = "ENOSYS";
        return err;
    };
    if (!globalThis.fs) {
        let data = "";
        globalThis.fs = {
            constants: {
                O_WRONLY: -1,
                O_RDWR: -1,
                O_CREAT: -1,
                O_TRUNC: -1,
                O_APPEND: -1,
                O_EXCL: -1,
            },
            writeSync(fd, buffer) {
                data += TextDecoderUnicode.decode(buffer);
                const indexEOL = data.lastIndexOf("\n");
                if (indexEOL != -1) {
                    console.log(data.substring(0x0, indexEOL));
                    data = data.substring(indexEOL + 0x1);
                }
                return buffer.length;
            },
            write(fd, buffer, offset, length, position, callback) {
                if (offset === 0 && length === buffer.length && position === null) {
                    callback(null, this.writeSync(fd, buffer));
                } else {
                    callback(ErrENOSYS());
                }
            },
            fsync(fd, callback) {
                callback(null);
            },
        };
    }
    if (!globalThis.process) {
        globalThis.process = {
            getuid: () => -1,
            getgid: () => -1,
            geteuid: () => -1,
            getegid: () => -1,
            pid: -1,
            ppid: -1,
        };
    }
    if (!globalThis.crypto) {
        throw new Error(
            "globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)",
        );
    }
    if (!globalThis.performance) {
        throw new Error(
            "globalThis.performance is not available, polyfill required (performance.now only)",
        );
    }
    if (!globalThis.TextEncoder) {
        throw new Error(
            "globalThis.TextEncoder is not available, polyfill required",
        );
    }
    if (!globalThis.TextDecoder) {
        throw new Error(
            "globalThis.TextDecoder is not available, polyfill required",
        );
    }

    const TextEncoderUnicode = new TextEncoder("utf-8");
    const TextDecoderUnicode = new TextDecoder("utf-8");

    globalThis.Go = class {
        constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (exitCode) => {
                if (exitCode !== 0) {
                    console.warn("exit code:", exitCode);
                }
            };
            this._exitPromise = new Promise((resolve) => {
                this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = new Map();
            this._nextCallbackTimeoutID = 1;

            const setMemoryValue = (address, value) => {
                this.mem.setUint32(address + 0x0, value, true);
                this.mem.setUint32(
                    address + 0x4,
                    Math.floor(value / 0x100000000),
                    true,
                );
            };

            const getValueFromMemory = (address) => {
                const floatValue = this.mem.getFloat64(address, true);
                if (floatValue === 0) {
                    return;
                }
                if (!isNaN(floatValue)) {
                    return floatValue;
                }
                const intValue = this.mem.getUint32(address, true);
                return this._values[intValue];
            };

            const setValueInMemory = (address, value) => {
                if (typeof value === "number" && value !== 0) {
                    if (isNaN(value)) {
                        this.mem.setUint32(address + 0x4, 0x7ff80000, true);
                        this.mem.setUint32(address, 0x0, true);
                    } else {
                        this.mem.setFloat64(address, value, true);
                    }
                    return;
                }

                if (value === undefined) {
                    this.mem.setFloat64(address, 0x0, true);
                    return;
                }

                let id = this._ids.get(value);
                if (id === undefined) {
                    id = this._idPool.pop();
                    if (id === undefined) {
                        id = this._values.length;
                    }
                    this._values[id] = value;
                    this._goRefCounts[id] = 0;
                    this._ids.set(value, id);
                }
                this._goRefCounts[id]++;

                let typeFlag = 0;
                switch (typeof value) {
                    case "object":
                        if (value !== null) {
                            typeFlag = 1;
                        }
                        break;
                    case "string":
                        typeFlag = 2;
                        break;
                    case "symbol":
                        typeFlag = 3;
                        break;
                    case "function":
                        typeFlag = 4;
                }

                this.mem.setUint32(address + 0x4, 0x7ff80000 | typeFlag, true);
                this.mem.setUint32(address, id, true);
            };

            const getByteArrayFromMemory = (address) => {
                const startAddress =
                    this.mem.getUint32(address + 0x0, true) +
                    0x100000000 * this.mem.getInt32(address + 0x4, true);

                const length =
                    this.mem.getUint32(address + 0x8, true) +
                    0x100000000 * this.mem.getInt32(address + 0xc, true);

                return new Uint8Array(
                    this._inst.exports.mem.buffer,
                    startAddress,
                    length,
                );
            };

            const getArrayFromMemory = (address) => {
                const startAddress =
                    this.mem.getUint32(address + 0x0, true) +
                    0x100000000 * this.mem.getInt32(address + 0x4, true);

                const length =
                    this.mem.getUint32(address + 0x8, true) +
                    0x100000000 * this.mem.getInt32(address + 0xc, true);

                const array = new Array(length);
                for (let i = 0; i < length; i++) {
                    array[i] = getValueFromMemory(startAddress + 0x8 * i);
                }

                return array;
            };

            const getStringFromMemory = (address) => {
                const startAddress =
                    this.mem.getUint32(address + 0x0, true) +
                    0x100000000 * this.mem.getInt32(address + 0x4, true);

                const length =
                    this.mem.getUint32(address + 0x8, true) +
                    0x100000000 * this.mem.getInt32(address + 0xc, true);

                return TextDecoderUnicode.decode(
                    new DataView(this._inst.exports.mem.buffer, startAddress, length),
                );
            };

            const timeDifference = Date.now() - performance.now();

            this.importObject = {
                _gotest: {
                    add: (a, b) => a + b,
                },
                gojs: {
                    "runtime.wasmExit": (input) => {
                        const exitCode = this.mem.getInt32(0x8 + (input >>>= 0x0), true);
                        this.exited = true;
                        delete this._inst;
                        delete this._values;
                        delete this._goRefCounts;
                        delete this._ids;
                        delete this._idPool;
                        this.exit(exitCode);
                    },
                    "runtime.wasmWrite": (address) => {
                        const fileDescriptor =
                            this.mem.getUint32(0x8 + (address >>>= 0x0) + 0x0, true) +
                            0x100000000 *
                            this.mem.getInt32(0x8 + (address >>>= 0x0) + 0x4, true);

                        const dataAddress =
                            this.mem.getUint32(address + 0x10 + 0x0, true) +
                            0x100000000 * this.mem.getInt32(address + 0x10 + 0x4, true);

                        const dataLength = this.mem.getInt32(address + 0x18, true);

                        fs.writeSync(
                            fileDescriptor,
                            new Uint8Array(
                                this._inst.exports.mem.buffer,
                                dataAddress,
                                dataLength,
                            ),
                        );
                    },
                    "runtime.resetMemoryDataView": (_0x1fc0dd) => {
                        this.mem = new DataView(this._inst.exports.mem.buffer);
                    },
                    "runtime.nanotime1": (_0x5843c4) => {
                        setMemoryValue(
                            0x8 + (_0x5843c4 >>>= 0x0),
                            0xf4240 * (timeDifference + performance.now()),
                        );
                    },
                    "runtime.walltime": (_0x431dd5) => {
                        _0x431dd5 >>>= 0x0;
                        const _0x2d1628 = new Date().getTime();
                        setMemoryValue(_0x431dd5 + 0x8, _0x2d1628 / 0x3e8);
                        this.mem.setInt32(
                            _0x431dd5 + 0x10,
                            (_0x2d1628 % 0x3e8) * 0xf4240,
                            true,
                        );
                    },
                    "runtime.scheduleTimeoutEvent": (_0x40be90) => {
                        _0x40be90 >>>= 0x0;
                        const _0x4d23db = this._nextCallbackTimeoutID;
                        this._nextCallbackTimeoutID++;
                        this._scheduledTimeouts.set(
                            _0x4d23db,
                            setTimeout(() => {
                                for (this._resume(); this._scheduledTimeouts.has(_0x4d23db);) {
                                    console.warn("scheduleTimeoutEvent: missed timeout event");
                                    this._resume();
                                }
                            }, this.mem.getUint32(_0x40be90 + 0x8 + 0x0, true) + 0x100000000 * this.mem.getInt32(_0x40be90 + 0x8 + 0x4, true)),
                        );
                        this.mem.setInt32(_0x40be90 + 0x10, _0x4d23db, true);
                    },
                    "runtime.clearTimeoutEvent": (_0x4d392b) => {
                        const _0x157834 = this.mem.getInt32(
                            0x8 + (_0x4d392b >>>= 0x0),
                            true,
                        );
                        clearTimeout(this._scheduledTimeouts.get(_0x157834));
                        this._scheduledTimeouts["delete"](_0x157834);
                    },
                    "runtime.getRandomData": (_0xfc09b6) => {
                        crypto.getRandomValues(
                            getByteArrayFromMemory(0x8 + (_0xfc09b6 >>>= 0x0)),
                        );
                    },
                    "syscall/js.finalizeRef": (_0x5edca4) => {
                        const _0x57d4fc = this.mem.getUint32(
                            0x8 + (_0x5edca4 >>>= 0x0),
                            true,
                        );
                        this._goRefCounts[_0x57d4fc]--;
                        if (this._goRefCounts[_0x57d4fc] === 0x0) {
                            const _0x372c88 = this._values[_0x57d4fc];
                            this._values[_0x57d4fc] = null;
                            this._ids["delete"](_0x372c88);
                            this._idPool.push(_0x57d4fc);
                        }
                    },
                    "syscall/js.stringVal": (_0x11c7ea) => {
                        setValueInMemory(
                            0x18 + (_0x11c7ea >>>= 0x0),
                            getStringFromMemory(_0x11c7ea + 0x8),
                        );
                    },
                    "syscall/js.valueGet": (_0x3c119c) => {
                        _0x3c119c >>>= 0x0;
                        const _0x57d3f0 = Reflect.get(
                            getValueFromMemory(_0x3c119c + 0x8),
                            getStringFromMemory(_0x3c119c + 0x10),
                        );
                        _0x3c119c = this._inst.exports.getsp() >>> 0x0;
                        setValueInMemory(_0x3c119c + 0x20, _0x57d3f0);
                    },
                    "syscall/js.valueSet": (_0x2df90d) => {
                        _0x2df90d >>>= 0x0;
                        Reflect.set(
                            getValueFromMemory(_0x2df90d + 0x8),
                            getStringFromMemory(_0x2df90d + 0x10),
                            getValueFromMemory(_0x2df90d + 0x20),
                        );
                    },
                    "syscall/js.valueDelete": (_0x5c6169) => {
                        _0x5c6169 >>>= 0x0;
                        Reflect.deleteProperty(
                            getValueFromMemory(_0x5c6169 + 0x8),
                            getStringFromMemory(_0x5c6169 + 0x10),
                        );
                    },
                    "syscall/js.valueIndex": (_0xd5cf7e) => {
                        setValueInMemory(
                            0x18 + (_0xd5cf7e >>>= 0x0),
                            Reflect.get(
                                getValueFromMemory(_0xd5cf7e + 0x8),
                                this.mem.getUint32(_0xd5cf7e + 0x10 + 0x0, true) +
                                0x100000000 * this.mem.getInt32(_0xd5cf7e + 0x10 + 0x4, true),
                            ),
                        );
                    },
                    "syscall/js.valueSetIndex": (_0x1b938f) => {
                        _0x1b938f >>>= 0x0;
                        Reflect.set(
                            getValueFromMemory(_0x1b938f + 0x8),
                            this.mem.getUint32(_0x1b938f + 0x10 + 0x0, true) +
                            0x100000000 * this.mem.getInt32(_0x1b938f + 0x10 + 0x4, true),
                            getValueFromMemory(_0x1b938f + 0x18),
                        );
                    },
                    "syscall/js.valueCall": (_0x38baf6) => {
                        _0x38baf6 >>>= 0x0;
                        try {
                            const _0xb55714 = getValueFromMemory(_0x38baf6 + 0x8);
                            const _0x4b45ac = Reflect.get(
                                _0xb55714,
                                getStringFromMemory(_0x38baf6 + 0x10),
                            );
                            const _0x929c90 = getArrayFromMemory(_0x38baf6 + 0x20);
                            const _0x331ca0 = Reflect.apply(_0x4b45ac, _0xb55714, _0x929c90);
                            _0x38baf6 = this._inst.exports.getsp() >>> 0x0;
                            setValueInMemory(_0x38baf6 + 0x38, _0x331ca0);
                            this.mem.setUint8(_0x38baf6 + 0x40, 0x1);
                        } catch (_0x3b2cd8) {
                            _0x38baf6 = this._inst.exports.getsp() >>> 0x0;
                            setValueInMemory(_0x38baf6 + 0x38, _0x3b2cd8);
                            this.mem.setUint8(_0x38baf6 + 0x40, 0x0);
                        }
                    },
                    "syscall/js.valueInvoke": (_0x19f35b) => {
                        _0x19f35b >>>= 0x0;
                        try {
                            const _0xdd2a3 = getValueFromMemory(_0x19f35b + 0x8);
                            const _0x330c8f = getArrayFromMemory(_0x19f35b + 0x10);
                            const _0x49e23c = Reflect.apply(_0xdd2a3, undefined, _0x330c8f);
                            _0x19f35b = this._inst.exports.getsp() >>> 0x0;
                            setValueInMemory(_0x19f35b + 0x28, _0x49e23c);
                            this.mem.setUint8(_0x19f35b + 0x30, 0x1);
                        } catch (_0x5bd1fc) {
                            _0x19f35b = this._inst.exports.getsp() >>> 0x0;
                            setValueInMemory(_0x19f35b + 0x28, _0x5bd1fc);
                            this.mem.setUint8(_0x19f35b + 0x30, 0x0);
                        }
                    },
                    "syscall/js.valueNew": (_0x275c5e) => {
                        _0x275c5e >>>= 0x0;
                        try {
                            const _0x2a547b = getValueFromMemory(_0x275c5e + 0x8);
                            const _0x3fcde3 = getArrayFromMemory(_0x275c5e + 0x10);
                            const _0x94eb67 = Reflect.construct(_0x2a547b, _0x3fcde3);
                            _0x275c5e = this._inst.exports.getsp() >>> 0x0;
                            setValueInMemory(_0x275c5e + 0x28, _0x94eb67);
                            this.mem.setUint8(_0x275c5e + 0x30, 0x1);
                        } catch (_0x5b3614) {
                            _0x275c5e = this._inst.exports.getsp() >>> 0x0;
                            setValueInMemory(_0x275c5e + 0x28, _0x5b3614);
                            this.mem.setUint8(_0x275c5e + 0x30, 0x0);
                        }
                    },
                    "syscall/js.valueLength": (_0x2cc204) => {
                        setMemoryValue(
                            0x10 + (_0x2cc204 >>>= 0x0),
                            parseInt(getValueFromMemory(_0x2cc204 + 0x8).length),
                        );
                    },
                    "syscall/js.valuePrepareString": (_0x57c513) => {
                        _0x57c513 >>>= 0x0;
                        const _0xe5ad3d = TextEncoderUnicode.encode(
                            String(getValueFromMemory(_0x57c513 + 0x8)),
                        );
                        setValueInMemory(_0x57c513 + 0x10, _0xe5ad3d);
                        setMemoryValue(_0x57c513 + 0x18, _0xe5ad3d.length);
                    },
                    "syscall/js.valueLoadString": (_0xd20694) => {
                        const _0x1bcf7e = getValueFromMemory(0x8 + (_0xd20694 >>>= 0x0));
                        getByteArrayFromMemory(_0xd20694 + 0x10).set(_0x1bcf7e);
                    },
                    "syscall/js.valueInstanceOf": (_0x515e20) => {
                        this.mem.setUint8(
                            0x18 + (_0x515e20 >>>= 0x0),
                            getValueFromMemory(_0x515e20 + 0x8) instanceof
                                getValueFromMemory(_0x515e20 + 0x10)
                                ? 0x1
                                : 0x0,
                        );
                    },
                    "syscall/js.copyBytesToGo": (_0x3b040d) => {
                        const _0xcf50d7 = getByteArrayFromMemory(
                            0x8 + (_0x3b040d >>>= 0x0),
                        );
                        const _0x502788 = getValueFromMemory(_0x3b040d + 0x20);
                        if (
                            !(
                                _0x502788 instanceof Uint8Array ||
                                _0x502788 instanceof Uint8ClampedArray
                            )
                        ) {
                            return void this.mem.setUint8(_0x3b040d + 0x30, 0x0);
                        }
                        const _0x347884 = _0x502788.subarray(0x0, _0xcf50d7.length);
                        _0xcf50d7.set(_0x347884);
                        setMemoryValue(_0x3b040d + 0x28, _0x347884.length);
                        this.mem.setUint8(_0x3b040d + 0x30, 0x1);
                    },
                    "syscall/js.copyBytesToJS": (_0x2c7dbd) => {
                        const _0x3e840b = getValueFromMemory(0x8 + (_0x2c7dbd >>>= 0x0));
                        const _0x47be1d = getByteArrayFromMemory(_0x2c7dbd + 0x10);
                        if (
                            !(
                                _0x3e840b instanceof Uint8Array ||
                                _0x3e840b instanceof Uint8ClampedArray
                            )
                        ) {
                            return void this.mem.setUint8(_0x2c7dbd + 0x30, 0x0);
                        }
                        const _0x2d9d42 = _0x47be1d.subarray(0x0, _0x3e840b.length);
                        _0x3e840b.set(_0x2d9d42);
                        setMemoryValue(_0x2c7dbd + 0x28, _0x2d9d42.length);
                        this.mem.setUint8(_0x2c7dbd + 0x30, 0x1);
                    },
                    debug: (_0x5560e3) => {
                        console.log(_0x5560e3);
                    },
                },
            };
        }
        run(_0x3a3ab2) {
            return processAsync(this, null, function* () {
                if (!(_0x3a3ab2 instanceof WebAssembly.Instance)) {
                    throw new Error("Go.run: WebAssembly.Instance expected");
                }
                this._inst = _0x3a3ab2;
                this.mem = new DataView(this._inst.exports.mem.buffer);
                this._values = [NaN, 0x0, null, true, false, globalThis, this];
                this._goRefCounts = new Array(this._values.length).fill(Infinity);
                this._ids = new Map([
                    [0x0, 0x1],
                    [null, 0x2],
                    [true, 0x3],
                    [false, 0x4],
                    [globalThis, 0x5],
                    [this, 0x6],
                ]);
                this._idPool = [];
                this.exited = false;
                let _0x5c27d6 = 0x1000;
                const _0x17ab00 = (_0x592ac2) => {
                    const _0x42047b = _0x5c27d6;
                    const _0x169394 = TextEncoderUnicode.encode(_0x592ac2 + "\0");
                    new Uint8Array(this.mem.buffer, _0x5c27d6, _0x169394.length).set(
                        _0x169394,
                    );
                    _0x5c27d6 += _0x169394.length;
                    if (_0x5c27d6 % 0x8 != 0x0) {
                        _0x5c27d6 += 0x8 - (_0x5c27d6 % 0x8);
                    }
                    return _0x42047b;
                };
                const _0x33ce5b = this.argv.length;
                const _0x1d93e4 = [];
                this.argv.forEach((_0x2b450c) => {
                    _0x1d93e4.push(_0x17ab00(_0x2b450c));
                });
                _0x1d93e4.push(0x0);
                Object.keys(this.env)
                    .sort()
                    .forEach((_0x5793a5) => {
                        _0x1d93e4.push(_0x17ab00(_0x5793a5 + "=" + this.env[_0x5793a5]));
                    });
                _0x1d93e4.push(0x0);
                const _0x1563af = _0x5c27d6;
                _0x1d93e4.forEach((_0x2954fa) => {
                    this.mem.setUint32(_0x5c27d6, _0x2954fa, true);
                    this.mem.setUint32(_0x5c27d6 + 0x4, 0x0, true);
                    _0x5c27d6 += 0x8;
                });
                if (_0x5c27d6 >= 0x3000) {
                    throw new Error(
                        "total length of command line and environment variables exceeds limit",
                    );
                }
                this._inst.exports.run(_0x33ce5b, _0x1563af);
                if (this.exited) {
                    this._resolveExitPromise();
                }
                yield this._exitPromise;
            });
        }
        _resume() {
            if (this.exited) {
                throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
                this._resolveExitPromise();
            }
        }
        _makeFuncWrapper(id) {
            const this_ = this;
            return function() {
                const event = {
                    id,
                    this: this,
                    args: arguments,
                };
                this_._pendingEvent = event;
                this_._resume();
                return event.result;
            };
        }
    };
})();

export default function(wasmBytes: Buffer, requestData: any, args1: string): Promise<string> {
    return processAsync(this, null, function* () {
        const go = new Go();
        const instance = (yield WebAssembly.instantiate(wasmBytes, go.importObject))
            .instance;
        go.run(instance);
        return globalThis.bder(JSON.stringify(requestData), args1);
    });
}