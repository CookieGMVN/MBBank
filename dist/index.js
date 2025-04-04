"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  MB: () => MB
});
module.exports = __toCommonJS(src_exports);

// src/MB.ts
var import_node_crypto = require("crypto");
var import_moment2 = __toESM(require("moment"));
var import_undici3 = require("undici");

// src/utils/Global.ts
var import_jimp = __toESM(require("jimp"));
var import_moment = __toESM(require("moment"));
function getTimeNow() {
  return (0, import_moment.default)().format("YYYYMMDDHHmmss" + (0, import_moment.default)().millisecond().toString().slice(0, -1));
}
__name(getTimeNow, "getTimeNow");
function generateDeviceId() {
  return "s1rmi184-mbib-0000-0000-" + getTimeNow();
}
__name(generateDeviceId, "generateDeviceId");
var defaultHeaders = {
  "Cache-Control": "max-age=0",
  "Accept": "application/json, text/plain, */*",
  "Authorization": "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
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
  "Sec-Fetch-Site": "same-origin"
};
var defaultTesseractConfig = {
  lang: "eng",
  oem: 1,
  psm: 12
};
var FPR = "c7a1beebb9400375bb187daa33de9659";
async function replaceColor({
  image,
  target,
  replace,
  tolerance = 0
}) {
  try {
    const jimpImage = await import_jimp.default.read(image);
    const targetHex = target.startsWith("#") ? target.substring(1) : target;
    const replaceHex = replace.startsWith("#") ? replace.substring(1) : replace;
    const targetR = parseInt(targetHex.substring(0, 2), 16);
    const targetG = parseInt(targetHex.substring(2, 4), 16);
    const targetB = parseInt(targetHex.substring(4, 6), 16);
    const replaceR = parseInt(replaceHex.substring(0, 2), 16);
    const replaceG = parseInt(replaceHex.substring(2, 4), 16);
    const replaceB = parseInt(replaceHex.substring(4, 6), 16);
    const maxDiff = 255 * Math.min(tolerance / 100, 1);
    jimpImage.scan(0, 0, jimpImage.getWidth(), jimpImage.getHeight(), function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const colorDiff = Math.sqrt(
        Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2)
      );
      if (colorDiff <= maxDiff) {
        this.bitmap.data[idx + 0] = replaceR;
        this.bitmap.data[idx + 1] = replaceG;
        this.bitmap.data[idx + 2] = replaceB;
      }
    });
    return await jimpImage.getBufferAsync(import_jimp.default.MIME_PNG);
  } catch (error) {
    console.error("Error in replaceColor:", error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}
__name(replaceColor, "replaceColor");
async function cutBorder({
  image,
  borderWidth = 5
}) {
  try {
    const jimpImage = await import_jimp.default.read(image);
    const originalWidth = jimpImage.getWidth();
    const originalHeight = jimpImage.getHeight();
    if (originalWidth <= 2 * borderWidth || originalHeight <= 2 * borderWidth) {
      throw new Error("Image is too small to cut the specified border width");
    }
    const newWidth = originalWidth - 2 * borderWidth;
    const newHeight = originalHeight - 2 * borderWidth;
    const croppedImage = jimpImage.crop(
      borderWidth,
      borderWidth,
      newWidth,
      newHeight
    );
    return await croppedImage.getBufferAsync(import_jimp.default.MIME_PNG);
  } catch (error) {
    console.error("Error in cutBorder:", error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}
__name(cutBorder, "cutBorder");

// src/utils/LoadWasm.ts
var window = {
  globalThis,
  document: {
    welovemb: true
  }
};
globalThis.window = window;
globalThis.location = new URL("https://online.mbbank.com.vn/pl/login");
var processAsync = /* @__PURE__ */ __name((param1, param2, generatorFunction) => new Promise((resolve, reject) => {
  var handleResult = /* @__PURE__ */ __name((result) => {
    try {
      processStep(generatorFunction.next(result));
    } catch (error) {
      reject(error);
    }
  }, "handleResult"), handleError = /* @__PURE__ */ __name((error) => {
    try {
      processStep(generatorFunction.throw(error));
    } catch (err) {
      reject(err);
    }
  }, "handleError"), processStep = /* @__PURE__ */ __name((step) => step.done ? resolve(step.value) : Promise.resolve(step.value).then(handleResult, handleError), "processStep");
  processStep(
    (generatorFunction = generatorFunction.apply(param1, param2)).next()
  );
}), "processAsync");
(() => {
  const ErrENOSYS = /* @__PURE__ */ __name(() => {
    const err = new Error("not implemented");
    err.code = "ENOSYS";
    return err;
  }, "ErrENOSYS");
  if (!globalThis.fs) {
    let data = "";
    globalThis.fs = {
      constants: {
        O_WRONLY: -1,
        O_RDWR: -1,
        O_CREAT: -1,
        O_TRUNC: -1,
        O_APPEND: -1,
        O_EXCL: -1
      },
      writeSync(fd, buffer) {
        data += TextDecoderUnicode.decode(buffer);
        const indexEOL = data.lastIndexOf("\n");
        if (indexEOL != -1) {
          console.log(data.substring(0, indexEOL));
          data = data.substring(indexEOL + 1);
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
      }
    };
  }
  if (!globalThis.process) {
    globalThis.process = {
      getuid: /* @__PURE__ */ __name(() => -1, "getuid"),
      getgid: /* @__PURE__ */ __name(() => -1, "getgid"),
      geteuid: /* @__PURE__ */ __name(() => -1, "geteuid"),
      getegid: /* @__PURE__ */ __name(() => -1, "getegid"),
      pid: -1,
      ppid: -1
    };
  }
  if (!globalThis.crypto) {
    throw new Error(
      "globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)"
    );
  }
  if (!globalThis.performance) {
    throw new Error(
      "globalThis.performance is not available, polyfill required (performance.now only)"
    );
  }
  if (!globalThis.TextEncoder) {
    throw new Error(
      "globalThis.TextEncoder is not available, polyfill required"
    );
  }
  if (!globalThis.TextDecoder) {
    throw new Error(
      "globalThis.TextDecoder is not available, polyfill required"
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
      this._scheduledTimeouts = /* @__PURE__ */ new Map();
      this._nextCallbackTimeoutID = 1;
      const setMemoryValue = /* @__PURE__ */ __name((address, value) => {
        this.mem.setUint32(address + 0, value, true);
        this.mem.setUint32(
          address + 4,
          Math.floor(value / 4294967296),
          true
        );
      }, "setMemoryValue");
      const getValueFromMemory = /* @__PURE__ */ __name((address) => {
        const floatValue = this.mem.getFloat64(address, true);
        if (floatValue === 0) {
          return;
        }
        if (!isNaN(floatValue)) {
          return floatValue;
        }
        const intValue = this.mem.getUint32(address, true);
        return this._values[intValue];
      }, "getValueFromMemory");
      const setValueInMemory = /* @__PURE__ */ __name((address, value) => {
        if (typeof value === "number" && value !== 0) {
          if (isNaN(value)) {
            this.mem.setUint32(address + 4, 2146959360, true);
            this.mem.setUint32(address, 0, true);
          } else {
            this.mem.setFloat64(address, value, true);
          }
          return;
        }
        if (value === void 0) {
          this.mem.setFloat64(address, 0, true);
          return;
        }
        let id = this._ids.get(value);
        if (id === void 0) {
          id = this._idPool.pop();
          if (id === void 0) {
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
        this.mem.setUint32(address + 4, 2146959360 | typeFlag, true);
        this.mem.setUint32(address, id, true);
      }, "setValueInMemory");
      const getByteArrayFromMemory = /* @__PURE__ */ __name((address) => {
        const startAddress = this.mem.getUint32(address + 0, true) + 4294967296 * this.mem.getInt32(address + 4, true);
        const length = this.mem.getUint32(address + 8, true) + 4294967296 * this.mem.getInt32(address + 12, true);
        return new Uint8Array(
          this._inst.exports.mem.buffer,
          startAddress,
          length
        );
      }, "getByteArrayFromMemory");
      const getArrayFromMemory = /* @__PURE__ */ __name((address) => {
        const startAddress = this.mem.getUint32(address + 0, true) + 4294967296 * this.mem.getInt32(address + 4, true);
        const length = this.mem.getUint32(address + 8, true) + 4294967296 * this.mem.getInt32(address + 12, true);
        const array = new Array(length);
        for (let i = 0; i < length; i++) {
          array[i] = getValueFromMemory(startAddress + 8 * i);
        }
        return array;
      }, "getArrayFromMemory");
      const getStringFromMemory = /* @__PURE__ */ __name((address) => {
        const startAddress = this.mem.getUint32(address + 0, true) + 4294967296 * this.mem.getInt32(address + 4, true);
        const length = this.mem.getUint32(address + 8, true) + 4294967296 * this.mem.getInt32(address + 12, true);
        return TextDecoderUnicode.decode(
          new DataView(this._inst.exports.mem.buffer, startAddress, length)
        );
      }, "getStringFromMemory");
      const timeDifference = Date.now() - performance.now();
      this.importObject = {
        _gotest: {
          add: /* @__PURE__ */ __name((a, b) => a + b, "add")
        },
        gojs: {
          "runtime.wasmExit": /* @__PURE__ */ __name((input) => {
            const exitCode = this.mem.getInt32(8 + (input >>>= 0), true);
            this.exited = true;
            delete this._inst;
            delete this._values;
            delete this._goRefCounts;
            delete this._ids;
            delete this._idPool;
            this.exit(exitCode);
          }, "runtime.wasmExit"),
          "runtime.wasmWrite": /* @__PURE__ */ __name((address) => {
            const fileDescriptor = this.mem.getUint32(8 + (address >>>= 0) + 0, true) + 4294967296 * this.mem.getInt32(8 + (address >>>= 0) + 4, true);
            const dataAddress = this.mem.getUint32(address + 16 + 0, true) + 4294967296 * this.mem.getInt32(address + 16 + 4, true);
            const dataLength = this.mem.getInt32(address + 24, true);
            fs.writeSync(
              fileDescriptor,
              new Uint8Array(
                this._inst.exports.mem.buffer,
                dataAddress,
                dataLength
              )
            );
          }, "runtime.wasmWrite"),
          "runtime.resetMemoryDataView": /* @__PURE__ */ __name((_0x1fc0dd) => {
            this.mem = new DataView(this._inst.exports.mem.buffer);
          }, "runtime.resetMemoryDataView"),
          "runtime.nanotime1": /* @__PURE__ */ __name((_0x5843c4) => {
            setMemoryValue(
              8 + (_0x5843c4 >>>= 0),
              1e6 * (timeDifference + performance.now())
            );
          }, "runtime.nanotime1"),
          "runtime.walltime": /* @__PURE__ */ __name((_0x431dd5) => {
            _0x431dd5 >>>= 0;
            const _0x2d1628 = (/* @__PURE__ */ new Date()).getTime();
            setMemoryValue(_0x431dd5 + 8, _0x2d1628 / 1e3);
            this.mem.setInt32(
              _0x431dd5 + 16,
              _0x2d1628 % 1e3 * 1e6,
              true
            );
          }, "runtime.walltime"),
          "runtime.scheduleTimeoutEvent": /* @__PURE__ */ __name((_0x40be90) => {
            _0x40be90 >>>= 0;
            const _0x4d23db = this._nextCallbackTimeoutID;
            this._nextCallbackTimeoutID++;
            this._scheduledTimeouts.set(
              _0x4d23db,
              setTimeout(() => {
                for (this._resume(); this._scheduledTimeouts.has(_0x4d23db); ) {
                  console.warn("scheduleTimeoutEvent: missed timeout event");
                  this._resume();
                }
              }, this.mem.getUint32(_0x40be90 + 8 + 0, true) + 4294967296 * this.mem.getInt32(_0x40be90 + 8 + 4, true))
            );
            this.mem.setInt32(_0x40be90 + 16, _0x4d23db, true);
          }, "runtime.scheduleTimeoutEvent"),
          "runtime.clearTimeoutEvent": /* @__PURE__ */ __name((_0x4d392b) => {
            const _0x157834 = this.mem.getInt32(
              8 + (_0x4d392b >>>= 0),
              true
            );
            clearTimeout(this._scheduledTimeouts.get(_0x157834));
            this._scheduledTimeouts["delete"](_0x157834);
          }, "runtime.clearTimeoutEvent"),
          "runtime.getRandomData": /* @__PURE__ */ __name((_0xfc09b6) => {
            crypto.getRandomValues(
              getByteArrayFromMemory(8 + (_0xfc09b6 >>>= 0))
            );
          }, "runtime.getRandomData"),
          "syscall/js.finalizeRef": /* @__PURE__ */ __name((_0x5edca4) => {
            const _0x57d4fc = this.mem.getUint32(
              8 + (_0x5edca4 >>>= 0),
              true
            );
            this._goRefCounts[_0x57d4fc]--;
            if (this._goRefCounts[_0x57d4fc] === 0) {
              const _0x372c88 = this._values[_0x57d4fc];
              this._values[_0x57d4fc] = null;
              this._ids["delete"](_0x372c88);
              this._idPool.push(_0x57d4fc);
            }
          }, "syscall/js.finalizeRef"),
          "syscall/js.stringVal": /* @__PURE__ */ __name((_0x11c7ea) => {
            setValueInMemory(
              24 + (_0x11c7ea >>>= 0),
              getStringFromMemory(_0x11c7ea + 8)
            );
          }, "syscall/js.stringVal"),
          "syscall/js.valueGet": /* @__PURE__ */ __name((_0x3c119c) => {
            _0x3c119c >>>= 0;
            const _0x57d3f0 = Reflect.get(
              getValueFromMemory(_0x3c119c + 8),
              getStringFromMemory(_0x3c119c + 16)
            );
            _0x3c119c = this._inst.exports.getsp() >>> 0;
            setValueInMemory(_0x3c119c + 32, _0x57d3f0);
          }, "syscall/js.valueGet"),
          "syscall/js.valueSet": /* @__PURE__ */ __name((_0x2df90d) => {
            _0x2df90d >>>= 0;
            Reflect.set(
              getValueFromMemory(_0x2df90d + 8),
              getStringFromMemory(_0x2df90d + 16),
              getValueFromMemory(_0x2df90d + 32)
            );
          }, "syscall/js.valueSet"),
          "syscall/js.valueDelete": /* @__PURE__ */ __name((_0x5c6169) => {
            _0x5c6169 >>>= 0;
            Reflect.deleteProperty(
              getValueFromMemory(_0x5c6169 + 8),
              getStringFromMemory(_0x5c6169 + 16)
            );
          }, "syscall/js.valueDelete"),
          "syscall/js.valueIndex": /* @__PURE__ */ __name((_0xd5cf7e) => {
            setValueInMemory(
              24 + (_0xd5cf7e >>>= 0),
              Reflect.get(
                getValueFromMemory(_0xd5cf7e + 8),
                this.mem.getUint32(_0xd5cf7e + 16 + 0, true) + 4294967296 * this.mem.getInt32(_0xd5cf7e + 16 + 4, true)
              )
            );
          }, "syscall/js.valueIndex"),
          "syscall/js.valueSetIndex": /* @__PURE__ */ __name((_0x1b938f) => {
            _0x1b938f >>>= 0;
            Reflect.set(
              getValueFromMemory(_0x1b938f + 8),
              this.mem.getUint32(_0x1b938f + 16 + 0, true) + 4294967296 * this.mem.getInt32(_0x1b938f + 16 + 4, true),
              getValueFromMemory(_0x1b938f + 24)
            );
          }, "syscall/js.valueSetIndex"),
          "syscall/js.valueCall": /* @__PURE__ */ __name((_0x38baf6) => {
            _0x38baf6 >>>= 0;
            try {
              const _0xb55714 = getValueFromMemory(_0x38baf6 + 8);
              const _0x4b45ac = Reflect.get(
                _0xb55714,
                getStringFromMemory(_0x38baf6 + 16)
              );
              const _0x929c90 = getArrayFromMemory(_0x38baf6 + 32);
              const _0x331ca0 = Reflect.apply(_0x4b45ac, _0xb55714, _0x929c90);
              _0x38baf6 = this._inst.exports.getsp() >>> 0;
              setValueInMemory(_0x38baf6 + 56, _0x331ca0);
              this.mem.setUint8(_0x38baf6 + 64, 1);
            } catch (_0x3b2cd8) {
              _0x38baf6 = this._inst.exports.getsp() >>> 0;
              setValueInMemory(_0x38baf6 + 56, _0x3b2cd8);
              this.mem.setUint8(_0x38baf6 + 64, 0);
            }
          }, "syscall/js.valueCall"),
          "syscall/js.valueInvoke": /* @__PURE__ */ __name((_0x19f35b) => {
            _0x19f35b >>>= 0;
            try {
              const _0xdd2a3 = getValueFromMemory(_0x19f35b + 8);
              const _0x330c8f = getArrayFromMemory(_0x19f35b + 16);
              const _0x49e23c = Reflect.apply(_0xdd2a3, void 0, _0x330c8f);
              _0x19f35b = this._inst.exports.getsp() >>> 0;
              setValueInMemory(_0x19f35b + 40, _0x49e23c);
              this.mem.setUint8(_0x19f35b + 48, 1);
            } catch (_0x5bd1fc) {
              _0x19f35b = this._inst.exports.getsp() >>> 0;
              setValueInMemory(_0x19f35b + 40, _0x5bd1fc);
              this.mem.setUint8(_0x19f35b + 48, 0);
            }
          }, "syscall/js.valueInvoke"),
          "syscall/js.valueNew": /* @__PURE__ */ __name((_0x275c5e) => {
            _0x275c5e >>>= 0;
            try {
              const _0x2a547b = getValueFromMemory(_0x275c5e + 8);
              const _0x3fcde3 = getArrayFromMemory(_0x275c5e + 16);
              const _0x94eb67 = Reflect.construct(_0x2a547b, _0x3fcde3);
              _0x275c5e = this._inst.exports.getsp() >>> 0;
              setValueInMemory(_0x275c5e + 40, _0x94eb67);
              this.mem.setUint8(_0x275c5e + 48, 1);
            } catch (_0x5b3614) {
              _0x275c5e = this._inst.exports.getsp() >>> 0;
              setValueInMemory(_0x275c5e + 40, _0x5b3614);
              this.mem.setUint8(_0x275c5e + 48, 0);
            }
          }, "syscall/js.valueNew"),
          "syscall/js.valueLength": /* @__PURE__ */ __name((_0x2cc204) => {
            setMemoryValue(
              16 + (_0x2cc204 >>>= 0),
              parseInt(getValueFromMemory(_0x2cc204 + 8).length)
            );
          }, "syscall/js.valueLength"),
          "syscall/js.valuePrepareString": /* @__PURE__ */ __name((_0x57c513) => {
            _0x57c513 >>>= 0;
            const _0xe5ad3d = TextEncoderUnicode.encode(
              String(getValueFromMemory(_0x57c513 + 8))
            );
            setValueInMemory(_0x57c513 + 16, _0xe5ad3d);
            setMemoryValue(_0x57c513 + 24, _0xe5ad3d.length);
          }, "syscall/js.valuePrepareString"),
          "syscall/js.valueLoadString": /* @__PURE__ */ __name((_0xd20694) => {
            const _0x1bcf7e = getValueFromMemory(8 + (_0xd20694 >>>= 0));
            getByteArrayFromMemory(_0xd20694 + 16).set(_0x1bcf7e);
          }, "syscall/js.valueLoadString"),
          "syscall/js.valueInstanceOf": /* @__PURE__ */ __name((_0x515e20) => {
            this.mem.setUint8(
              24 + (_0x515e20 >>>= 0),
              getValueFromMemory(_0x515e20 + 8) instanceof getValueFromMemory(_0x515e20 + 16) ? 1 : 0
            );
          }, "syscall/js.valueInstanceOf"),
          "syscall/js.copyBytesToGo": /* @__PURE__ */ __name((_0x3b040d) => {
            const _0xcf50d7 = getByteArrayFromMemory(
              8 + (_0x3b040d >>>= 0)
            );
            const _0x502788 = getValueFromMemory(_0x3b040d + 32);
            if (!(_0x502788 instanceof Uint8Array || _0x502788 instanceof Uint8ClampedArray)) {
              return void this.mem.setUint8(_0x3b040d + 48, 0);
            }
            const _0x347884 = _0x502788.subarray(0, _0xcf50d7.length);
            _0xcf50d7.set(_0x347884);
            setMemoryValue(_0x3b040d + 40, _0x347884.length);
            this.mem.setUint8(_0x3b040d + 48, 1);
          }, "syscall/js.copyBytesToGo"),
          "syscall/js.copyBytesToJS": /* @__PURE__ */ __name((_0x2c7dbd) => {
            const _0x3e840b = getValueFromMemory(8 + (_0x2c7dbd >>>= 0));
            const _0x47be1d = getByteArrayFromMemory(_0x2c7dbd + 16);
            if (!(_0x3e840b instanceof Uint8Array || _0x3e840b instanceof Uint8ClampedArray)) {
              return void this.mem.setUint8(_0x2c7dbd + 48, 0);
            }
            const _0x2d9d42 = _0x47be1d.subarray(0, _0x3e840b.length);
            _0x3e840b.set(_0x2d9d42);
            setMemoryValue(_0x2c7dbd + 40, _0x2d9d42.length);
            this.mem.setUint8(_0x2c7dbd + 48, 1);
          }, "syscall/js.copyBytesToJS"),
          debug: /* @__PURE__ */ __name((_0x5560e3) => {
            console.log(_0x5560e3);
          }, "debug")
        }
      };
    }
    run(_0x3a3ab2) {
      return processAsync(this, null, function* () {
        if (!(_0x3a3ab2 instanceof WebAssembly.Instance)) {
          throw new Error("Go.run: WebAssembly.Instance expected");
        }
        this._inst = _0x3a3ab2;
        this.mem = new DataView(this._inst.exports.mem.buffer);
        this._values = [NaN, 0, null, true, false, globalThis, this];
        this._goRefCounts = new Array(this._values.length).fill(Infinity);
        this._ids = /* @__PURE__ */ new Map([
          [0, 1],
          [null, 2],
          [true, 3],
          [false, 4],
          [globalThis, 5],
          [this, 6]
        ]);
        this._idPool = [];
        this.exited = false;
        let _0x5c27d6 = 4096;
        const _0x17ab00 = /* @__PURE__ */ __name((_0x592ac2) => {
          const _0x42047b = _0x5c27d6;
          const _0x169394 = TextEncoderUnicode.encode(_0x592ac2 + "\0");
          new Uint8Array(this.mem.buffer, _0x5c27d6, _0x169394.length).set(
            _0x169394
          );
          _0x5c27d6 += _0x169394.length;
          if (_0x5c27d6 % 8 != 0) {
            _0x5c27d6 += 8 - _0x5c27d6 % 8;
          }
          return _0x42047b;
        }, "_0x17ab00");
        const _0x33ce5b = this.argv.length;
        const _0x1d93e4 = [];
        this.argv.forEach((_0x2b450c) => {
          _0x1d93e4.push(_0x17ab00(_0x2b450c));
        });
        _0x1d93e4.push(0);
        Object.keys(this.env).sort().forEach((_0x5793a5) => {
          _0x1d93e4.push(_0x17ab00(_0x5793a5 + "=" + this.env[_0x5793a5]));
        });
        _0x1d93e4.push(0);
        const _0x1563af = _0x5c27d6;
        _0x1d93e4.forEach((_0x2954fa) => {
          this.mem.setUint32(_0x5c27d6, _0x2954fa, true);
          this.mem.setUint32(_0x5c27d6 + 4, 0, true);
          _0x5c27d6 += 8;
        });
        if (_0x5c27d6 >= 12288) {
          throw new Error(
            "total length of command line and environment variables exceeds limit"
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
          args: arguments
        };
        this_._pendingEvent = event;
        this_._resume();
        return event.result;
      };
    }
  };
})();
function LoadWasm_default(wasmBytes, requestData, args1) {
  return processAsync(this, null, function* () {
    const go = new Go();
    const instance = (yield WebAssembly.instantiate(wasmBytes, go.importObject)).instance;
    go.run(instance);
    return globalThis.bder(JSON.stringify(requestData), args1);
  });
}
__name(LoadWasm_default, "default");

// src/utils/OCRModel.ts
var import_fs = require("fs");
var ort = __toESM(require("onnxruntime-node"));
var path = __toESM(require("path"));
var import_sharp = __toESM(require("sharp"));
var import_undici = require("undici");
var dirPath = path.dirname(require.main ? require.main.filename : __filename);
var OCRModel = class {
  static {
    __name(this, "OCRModel");
  }
  /**
   * Character set for recognition
   * @private
   * @type {string[]}
   */
  chars;
  /**
   * Path to the ONNX model file
   * @private
   * @type {string}
   */
  modelPath;
  /**
   * ONNX inference session
   * @private
   * @type {ort.InferenceSession}
   */
  session;
  /**
   * Creates a new OCR model
   * @param {string|null} modelPath - Optional custom path to the ONNX model file
   */
  constructor(modelPath = null) {
    this.chars = [];
    for (let i = 0; i < 10; i++) {
      this.chars.push(String(i));
    }
    for (let i = 97; i <= 122; i++) {
      this.chars.push(String.fromCharCode(i));
    }
    for (let i = 65; i <= 90; i++) {
      this.chars.push(String.fromCharCode(i));
    }
    this.chars.sort();
    this.modelPath = modelPath || path.join(dirPath, "/../model.onnx");
  }
  /**
   * Loads the ONNX model for inference
   * @returns {Promise<void>} A promise that resolves when the model is loaded
   */
  async loadModel() {
    if (!(0, import_fs.existsSync)(this.modelPath)) await this.downloadOnnxModel();
    this.session = await ort.InferenceSession.create(this.modelPath);
  }
  /**
   * Predicts text from an image
   * @param {Buffer} imageBuffer - The image buffer to process
   * @returns {Promise<string>} A promise that resolves to the recognized text
   */
  async predict(imageBuffer) {
    const processedImage = await (0, import_sharp.default)(imageBuffer).grayscale().resize(160, 50).raw().toBuffer();
    const imageArray = new Float32Array(processedImage.length);
    for (let i = 0; i < processedImage.length; i++) {
      imageArray[i] = processedImage[i] / 255;
    }
    const tensor = new ort.Tensor("float32", imageArray, [1, 1, 50, 160]);
    const inputName = this.session.inputNames[0];
    const feeds = {};
    feeds[inputName] = tensor;
    const results = await this.session.run(feeds);
    const outputData = Object.values(results)[0].data;
    const outputShape = Object.values(results)[0].dims;
    const pred = this.reshapeTensor(outputData, outputShape);
    const predLabels = this.argmax(pred, 2);
    let predText = "";
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
  async downloadOnnxModel() {
    try {
      const model = await (0, import_undici.request)("https://github.com/thedtvn/mbbank-capcha-ocr/raw/refs/heads/master/mb_capcha_ocr/model.onnx", {
        maxRedirections: 10,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      const fileStream = (0, import_fs.createWriteStream)(this.modelPath);
      await new Promise((resolve, reject) => {
        model.body.pipe(fileStream);
        model.body.on("error", (err) => {
          reject(err);
        });
        fileStream.on("finish", () => {
          resolve();
        });
        fileStream.on("error", (err) => {
          reject(err);
        });
      });
    } catch (error) {
      console.error("Error downloading model:", error);
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
  reshapeTensor(data, shape) {
    const result = [];
    const [batchSize, seqLength, numClasses] = shape;
    for (let b = 0; b < batchSize; b++) {
      const batchResult = [];
      for (let s = 0; s < seqLength; s++) {
        const classProbs = [];
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
  argmax(tensor, axis) {
    const result = [];
    if (axis === 2) {
      for (let b = 0; b < tensor.length; b++) {
        const batchResult = [];
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
};

// src/utils/Tesseract.ts
var import_node_tesseract_ocr = require("node-tesseract-ocr");
var TesseractUtils = class {
  static {
    __name(this, "TesseractUtils");
  }
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
  static async cleanImage(image) {
    image = await replaceColor({
      image,
      target: "#857069",
      replace: "#ffffff"
    });
    image = await replaceColor({
      image,
      target: "#ffe4d6",
      replace: "#ffffff"
    });
    image = await cutBorder({
      image,
      borderWidth: 1
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
  static async recognizeText(image) {
    image = await this.cleanImage(image);
    const captchaContent = await (0, import_node_tesseract_ocr.recognize)(image, defaultTesseractConfig);
    captchaContent.replaceAll("\n", "");
    captchaContent.replaceAll(" ", "");
    captchaContent.slice(0, -1);
    if (captchaContent.length !== 6 || !/^[a-z0-9]+$/i.test(captchaContent)) {
      return null;
    }
    return captchaContent;
  }
};

// src/utils/Wasm.ts
var import_fs2 = require("fs");
var import_undici2 = require("undici");
var WasmUtils = class {
  static {
    __name(this, "WasmUtils");
  }
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
  static async downloadWasm() {
    const wasm = await (0, import_undici2.request)("https://online.mbbank.com.vn/assets/wasm/main.wasm", {
      headers: defaultHeaders
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
  static async loadWasm(path2) {
    if (!path2) {
      return this.downloadWasm();
    }
    if (!(0, import_fs2.existsSync)(path2)) {
      const wasm = await this.downloadWasm();
      (0, import_fs2.writeFileSync)(path2, wasm, { encoding: "binary" });
      return wasm;
    }
    return Buffer.from((0, import_fs2.readFileSync)(path2, "binary"), "binary");
  }
};

// src/MB.ts
var MB = class {
  static {
    __name(this, "MB");
  }
  /**
   * MB Bank account username (usually phone number).
   * @readonly
   * @type {string}
   */
  username;
  /**
   * MB Bank account password.
   * @readonly
   * @type {string}
   */
  password;
  /**
   * Session identifier returned by MB Bank's API after successful authentication.
   * Used to validate subsequent requests.
   * @type {string|null|undefined}
   */
  sessionId;
  /**
   * Device identifier used for authentication with MB Bank API.
   * This is automatically generated for each session.
   * @type {string}
   */
  deviceId = generateDeviceId();
  /**
   * HTTP client for making requests to MB Bank's API.
   * @type {Client}
   */
  client = new import_undici3.Client("https://online.mbbank.com.vn");
  /**
   * WASM binary data downloaded from MB Bank.
   * Used for request encryption.
   * @private
   * @type {Buffer}
   */
  wasmData;
  /**
   * Custom OCR function for captcha recognition.
   * Allows implementing your own captcha recognition logic.
   *
   * @private
   * @type {Function|undefined}
   * @param {Buffer} image - The captcha image buffer to be recognized
   * @returns {Promise<string>} Recognized text from the captcha
   *
   * @example
   * ```typescript
   * const mb = new MB({
   *   username: '0123456789',
   *   password: 'your_password',
   *   preferredOCRMethod: 'custom',
   *   customOCRFunction: async (imageBuffer) => {
   *     // Your custom OCR logic here
   *     // For example, using a third-party OCR service:
   *     const result = await someOCRService.recognize(imageBuffer);
   *     return result.text;
   *   }
   * });
   * ```
   */
  customOCRFunction;
  /**
   * The OCR method to use for captcha recognition.
   * - "default": Uses the pre-trained OCR model (recommended)
   * - "tesseract": Uses Tesseract OCR engine
   * - "custom": Uses the custom OCR function provided
   *
   * @private
   * @type {"default"|"tesseract"|"custom"}
   * @default "default"
   */
  preferredOCRMethod = "default";
  /**
   * Whether to save the WASM file to disk.
   * Useful for debugging or caching purposes.
   *
   * @private
   * @type {boolean}
   * @default false
   */
  saveWasm = false;
  /**
   * Creates a new MB client instance.
   *
   * @param {Object} data - Configuration options
   * @param {string} data.username - MB Bank login username (usually your registered phone number)
   * @param {string} data.password - MB Bank login password
   * @param {"default"|"tesseract"|"custom"} [data.preferredOCRMethod="default"] - OCR method for captcha recognition
   * @param {Function} [data.customOCRFunction] - Custom OCR function (required if preferredOCRMethod is "custom")
   * @param {boolean} [data.saveWasm=false] - Whether to save the WASM file to disk
   *
   * @throws {Error} If username or password is not provided
   *
   * @example
   * ```typescript
   * // Basic usage with default OCR
   * const mbClient = new MB({
   *   username: '0123456789',
   *   password: 'your_password'
   * });
   *
   * // Using Tesseract OCR
   * const mbWithTesseract = new MB({
   *   username: '0123456789',
   *   password: 'your_password',
   *   preferredOCRMethod: 'tesseract'
   * });
   *
   * // Using custom OCR function
   * const mbWithCustomOCR = new MB({
   *   username: '0123456789',
   *   password: 'your_password',
   *   preferredOCRMethod: 'custom',
   *   customOCRFunction: async (image) => {
   *     // Your custom captcha recognition logic
   *     return recognizedText;
   *   }
   * });
   * ```
   */
  constructor(data) {
    if (!data.username || !data.password) throw new Error("You must define at least a MB account to use with this library!");
    this.username = data.username;
    this.password = data.password;
    if (data.preferredOCRMethod) this.preferredOCRMethod = data.preferredOCRMethod;
    if (data.customOCRFunction) this.customOCRFunction = data.customOCRFunction;
    if (data.saveWasm) this.saveWasm = data.saveWasm;
  }
  /**
   * Processes captcha image according to the configured OCR method.
   *
   * @private
   * @param {Buffer} image - Captcha image buffer
   * @returns {Promise<string|null>} Recognized captcha text or null if recognition failed
   */
  async recognizeCaptcha(image) {
    switch (this.preferredOCRMethod) {
      case "default":
        const model = new OCRModel();
        await model.loadModel();
        const modelPredictedCaptcha = await model.predict(image);
        if (modelPredictedCaptcha.length !== 6) return null;
        return modelPredictedCaptcha;
      case "tesseract":
        return await TesseractUtils.recognizeText(image);
      case "custom":
        if (!this.customOCRFunction) return null;
        const customPredictedCaptcha = await this.customOCRFunction(image);
        if (customPredictedCaptcha.length !== 6) return null;
        return customPredictedCaptcha;
    }
  }
  /**
   * Authenticates with MB Bank API by solving captcha and sending login credentials.
   * Sets the session ID upon successful login.
   *
   * @returns {Promise<LoginResponseData>} Login response from the API
   * @throws {Error} If login fails with specific error code and message
   *
   * @example
   * ```typescript
   * const mb = new MB({
   *   username: '0123456789',
   *   password: 'your_password'
   * });
   *
   * try {
   *   const loginResponse = await mb.login();
   *   console.log('Login successful!');
   *   console.log('Session ID:', mb.sessionId);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async login() {
    const rId = getTimeNow();
    const headers = defaultHeaders;
    headers["X-Request-Id"] = rId;
    headers["Deviceid"] = this.deviceId;
    headers["Refno"] = rId;
    const captchaReq = await this.client.request({
      method: "POST",
      path: "/api/retail-web-internetbankingms/getCaptchaImage",
      headers,
      body: JSON.stringify({
        "sessionId": "",
        "refNo": rId,
        "deviceIdCommon": this.deviceId
      })
    });
    const captchaRes = await captchaReq.body.json();
    const captchaBuffer = Buffer.from(captchaRes.imageString, "base64");
    const captchaContent = await this.recognizeCaptcha(captchaBuffer);
    if (captchaContent === null) return this.login();
    if (!this.wasmData) {
      this.wasmData = await WasmUtils.loadWasm(this.saveWasm ? "main.wasm" : void 0);
    }
    const requestData = {
      userId: this.username,
      password: (0, import_node_crypto.createHash)("md5").update(this.password).digest("hex"),
      captcha: captchaContent,
      ibAuthen2faString: FPR,
      sessionId: null,
      refNo: getTimeNow(),
      deviceIdCommon: this.deviceId
    };
    const loginReq = await this.client.request({
      method: "POST",
      path: "/api/retail_web/internetbanking/v2.0/doLogin",
      headers: defaultHeaders,
      body: JSON.stringify({
        dataEnc: await LoadWasm_default(this.wasmData, requestData, "0")
      })
    });
    const loginRes = await loginReq.body.json();
    if (!loginRes.result) {
      throw new Error("Login failed: Unknown data");
    }
    if (loginRes.result.ok) {
      this.sessionId = loginRes.sessionId;
      return loginRes;
    } else if (loginRes.result.responseCode === "GW283") {
      return this.login();
    } else {
      const e = new Error("Login failed: (" + loginRes.result.responseCode + "): " + loginRes.result.message);
      e.code = loginRes.result.responseCode;
      throw e;
    }
  }
  /**
   * Generates a reference ID required by MB Bank API.
   * The format is "{username}-{timestamp}".
   *
   * @private
   * @returns {string} Reference ID for API requests
   */
  getRefNo() {
    return `${this.username}-${getTimeNow()}`;
  }
  /**
   * Makes an authenticated request to MB Bank API.
   * Handles session expiration by automatically re-logging in.
   *
   * @private
   * @param {Object} data - Request parameters
   * @param {string} data.path - API endpoint path
   * @param {Object} [data.json] - Request body data
   * @param {Object} [data.headers] - Additional request headers
   * @returns {Promise<any>} API response
   * @throws {Error} If the request fails with error code and message
   */
  async mbRequest(data) {
    if (!this.sessionId) {
      await this.login();
    }
    const rId = this.getRefNo();
    const headers = defaultHeaders;
    headers["X-Request-Id"] = rId;
    headers["Deviceid"] = this.deviceId, headers["Refno"] = rId;
    const defaultBody = {
      "sessionId": this.sessionId,
      "refNo": rId,
      "deviceIdCommon": this.deviceId
    };
    const body = Object.assign(defaultBody, data.json);
    const httpReq = await this.client.request({
      method: "POST",
      path: data.path,
      headers,
      body: JSON.stringify(body)
    });
    const httpRes = await httpReq.body.json();
    if (!httpRes || !httpRes.result) {
      return false;
    } else if (httpRes.result.ok == true) return httpRes;
    else if (httpRes.result.responseCode === "GW200") {
      await this.login();
      return this.mbRequest(data);
    } else {
      throw new Error("Request failed (" + httpRes.result.responseCode + "): " + httpRes.result.message);
    }
  }
  /**
   * Retrieves account balance information for all accounts.
   *
   * @returns {Promise<BalanceList|undefined>} Account balance data or undefined if request fails
   *
   * @example
   * ```typescript
   * const mb = new MB({
   *   username: '0123456789',
   *   password: 'your_password'
   * });
   *
   * async function getAccountInfo() {
   *   await mb.login();
   *   const balanceInfo = await mb.getBalance();
   *
   *   if (balanceInfo) {
   *     console.log(`Total balance: ${balanceInfo.totalBalance} ${balanceInfo.currencyEquivalent}`);
   *
   *     // Display each account's details
   *     balanceInfo.balances.forEach(account => {
   *       console.log(`Account: ${account.name} (${account.number})`);
   *       console.log(`Balance: ${account.balance} ${account.currency}`);
   *       console.log('---');
   *     });
   *   }
   * }
   *
   * getAccountInfo().catch(console.error);
   * ```
   */
  async getBalance() {
    const balanceData = await this.mbRequest({ path: "/api/retail-web-accountms/getBalance" });
    if (!balanceData) return;
    const balance = {
      totalBalance: balanceData.totalBalanceEquivalent,
      currencyEquivalent: balanceData.currencyEquivalent,
      balances: []
    };
    balanceData.acct_list.forEach((acctInfo) => {
      const acct = acctInfo;
      const balanceData2 = {
        number: acct.acctNo,
        name: acct.acctNm,
        currency: acct.ccyCd,
        balance: acct.currentBalance
      };
      balance.balances?.push(balanceData2);
    });
    balanceData.internationalAcctList.forEach((acctInfo) => {
      const acct = acctInfo;
      const balanceData2 = {
        number: acct.acctNo,
        name: acct.acctNm,
        currency: acct.ccyCd,
        balance: acct.currentBalance
      };
      balance.balances?.push(balanceData2);
    });
    return balance;
  }
  /**
   * Retrieves transaction history for a specific account within a date range.
   *
   * @param {Object} data - Request parameters
   * @param {string} data.accountNumber - MB Bank account number to query
   * @param {string} data.fromDate - Start date in format "DD/MM/YYYY" or "D/M/YYYY"
   * @param {string} data.toDate - End date in format "DD/MM/YYYY" or "D/M/YYYY"
   * @returns {Promise<TransactionInfo[]|undefined>} Array of transaction details or undefined if request fails
   * @throws {Error} If date range exceeds 90 days or date format is invalid
   *
   * @example
   * ```typescript
   * const mb = new MB({
   *   username: '0123456789',
   *   password: 'your_password'
   * });
   *
   * async function getLastMonthTransactions() {
   *   await mb.login();
   *
   *   // Get account first
   *   const balanceInfo = await mb.getBalance();
   *   if (!balanceInfo?.balances?.length) {
   *     console.log('No accounts found');
   *     return;
   *   }
   *
   *   const accountNumber = balanceInfo.balances[0].number;
   *
   *   // Get transactions for the last 30 days
   *   const today = new Date();
   *   const lastMonth = new Date();
   *   lastMonth.setDate(today.getDate() - 30);
   *
   *   const fromDate = `${lastMonth.getDate()}/${lastMonth.getMonth() + 1}/${lastMonth.getFullYear()}`;
   *   const toDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
   *
   *   const transactions = await mb.getTransactionsHistory({
   *     accountNumber,
   *     fromDate,
   *     toDate
   *   });
   *
   *   if (transactions) {
   *     console.log(`Found ${transactions.length} transactions`);
   *
   *     transactions.forEach(tx => {
   *       const amount = tx.creditAmount || tx.debitAmount;
   *       const type = tx.creditAmount ? 'CREDIT' : 'DEBIT';
   *
   *       console.log(`${tx.transactionDate} | ${type} | ${amount} ${tx.transactionCurrency}`);
   *       console.log(`Description: ${tx.transactionDesc}`);
   *       if (tx.toAccountName) {
   *         console.log(`To: ${tx.toAccountName} (${tx.toAccountNumber}) at ${tx.toBank}`);
   *       }
   *       console.log('---');
   *     });
   *   }
   * }
   *
   * getLastMonthTransactions().catch(console.error);
   * ```
   */
  async getTransactionsHistory(data) {
    if ((0, import_moment2.default)().day() - (0, import_moment2.default)(data.fromDate, "D/M/YYYY").day() > 90 || (0, import_moment2.default)().day() - (0, import_moment2.default)(data.fromDate, "D/M/YYYY").day() > 90) throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");
    if ((0, import_moment2.default)(data.fromDate, "DD/MM/YYYY").day() - (0, import_moment2.default)(data.toDate, "D/M/YYYY").day() > 90) throw new Error("Date formatting error: Max transaction history must be shorter than 90 days!");
    const body = {
      "accountNo": data.accountNumber,
      "fromDate": (0, import_moment2.default)(data.fromDate, "D/M/YYYY").format("DD/MM/YYYY"),
      "toDate": (0, import_moment2.default)(data.toDate, "D/M/YYYY").format("DD/MM/YYYY")
    };
    const historyData = await this.mbRequest({ path: "/api/retail-transactionms/transactionms/get-account-transaction-history", json: body });
    if (!historyData || !historyData.transactionHistoryList) return;
    const transactionHistories = [];
    historyData.transactionHistoryList.forEach((transactionRaw) => {
      const transaction = transactionRaw;
      const transactionData = {
        postDate: transaction.postingDate,
        transactionDate: transaction.transactionDate,
        accountNumber: transaction.accountNo,
        creditAmount: transaction.creditAmount,
        debitAmount: transaction.debitAmount,
        transactionCurrency: transaction.currency,
        transactionDesc: transaction.description,
        balanceAvailable: transaction.availableBalance,
        refNo: transaction.refNo,
        toAccountName: transaction.benAccountName,
        toBank: transaction.bankName,
        toAccountNumber: transaction.benAccountName,
        type: transaction.transactionType
      };
      transactionHistories.push(transactionData);
    });
    return transactionHistories;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MB
});
//# sourceMappingURL=index.js.map