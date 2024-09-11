/*
 * Do not remove or alter the notices in this preamble.
 *
 * This software is owned by Worldline and may not be be altered, copied, reproduced, republished, uploaded, posted, transmitted or distributed in any way, without the prior written consent of Worldline.
 *
 * Copyright © 2024 Worldline and/or its affiliates.
 *
 * All rights reserved. License grant and user rights and obligations according to the applicable license agreement.
 *
 * Please contact Worldline for questions regarding license and user rights.
 */

import { EventEmitter, Subscription } from 'expo-modules-core';

import WalletPaymentsModule from './src/WalletPaymentsModule';
import { ApplePayEvent } from './src/ApplePayEvent';
import { GooglePayEvent } from './src/GooglePayEvent';
import { WalletPaymentFailureEvent } from './src/WalletPaymentFailureEvent';

const emitter = new EventEmitter(WalletPaymentsModule);

export async function startApplePayPayment(
  merchantId: string,
  networks: string[],
  countryCode: string,
  currencyCode: string,
  totalAmount: number
) {
  return await WalletPaymentsModule.startApplePayPayment(
    merchantId,
    networks,
    countryCode,
    currencyCode,
    totalAmount
  );
}

export function addApplePaySuccessListener(
  listener: (event: ApplePayEvent) => void
): Subscription {
  return emitter.addListener<ApplePayEvent>('onApplePaySuccess', listener);
}

export function addApplePayFailureListener(
  listener: (event: WalletPaymentFailureEvent) => void
): Subscription {
  return emitter.addListener<WalletPaymentFailureEvent>(
    'onApplePayFailure',
    listener
  );
}

export async function startGooglePayPayment(
  merchantId: string,
  merchantName: string,
  gateway: string,
  networks: string[],
  totalAmount: number,
  countryCode: string,
  currencyCode: string
) {
  return await WalletPaymentsModule.startGooglePayPayment(
    merchantId,
    merchantName,
    gateway,
    networks,
    totalAmount,
    countryCode,
    currencyCode
  );
}

export function addGooglePaySuccessListener(
  listener: (event: GooglePayEvent) => void
): Subscription {
  return emitter.addListener<GooglePayEvent>('onGooglePaySuccess', listener);
}

export function addGooglePayFailureListener(
  listener: (event: WalletPaymentFailureEvent) => void
): Subscription {
  return emitter.addListener<WalletPaymentFailureEvent>(
    'onGooglePayFailure',
    listener
  );
}
