"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateInGMT7 = getDateInGMT7;
exports.dateFormat = dateFormat;
exports.parseDate = parseDate;
exports.isValidVnpayDateFormat = isValidVnpayDateFormat;
exports.generateRandomString = generateRandomString;
exports.getResponseByStatusCode = getResponseByStatusCode;
exports.resolveUrlString = resolveUrlString;
exports.hash = hash;
const node_crypto_1 = __importDefault(require("node:crypto"));
const moment_timezone_1 = require("moment-timezone");
const response_map_constant_1 = require("../constants/response-map.constant");
const enums_1 = require("../enums");
function getDateInGMT7(date) {
    return new Date((0, moment_timezone_1.tz)(date !== null && date !== void 0 ? date : new Date(), 'Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
}
/**
 * Định dạng lại ngày theo định dạng của VNPay, mặc định là yyyyMMddHHmmss
 * @en Format date to VNPay format, default is yyyyMMddHHmmss
 *
 * @param date date to format
 * @param format format of date
 * @returns formatted date
 */
function dateFormat(date, format = 'yyyyMMddHHmmss') {
    const pad = (n) => (n < 10 ? `0${n}` : n).toString();
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return Number(format
        .replace('yyyy', year.toString())
        .replace('MM', month)
        .replace('dd', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second));
}
/**
 * Parse a vnpay date format number to date
 * @param dateNumber An vnpay date format number
 * @returns Date
 */
function parseDate(dateNumber, tz = 'local') {
    const dateString = dateNumber.toString();
    const _parseInt = Number.parseInt;
    const year = _parseInt(dateString.slice(0, 4));
    const month = _parseInt(dateString.slice(4, 6)) - 1; // months are 0-indexed in JavaScript
    const day = _parseInt(dateString.slice(6, 8));
    const hour = _parseInt(dateString.slice(8, 10));
    const minute = _parseInt(dateString.slice(10, 12));
    const second = _parseInt(dateString.slice(12, 14));
    switch (tz) {
        case 'utc':
            return new Date((0, moment_timezone_1.utc)([year, month, day, hour, minute, second], true).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
        case 'gmt7':
            return getDateInGMT7(new Date(year, month, day, hour, minute, second));
        // biome-ignore lint/complexity/noUselessSwitchCase: still good to readable
        case 'local':
        default:
            return new Date(year, month, day, hour, minute, second);
    }
}
/**
 * Validate if the date is match with format `yyyyMMddHHmmss` or not
 * @param date The date to be validated
 * @returns True if the date is valid, false otherwise
 */
function isValidVnpayDateFormat(date) {
    const dateString = date.toString();
    const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/;
    return regex.test(dateString);
}
function generateRandomString(length, options) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (options === null || options === void 0 ? void 0 : options.onlyNumber) {
        characters = '0123456789';
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += `${characters[(Math.random() * charactersLength) | 0]}`;
    }
    return result;
}
/**
 * Lấy thông tin response theo mã response
 * @en Get response message by response code
 *
 * @param responseCode response code from VNPay
 * @param locale locale of response text
 * @param responseMap map of response code and response text if you want to custom
 * @returns message of response code
 */
function getResponseByStatusCode(responseCode = '', locale = enums_1.VnpLocale.VN, responseMap = response_map_constant_1.RESPONSE_MAP) {
    var _a;
    const respondText = (_a = responseMap.get(responseCode)) !== null && _a !== void 0 ? _a : responseMap.get('default');
    return respondText[locale];
}
function resolveUrlString(host, path) {
    let trimmedHost = host.trim();
    let trimmedPath = path.trim();
    while (trimmedHost.endsWith('/') || trimmedHost.endsWith('\\')) {
        trimmedHost = trimmedHost.slice(0, -1);
    }
    while (trimmedPath.startsWith('/') || trimmedPath.startsWith('\\')) {
        trimmedPath = trimmedPath.slice(1);
    }
    return `${trimmedHost}/${trimmedPath}`;
}
function hash(secret, data, algorithm) {
    return node_crypto_1.default.createHmac(algorithm, secret).update(data).digest('hex');
}
