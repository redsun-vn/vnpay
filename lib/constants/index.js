"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURR_CODE_VND = exports.VNP_DEFAULT_COMMAND = exports.VNP_VERSION = void 0;
__exportStar(require("./response-map.constant"), exports);
__exportStar(require("./api-endpoint.constant"), exports);
__exportStar(require("./ipn-result-for-vnpay.constant"), exports);
__exportStar(require("./regex.constant"), exports);
exports.VNP_VERSION = '2.1.0';
exports.VNP_DEFAULT_COMMAND = 'pay';
exports.CURR_CODE_VND = 'VND';
