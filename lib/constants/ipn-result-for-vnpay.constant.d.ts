/**
 * The response must to be sent to VNPAY after receiving the IPN request
 */
export type IpnResponse = {
    RspCode: string;
    Message: string;
};
export declare const IpnSuccess: IpnResponse;
export declare const IpnOrderNotFound: IpnResponse;
export declare const InpOrderAlreadyConfirmed: IpnResponse;
export declare const IpnInvalidAmount: IpnResponse;
export declare const IpnFailChecksum: IpnResponse;
export declare const IpnUnknownError: IpnResponse;
