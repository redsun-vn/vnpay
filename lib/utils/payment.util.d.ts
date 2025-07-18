import type { HashAlgorithm } from '../enums';
import type { BuildPaymentUrl, DefaultConfig, GlobalConfig } from '../types';
export declare function buildPaymentUrlSearchParams(data: Record<string, unknown>): URLSearchParams;
export declare function createPaymentUrl({ config, data, }: {
    config: Pick<GlobalConfig, 'vnpayHost' | 'paymentEndpoint'>;
    data: (BuildPaymentUrl & DefaultConfig) | Record<string, unknown>;
}): URL;
export declare function calculateSecureHash({ bufferEncode, data, hashAlgorithm, secureSecret, }: {
    secureSecret: string;
    data: string;
    hashAlgorithm: HashAlgorithm;
    bufferEncode?: BufferEncoding;
}): string;
export declare function verifySecureHash({ data, hashAlgorithm, receivedHash, secureSecret, }: {
    secureSecret: string;
    data: string;
    hashAlgorithm: HashAlgorithm;
    receivedHash: string;
}): boolean;
