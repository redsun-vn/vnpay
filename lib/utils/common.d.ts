import { type BinaryLike } from 'node:crypto';
import { type HashAlgorithm, VnpLocale } from '../enums';
export declare function getDateInGMT7(date?: Date): Date;
/**
 * Định dạng lại ngày theo định dạng của VNPay, mặc định là yyyyMMddHHmmss
 * @en Format date to VNPay format, default is yyyyMMddHHmmss
 *
 * @param date date to format
 * @param format format of date
 * @returns formatted date
 */
export declare function dateFormat(date: Date, format?: string): number;
/**
 * Parse a vnpay date format number to date
 * @param dateNumber An vnpay date format number
 * @returns Date
 */
export declare function parseDate(dateNumber: number | string, tz?: 'utc' | 'local' | 'gmt7'): Date;
/**
 * Validate if the date is match with format `yyyyMMddHHmmss` or not
 * @param date The date to be validated
 * @returns True if the date is valid, false otherwise
 */
export declare function isValidVnpayDateFormat(date: number): boolean;
export declare function generateRandomString(length: number, options?: {
    onlyNumber?: boolean;
}): string;
/**
 * Lấy thông tin response theo mã response
 * @en Get response message by response code
 *
 * @param responseCode response code from VNPay
 * @param locale locale of response text
 * @param responseMap map of response code and response text if you want to custom
 * @returns message of response code
 */
export declare function getResponseByStatusCode(responseCode?: string, locale?: VnpLocale, responseMap?: Map<string, Record<VnpLocale, string>>): string;
export declare function resolveUrlString(host: string, path: string): string;
export declare function hash(secret: string, data: BinaryLike, algorithm: HashAlgorithm): string;
