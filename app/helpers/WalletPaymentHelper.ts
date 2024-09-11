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

import {
  PaymentProduct,
  PaymentRequest,
} from 'onlinepayments-sdk-client-reactnative';
import {
  startApplePayPayment,
  addApplePaySuccessListener,
  addApplePayFailureListener,
  startGooglePayPayment,
  addGooglePaySuccessListener,
  addGooglePayFailureListener,
} from '../../modules/wallet-payments';
import { PaymentDetails } from '../session_payment_configuration/models/PaymentDetails';
import { Strings } from '../constants/Strings';

export class WalletPaymentHelper {
  static startApplePayPayment(
    paymentProduct: PaymentProduct,
    paymentDetails: PaymentDetails,
    onApplePaySuccess: (paymentRequest: PaymentRequest) => void,
    onApplePayFailure: (message: string) => void
  ) {
    const networks = paymentProduct.paymentProduct302SpecificData?.networks;
    const paymentContext = paymentDetails.paymentContext;
    const merchantId = paymentDetails.merchantId;

    const applePaySuccessSubscription = addApplePaySuccessListener(
      ({ encryptedPaymentData, transactionId }) => {
        // Apple Pay was completed, now create PaymentRequest
        const request = new PaymentRequest(paymentProduct);
        request.setValue('encryptedPaymentData', encryptedPaymentData);
        request.setValue('transactionId', transactionId);

        onApplePaySuccess(request);
        applePaySuccessSubscription.remove();
      }
    );

    const applePayFailureSubscription = addApplePayFailureListener(
      ({ errorMessage }) => {
        // Apple Pay failed
        onApplePayFailure(errorMessage);
        applePayFailureSubscription.remove();
      }
    );

    if (networks === undefined) {
      onApplePayFailure(Strings.noInformationNetworksMessage);
    } else if (merchantId === undefined) {
      onApplePayFailure(Strings.merchantIdNotFoundMessage);
    } else {
      startApplePayPayment(
        merchantId,
        networks,
        paymentContext.countryCode,
        paymentContext.amountOfMoney.currencyCode,
        paymentContext.amountOfMoney.amount
      );
    }
  }

  static startGooglePayPayment(
    paymentProduct: PaymentProduct,
    paymentDetails: PaymentDetails,
    onGooglePaySuccess: (paymentRequest: PaymentRequest) => void,
    onGooglePayFailure: (message: string) => void
  ) {
    const gateway = paymentProduct.paymentProduct320SpecificData?.gateway;
    const networks = paymentProduct.paymentProduct320SpecificData?.networks;
    const paymentContext = paymentDetails.paymentContext;
    const merchantId = paymentDetails.merchantId;
    const merchantName = paymentDetails.merchantName;

    const googlePaySuccessSubscription = addGooglePaySuccessListener(
      ({ token }) => {
        // Google Pay was completed, now create PaymentRequest
        const request = new PaymentRequest(paymentProduct);
        request.setValue('encryptedPaymentData', token);

        onGooglePaySuccess(request);
        googlePaySuccessSubscription.remove();
      }
    );

    const googlePayFailureSubscription = addGooglePayFailureListener(
      ({ errorMessage }) => {
        // Google Pay failed
        onGooglePayFailure(errorMessage);
        googlePayFailureSubscription.remove();
      }
    );

    if (gateway === undefined) {
      onGooglePayFailure(Strings.noInformationGatewayMessage);
    } else if (networks === undefined) {
      onGooglePayFailure(Strings.noInformationNetworksMessage);
    } else if (merchantId === undefined) {
      onGooglePayFailure(Strings.merchantIdNotFoundMessage);
    } else if (merchantName === undefined) {
      onGooglePayFailure(Strings.merchantNameNotFoundMessage);
    } else {
      startGooglePayPayment(
        merchantId,
        merchantName,
        gateway,
        networks,
        paymentContext.amountOfMoney.amount,
        paymentContext.countryCode,
        paymentContext.amountOfMoney.currencyCode
      );
    }
  }
}
