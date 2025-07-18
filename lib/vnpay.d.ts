import type { BuildPaymentUrl, BuildPaymentUrlLogger, BuildPaymentUrlOptions, ReturnQueryFromVNPay, VNPayConfig, VerifyIpnCall, VerifyIpnCallLogger, VerifyIpnCallOptions, VerifyReturnUrl, VerifyReturnUrlLogger, VerifyReturnUrlOptions } from './types';
import type { Bank } from './types/bank.type';
import type { DefaultConfig } from './types/common.type';
import type { QueryDr, QueryDrResponse, QueryDrResponseLogger, QueryDrResponseOptions } from './types/query-dr.type';
import type { Refund, RefundOptions, RefundResponse, RefundResponseLogger } from './types/refund.type';
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
export declare class VNPay {
    private globalDefaultConfig;
    private HASH_ALGORITHM;
    private BUFFER_ENCODE;
    private isEnableLog;
    private readonly globalLoggerFn;
    constructor({ vnpayHost, vnp_Version, vnp_CurrCode, vnp_Locale, testMode, paymentEndpoint, ...config }: VNPayConfig);
    /**
     * Lấy cấu hình mặc định của VNPay
     * @en Get default config of VNPay
     */
    get defaultConfig(): DefaultConfig;
    /**
     *
     * @returns {Promise<Bank[]>} List of banks
     */
    getBankList(): Promise<Bank[]>;
    /**
     * Phương thức xây dựng, tạo thành url thanh toán của VNPay
     * @en Build the payment url
     *
     * @param {BuildPaymentUrl} data - Payload that contains the information to build the payment url
     * @returns {string} The payment url string
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
     */
    buildPaymentUrl<LoggerFields extends keyof BuildPaymentUrlLogger>(data: BuildPaymentUrl, options?: BuildPaymentUrlOptions<LoggerFields>): string;
    /**
     * Phương thức xác thực tính đúng đắn của các tham số trả về từ VNPay
     * @en Method to verify the return url from VNPay
     *
     * @param {ReturnQueryFromVNPay} query - The object of data return from VNPay
     * @returns {VerifyReturnUrl} The return object
     * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#code-returnurl
     */
    verifyReturnUrl<LoggerFields extends keyof VerifyReturnUrlLogger>(query: ReturnQueryFromVNPay, options?: VerifyReturnUrlOptions<LoggerFields>): VerifyReturnUrl;
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
    verifyIpnCall<LoggerFields extends keyof VerifyIpnCallLogger>(query: ReturnQueryFromVNPay, options?: VerifyIpnCallOptions<LoggerFields>): VerifyIpnCall;
    /**
     * Đây là API để hệ thống merchant truy vấn kết quả thanh toán của giao dịch tại hệ thống VNPAY.
     *
     * @en This is the API for the merchant system to query the payment result of the transaction at the VNPAY system.
     *
     * @param {QueryDr} query - The data to query payment result
     * @returns {Promise<QueryDrResponse>} The data return from VNPay and after verified
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#truy-van-ket-qua-thanh-toan-PAY
     */
    queryDr<LoggerFields extends keyof QueryDrResponseLogger>(query: QueryDr, options?: QueryDrResponseOptions<LoggerFields>): Promise<QueryDrResponse>;
    /**
     * Đây là API để hệ thống merchant gửi yêu cầu hoàn tiền cho giao dịch qua hệ thống Cổng thanh toán VNPAY.
     *
     * @en This is the API for the merchant system to refund the transaction at the VNPAY system.
     * @param {Refund} data - The data to request refund
     * @returns The data return from VNPay
     * @see https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
     */
    refund<LoggerFields extends keyof RefundResponseLogger>(data: Refund, options?: RefundOptions<LoggerFields>): Promise<RefundResponse>;
    private logData;
}
