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

import {
  PaymentProduct,
  PaymentRequest,
} from 'onlinepayments-sdk-client-reactnative';
import {
  startApplePayPayment,
  addApplePaySuccessListener,
  addApplePayFailureListener,
  addApplePayCancelListener,
  startGooglePayPayment,
  addGooglePaySuccessListener,
  addGooglePayFailureListener,
  addGooglePayCancelListener,
} from '@/modules/wallet-payments';
import { PaymentDetails } from '../session_payment_configuration/models/PaymentDetails';
import { Strings } from '../constants/Strings';

export class WalletPaymentHelper {
  static startApplePayPayment(
    paymentProduct: PaymentProduct,
    paymentDetails: PaymentDetails,
    onApplePaySuccess: (paymentRequest: PaymentRequest) => void,
    onApplePayFailure: (error: unknown) => void
  ) {
    const networks = paymentProduct.paymentProduct302SpecificData?.networks;
    const paymentContext = paymentDetails.paymentContext;
    const merchantId = paymentDetails.merchantId;

    if (networks === undefined) {
      onApplePayFailure(Strings.noInformationNetworksMessage);
      return;
    }
    if (merchantId === undefined) {
      onApplePayFailure(Strings.merchantIdNotFoundMessage);
      return;
    }

    const removeSubscriptions = () => {
      successSubscription.remove();
      failureSubscription.remove();
      cancelSubscription.remove();
    };

    const successSubscription = addApplePaySuccessListener(
      ({ encryptedPaymentData, transactionId }) => {
        removeSubscriptions();
        try {
          // Apple Pay was completed, now create PaymentRequest
          const request = new PaymentRequest(paymentProduct);
          request.setValue('encryptedPaymentData', encryptedPaymentData);
          // Only set the transaction id if the payment product contains this field
          if (paymentProduct.getField('transactionId') !== undefined) {
            request.setValue('transactionId', transactionId);
          }

          onApplePaySuccess(request);
        } catch (error) {
          onApplePayFailure(error);
        }
      }
    );

    const failureSubscription = addApplePayFailureListener(
      ({ errorMessage }) => {
        // Apple Pay failed
        removeSubscriptions();
        onApplePayFailure(errorMessage);
      }
    );

    const cancelSubscription = addApplePayCancelListener(removeSubscriptions);

    startApplePayPayment(
      merchantId,
      networks,
      paymentContext.countryCode,
      paymentContext.amountOfMoney.currencyCode,
      paymentContext.amountOfMoney.amount ?? 0
    );
  }

  static startGooglePayPayment(
    paymentProduct: PaymentProduct,
    paymentDetails: PaymentDetails,
    onGooglePaySuccess: (paymentRequest: PaymentRequest) => void,
    onGooglePayFailure: (error: unknown) => void
  ) {
    const gateway = paymentProduct.paymentProduct320SpecificData?.gateway;
    const networks = paymentProduct.paymentProduct320SpecificData?.networks;
    const paymentContext = paymentDetails.paymentContext;
    const merchantId = paymentDetails.merchantId;
    const merchantName = paymentDetails.merchantName;

    if (gateway === undefined) {
      onGooglePayFailure(Strings.noInformationGatewayMessage);
      return;
    }
    if (networks === undefined) {
      onGooglePayFailure(Strings.noInformationNetworksMessage);
      return;
    }
    if (merchantId === undefined) {
      onGooglePayFailure(Strings.merchantIdNotFoundMessage);
      return;
    }
    if (merchantName === undefined) {
      onGooglePayFailure(Strings.merchantNameNotFoundMessage);
      return;
    }

    const removeSubscriptions = () => {
      successSubscription.remove();
      failureSubscription.remove();
      cancelSubscription.remove();
    };

    const successSubscription = addGooglePaySuccessListener(({ token }) => {
      removeSubscriptions();
      try {
        // Google Pay was completed, now create PaymentRequest
        const request = new PaymentRequest(paymentProduct);
        request.setValue('encryptedPaymentData', token);

        onGooglePaySuccess(request);
      } catch (error) {
        onGooglePayFailure(error);
      }
    });

    const failureSubscription = addGooglePayFailureListener(
      ({ errorMessage }) => {
        // Google Pay failed
        removeSubscriptions();
        onGooglePayFailure(errorMessage);
      }
    );

    const cancelSubscription = addGooglePayCancelListener(removeSubscriptions);

    startGooglePayPayment(
      merchantId,
      merchantName,
      gateway,
      networks,
      paymentContext.amountOfMoney.amount ?? 0,
      paymentContext.countryCode,
      paymentContext.amountOfMoney.currencyCode
    );
  }
}
