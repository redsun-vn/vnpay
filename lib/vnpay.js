"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNPay = void 0;
const constants_1 = require("./constants");
const enums_1 = require("./enums");
const utils_1 = require("./utils");
const common_1 = require("./utils/common");
const payment_util_1 = require("./utils/payment.util");
/**
 * Lớp hỗ trợ thanh toán qua VNPay
 * @en VNPay class to support VNPay payment
 * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 *
 * @example
 * import { VNPay } from 'vnpay';
 *
 * const vnpay = new VNPay({
 *     api_Host: 'https://sandbox.vnpayment.vn',
 *     tmnCode: 'TMNCODE',
 *     secureSecret: 'SERCRET',
 *     testMode: true, // optional
 *     hashAlgorithm: 'SHA512', // optional
 *     paymentEndpoint: 'paymentv2/vpcpay.html', // optional
 * });
 *
 * const tnx = '12345678'; // Generate your own transaction code
 * const urlString = vnpay.buildPaymentUrl({
 *     vnp_Amount: 100000,
 *      vnp_IpAddr: '192.168.0.1',
 *      vnp_ReturnUrl: 'http://localhost:8888/order/vnpay_return',
 *      vnp_TxnRef: tnx,
 *      vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`,
 * }),
 *
 */
class VNPay {
    constructor(_a) {
        var { vnpayHost = constants_1.VNPAY_GATEWAY_SANDBOX_HOST, vnp_Version = constants_1.VNP_VERSION, vnp_CurrCode = enums_1.VnpCurrCode.VND, vnp_Locale = enums_1.VnpLocale.VN, testMode = false, paymentEndpoint = constants_1.PAYMENT_ENDPOINT } = _a, config = __rest(_a, ["vnpayHost", "vnp_Version", "vnp_CurrCode", "vnp_Locale", "testMode", "paymentEndpoint"]);
        this.HASH_ALGORITHM = enums_1.HashAlgorithm.SHA512;
        this.BUFFER_ENCODE = 'utf-8';
        this.isEnableLog = false;
        this.globalLoggerFn = (data) => { };
        if (testMode) {
            vnpayHost = constants_1.VNPAY_GATEWAY_SANDBOX_HOST;
        }
        if (config === null || config === void 0 ? void 0 : config.hashAlgorithm) {
            this.HASH_ALGORITHM = config.hashAlgorithm;
        }
        if (config === null || config === void 0 ? void 0 : config.enableLog) {
            this.isEnableLog = config.enableLog;
            // Default logger to console
            this.globalLoggerFn = utils_1.consoleLogger;
        }
        if (config === null || config === void 0 ? void 0 : config.loggerFn) {
            // Custom logger function
            this.globalLoggerFn = config.loggerFn;
        }
        this.globalDefaultConfig = Object.assign({ vnpayHost,
            vnp_Version,
            vnp_CurrCode,
            vnp_Locale, vnp_OrderType: enums_1.ProductCode.Other, vnp_Command: constants_1.VNP_DEFAULT_COMMAND, paymentEndpoint }, config);
    }
    /**
     * Lấy cấu hình mặc định của VNPay
     * @en Get default config of VNPay
     */
    get defaultConfig() {
        return {
            vnp_TmnCode: this.globalDefaultConfig.tmnCode,
            vnp_Version: this.globalDefaultConfig.vnp_Version,
            vnp_CurrCode: this.globalDefaultConfig.vnp_CurrCode,
            vnp_Locale: this.globalDefaultConfig.vnp_Locale,
            vnp_Command: this.globalDefaultConfig.vnp_Command,
            vnp_OrderType: this.globalDefaultConfig.vnp_OrderType,
        };
    }
    /**
     *
     * @returns {Promise<Bank[]>} List of banks
     */
    getBankList() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield fetch((0, common_1.resolveUrlString)((_a = this.globalDefaultConfig.vnpayHost) !== null && _a !== void 0 ? _a : constants_1.VNPAY_GATEWAY_SANDBOX_HOST, constants_1.GET_BANK_LIST_ENDPOINT), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `tmn_code=${this.globalDefaultConfig.tmnCode}`,
            });
            const bankList = (yield response.json());
            for (const bank of bankList) {
                bank.logo_link = (0, common_1.resolveUrlString)((_b = this.globalDefaultConfig.vnpayHost) !== null && _b !== void 0 ? _b : constants_1.VNPAY_GATEWAY_SANDBOX_HOST, bank.logo_link.slice(1));
            }
            return bankList;
        });
    }
    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrl} data - Payload that contains the information to build the payment url
     * @returns {string} The payment url string
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
     */
    buildPaymentUrl(data, options) {
        var _a;
        const dataToBuild = Object.assign(Object.assign(Object.assign({}, this.defaultConfig), data), { 
            /**
             * Multiply by 100 to follow VNPay standard, see docs for more detail
             */
            vnp_Amount: data.vnp_Amount * 100 });
        if ((dataToBuild === null || dataToBuild === void 0 ? void 0 : dataToBuild.vnp_ExpireDate) && !(0, common_1.isValidVnpayDateFormat)(dataToBuild.vnp_ExpireDate)) {
            // Because the URL still works without vnp_ExpireDate, we keep it optional here.
            // TODO: make it required when VNPAY's `vnp_ExpireDate` is required
            throw new Error('Invalid vnp_ExpireDate format. use `formatDate` utility function to format it');
        }
        if (!(0, common_1.isValidVnpayDateFormat)((_a = dataToBuild === null || dataToBuild === void 0 ? void 0 : dataToBuild.vnp_CreateDate) !== null && _a !== void 0 ? _a : 0)) {
            const timeGMT7 = (0, common_1.getDateInGMT7)();
            dataToBuild.vnp_CreateDate = (0, common_1.dateFormat)(timeGMT7, 'yyyyMMddHHmmss');
        }
        const redirectUrl = (0, payment_util_1.createPaymentUrl)({
            config: this.globalDefaultConfig,
            data: dataToBuild,
        });
        const signed = (0, payment_util_1.calculateSecureHash)({
            secureSecret: this.globalDefaultConfig.secureSecret,
            data: redirectUrl.search.slice(1).toString(),
            hashAlgorithm: this.HASH_ALGORITHM,
            bufferEncode: this.BUFFER_ENCODE,
        });
        redirectUrl.searchParams.append('vnp_SecureHash', signed);
        if (this.isEnableLog) {
            const data2Log = Object.assign({ createdAt: new Date(), method: this.buildPaymentUrl.name, paymentUrl: (options === null || options === void 0 ? void 0 : options.withHash)
                    ? redirectUrl.toString()
                    : (() => {
                        const cloneUrl = new URL(redirectUrl.toString());
                        cloneUrl.searchParams.delete('vnp_SecureHash');
                        return cloneUrl.toString();
                    })() }, dataToBuild);
            this.logData(data2Log, options);
        }
        return redirectUrl.toString();
    }
    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
     * @returns {VerifyReturnUrl} The return object
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl
     */
    verifyReturnUrl(query, options) {
        var _a, _b, _c;
        const { vnp_SecureHash = '', vnp_SecureHashType } = query, cloneQuery = __rest(query, ["vnp_SecureHash", "vnp_SecureHashType"]);
        if (typeof (cloneQuery === null || cloneQuery === void 0 ? void 0 : cloneQuery.vnp_Amount) !== 'number') {
            const isValidAmount = constants_1.numberRegex.test((_a = cloneQuery === null || cloneQuery === void 0 ? void 0 : cloneQuery.vnp_Amount) !== null && _a !== void 0 ? _a : '');
            if (!isValidAmount) {
                throw new Error('Invalid amount');
            }
            cloneQuery.vnp_Amount = Number(cloneQuery.vnp_Amount);
        }
        const searchParams = (0, payment_util_1.buildPaymentUrlSearchParams)(cloneQuery);
        const isVerified = (0, payment_util_1.verifySecureHash)({
            secureSecret: this.globalDefaultConfig.secureSecret,
            data: searchParams.toString(),
            hashAlgorithm: this.HASH_ALGORITHM,
            receivedHash: vnp_SecureHash,
        });
        let outputResults = {
            isVerified,
            isSuccess: cloneQuery.vnp_ResponseCode === '00',
            message: (0, common_1.getResponseByStatusCode)((_c = (_b = cloneQuery.vnp_ResponseCode) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : '', this.globalDefaultConfig.vnp_Locale),
        };
        if (!isVerified) {
            outputResults = Object.assign(Object.assign({}, outputResults), { message: 'Wrong checksum' });
        }
        const result = Object.assign(Object.assign(Object.assign({}, cloneQuery), outputResults), { vnp_Amount: cloneQuery.vnp_Amount / 100 });
        if (this.isEnableLog) {
            const data2Log = Object.assign(Object.assign({ createdAt: new Date(), method: this.verifyReturnUrl.name }, result), { vnp_SecureHash: (options === null || options === void 0 ? void 0 : options.withHash) ? vnp_SecureHash : undefined });
            this.logData(data2Log, options);
        }
        return result;
    }
    /**
     * Phương thức xác thực tính đúng đắn của lời gọi ipn từ VNPay
     *
     * Sau khi nhận được lời gọi, hệ thống merchant cần xác thực dữ liệu nhận được từ VNPay, kiểm tra đơn hàng có hợp lệ không, kiểm tra số tiền thanh toán có đúng không.
     *
     * Sau đó phản hồi lại VNPay kết quả xác thực thông qua các `IpnResponse`
     *
     * @en Method to verify the ipn url from VNPay
     *
     * After receiving the call, the merchant system needs to verify the data received from VNPay, check if the order is valid, check if the payment amount is correct.
     *
     * Then respond to VNPay the verification result through the `IpnResponse`
     *
     * @param {ReturnQueryFromVNPay} query The object of data return from VNPay
     * @returns {VerifyIpnCall} The return object
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-ipn-url
     */
    verifyIpnCall(query, options) {
        const hash = query.vnp_SecureHash;
        const result = this.verifyReturnUrl(query, { logger: { loggerFn: utils_1.ignoreLogger } });
        if (this.isEnableLog) {
            let data2Log = Object.assign({ createdAt: new Date(), method: this.verifyIpnCall.name }, result);
            if (options === null || options === void 0 ? void 0 : options.withHash) {
                data2Log = Object.assign(Object.assign({}, data2Log), { vnp_SecureHash: hash });
            }
            this.logData(data2Log, options);
        }
        return result;
    }
    /**
     * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
     *
     * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
     *
     * @param {QueryDr} query - The data to query payment result
     * @returns {Promise<QueryDrResponse>} The data return from VNPay and after verified
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY
     */
    queryDr(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const command = 'querydr';
            const dataQuery = Object.assign({ vnp_Version: (_a = this.globalDefaultConfig.vnp_Version) !== null && _a !== void 0 ? _a : constants_1.VNP_VERSION }, query);
            const url = new URL((0, common_1.resolveUrlString)((_b = this.globalDefaultConfig.vnpayHost) !== null && _b !== void 0 ? _b : constants_1.VNPAY_GATEWAY_SANDBOX_HOST, constants_1.QUERY_DR_REFUND_ENDPOINT));
            const stringToCreateHash = [
                dataQuery.vnp_RequestId,
                dataQuery.vnp_Version,
                command,
                this.globalDefaultConfig.tmnCode,
                dataQuery.vnp_TxnRef,
                dataQuery.vnp_TransactionDate,
                dataQuery.vnp_CreateDate,
                dataQuery.vnp_IpAddr,
                dataQuery.vnp_OrderInfo,
            ]
                .map(String)
                .join('|')
                .replace(/undefined/g, '');
            const requestHashed = (0, common_1.hash)(this.globalDefaultConfig.secureSecret, Buffer.from(stringToCreateHash, this.BUFFER_ENCODE), this.HASH_ALGORITHM);
            const body = Object.assign(Object.assign({}, dataQuery), { vnp_Command: command, vnp_TmnCode: this.globalDefaultConfig.tmnCode, vnp_SecureHash: requestHashed });
            const response = yield fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = (yield response.json());
            const message = (0, common_1.getResponseByStatusCode)((_d = (_c = responseData.vnp_ResponseCode) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '', this.globalDefaultConfig.vnp_Locale, constants_1.QUERY_DR_RESPONSE_MAP);
            let outputResults = Object.assign(Object.assign({ isVerified: true, isSuccess: responseData.vnp_ResponseCode === '00' || responseData.vnp_ResponseCode === 0, message }, responseData), { vnp_Message: message });
            const stringToCreateHashOfResponse = [
                responseData.vnp_ResponseId,
                responseData.vnp_Command,
                responseData.vnp_ResponseCode,
                responseData.vnp_Message,
                this.defaultConfig.vnp_TmnCode,
                responseData.vnp_TxnRef,
                responseData.vnp_Amount,
                responseData.vnp_BankCode,
                responseData.vnp_PayDate,
                responseData.vnp_TransactionNo,
                responseData.vnp_TransactionType,
                responseData.vnp_TransactionStatus,
                responseData.vnp_OrderInfo,
                responseData.vnp_PromotionCode,
                responseData.vnp_PromotionAmount,
            ]
                .map(String)
                .join('|')
                .replace(/undefined/g, '');
            const responseHashed = (0, common_1.hash)(this.globalDefaultConfig.secureSecret, Buffer.from(stringToCreateHashOfResponse, this.BUFFER_ENCODE), this.HASH_ALGORITHM);
            if ((responseData === null || responseData === void 0 ? void 0 : responseData.vnp_SecureHash) && responseHashed !== responseData.vnp_SecureHash) {
                outputResults = Object.assign(Object.assign({}, outputResults), { isVerified: false, message: (0, common_1.getResponseByStatusCode)(constants_1.WRONG_CHECKSUM_KEY, this.globalDefaultConfig.vnp_Locale, constants_1.QUERY_DR_RESPONSE_MAP) });
            }
            if (this.isEnableLog) {
                const data2Log = Object.assign({ createdAt: new Date(), method: this.queryDr.name }, outputResults);
                this.logData(data2Log, options);
            }
            return outputResults;
        });
    }
    /**
     * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
     *
     * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
     * @param {Refund} data - The data to request refund
     * @returns The data return from VNPay
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
     */
    refund(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const vnp_Command = 'refund';
            const DEFAULT_TRANSACTION_NO_IF_NOT_EXIST = '0';
            const dataQuery = Object.assign(Object.assign({}, data), { vnp_Command, vnp_Version: this.globalDefaultConfig.vnp_Version, vnp_TmnCode: this.globalDefaultConfig.tmnCode, vnp_Amount: data.vnp_Amount * 100 });
            const { vnp_Version, vnp_TmnCode, vnp_RequestId, vnp_TransactionType, vnp_TxnRef, vnp_TransactionNo = '0', vnp_TransactionDate, vnp_CreateBy, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo, } = dataQuery;
            const url = new URL((0, common_1.resolveUrlString)((_a = this.globalDefaultConfig.vnpayHost) !== null && _a !== void 0 ? _a : constants_1.VNPAY_GATEWAY_SANDBOX_HOST, constants_1.QUERY_DR_REFUND_ENDPOINT));
            const stringToHashOfRequest = [
                vnp_RequestId,
                vnp_Version,
                vnp_Command,
                vnp_TmnCode,
                vnp_TransactionType,
                vnp_TxnRef,
                dataQuery.vnp_Amount,
                vnp_TransactionNo,
                vnp_TransactionDate,
                vnp_CreateBy,
                vnp_CreateDate,
                vnp_IpAddr,
                vnp_OrderInfo,
            ]
                .map(String)
                .join('|')
                .replace(/undefined/g, '');
            const requestHashed = (0, common_1.hash)(this.globalDefaultConfig.secureSecret, Buffer.from(stringToHashOfRequest, this.BUFFER_ENCODE), this.HASH_ALGORITHM);
            const body = Object.assign(Object.assign({}, dataQuery), { vnp_SecureHash: requestHashed });
            const response = yield fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = (yield response.json());
            if (responseData === null || responseData === void 0 ? void 0 : responseData.vnp_Amount) {
                responseData.vnp_Amount = responseData.vnp_Amount / 100;
            }
            const message = (0, common_1.getResponseByStatusCode)((_c = (_b = responseData.vnp_ResponseCode) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : '', (_d = data === null || data === void 0 ? void 0 : data.vnp_Locale) !== null && _d !== void 0 ? _d : this.globalDefaultConfig.vnp_Locale, constants_1.REFUND_RESPONSE_MAP);
            let outputResults = Object.assign(Object.assign({ isVerified: true, isSuccess: responseData.vnp_ResponseCode === '00' || responseData.vnp_ResponseCode === 0, message }, responseData), { vnp_Message: message });
            // Only check signed hash when request is not error
            if (Number(responseData.vnp_ResponseCode) <= 90 &&
                Number(responseData.vnp_ResponseCode) >= 99) {
                const stringToCreateHashOfResponse = [
                    responseData.vnp_ResponseId,
                    responseData.vnp_Command,
                    responseData.vnp_ResponseCode,
                    responseData.vnp_Message,
                    responseData.vnp_TmnCode,
                    responseData.vnp_TxnRef,
                    responseData.vnp_Amount,
                    responseData.vnp_BankCode,
                    responseData.vnp_PayDate,
                    (_e = responseData.vnp_TransactionNo) !== null && _e !== void 0 ? _e : DEFAULT_TRANSACTION_NO_IF_NOT_EXIST,
                    responseData.vnp_TransactionType,
                    responseData.vnp_TransactionStatus,
                    responseData.vnp_OrderInfo,
                ]
                    .map(String)
                    .join('|')
                    .replace(/undefined/g, '');
                const responseHashed = (0, common_1.hash)(this.globalDefaultConfig.secureSecret, Buffer.from(stringToCreateHashOfResponse, this.BUFFER_ENCODE), this.HASH_ALGORITHM);
                if ((responseData === null || responseData === void 0 ? void 0 : responseData.vnp_SecureHash) && responseHashed !== responseData.vnp_SecureHash) {
                    outputResults = Object.assign(Object.assign({}, outputResults), { isVerified: false, message: (0, common_1.getResponseByStatusCode)(constants_1.WRONG_CHECKSUM_KEY, this.globalDefaultConfig.vnp_Locale, constants_1.REFUND_RESPONSE_MAP) });
                }
            }
            if (this.isEnableLog) {
                const data2Log = Object.assign({ createdAt: new Date(), method: this.refund.name }, outputResults);
                this.logData(data2Log, options);
            }
            return outputResults;
        });
    }
    logData(data, options) {
        var _a;
        if ((options === null || options === void 0 ? void 0 : options.logger) && 'fields' in options.logger) {
            const { type, fields } = options.logger;
            for (const key of Object.keys(data)) {
                const keyAssert = key;
                if ((type === 'omit' && fields.includes(keyAssert)) ||
                    (type === 'pick' && !fields.includes(keyAssert))) {
                    delete data[keyAssert];
                }
            }
        }
        // Exec logger function, or default global logger
        (((_a = options === null || options === void 0 ? void 0 : options.logger) === null || _a === void 0 ? void 0 : _a.loggerFn) || this.globalLoggerFn)(data);
    }
}
exports.VNPay = VNPay;
