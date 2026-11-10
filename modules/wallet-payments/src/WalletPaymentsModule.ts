/*
 * Do not remove or alter the notices in this preamble.
 *
 * This software is owned by Worldline and may not be be altered, copied, reproduced, republished, uploaded, posted, transmitted or distributed in any way, without the prior written consent of Worldline.
 *
 * Copyright © 2026 Worldline and/or its affiliates.
 *
 * All rights reserved. License grant and user rights and obligations according to the applicable license agreement.
 *
 * Please contact Worldline for questions regarding license and user rights.
 */

import { NativeModule, requireNativeModule } from 'expo';
import { ApplePayEvent } from './ApplePayEvent';
import { GooglePayEvent } from './GooglePayEvent';
import { WalletPaymentFailureEvent } from './WalletPaymentFailureEvent';

export type WalletPaymentsEvents = {
  onApplePaySuccess: (event: ApplePayEvent) => void;
  onApplePayFailure: (event: WalletPaymentFailureEvent) => void;
  onApplePayCancel: () => void;
  onGooglePaySuccess: (event: GooglePayEvent) => void;
  onGooglePayFailure: (event: WalletPaymentFailureEvent) => void;
  onGooglePayCancel: () => void;
};

declare class WalletPaymentsModule extends NativeModule<WalletPaymentsEvents> {
  startApplePayPayment(
    merchantId: string,
    networks: string[],
    countryCode: string,
    currencyCode: string,
    totalAmount: number
  ): Promise<void>;

  startGooglePayPayment(
    merchantId: string,
    merchantName: string,
    gateway: string,
    networks: string[],
    totalAmount: number,
    countryCode: string,
    currencyCode: string
  ): Promise<void>;
}

// Loads the native module object from the JSI
export default requireNativeModule<WalletPaymentsModule>('WalletPayments');
