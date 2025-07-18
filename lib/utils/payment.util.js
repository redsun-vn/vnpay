"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaymentUrlSearchParams = buildPaymentUrlSearchParams;
exports.createPaymentUrl = createPaymentUrl;
exports.calculateSecureHash = calculateSecureHash;
exports.verifySecureHash = verifySecureHash;
const constants_1 = require("../constants");
const common_1 = require("./common");
function buildPaymentUrlSearchParams(data) {
    const searchParams = new URLSearchParams();
    const sortedEntries = Object.entries(data).sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()));
    for (const [key, value] of sortedEntries) {
        // Skip empty value
        if (value === '' || value === undefined || value === null) {
            continue;
        }
        searchParams.append(key, value.toString());
    }
    return searchParams;
}
function createPaymentUrl({ config, data, }) {
    var _a, _b;
    const redirectUrl = new URL((0, common_1.resolveUrlString)((_a = config.vnpayHost) !== null && _a !== void 0 ? _a : constants_1.VNPAY_GATEWAY_SANDBOX_HOST, (_b = config.paymentEndpoint) !== null && _b !== void 0 ? _b : constants_1.PAYMENT_ENDPOINT));
    buildPaymentUrlSearchParams(data).forEach((value, key) => {
        redirectUrl.searchParams.set(key, value);
    });
    console.log('config', config);
    return redirectUrl;
}
function calculateSecureHash({ bufferEncode = 'utf-8', data, hashAlgorithm, secureSecret, }) {
    return (0, common_1.hash)(secureSecret, Buffer.from(data, bufferEncode), hashAlgorithm);
}
function verifySecureHash({ data, hashAlgorithm, receivedHash, secureSecret, }) {
    const calculatedHash = calculateSecureHash({ secureSecret, data, hashAlgorithm });
    return calculatedHash === receivedHash;
}
