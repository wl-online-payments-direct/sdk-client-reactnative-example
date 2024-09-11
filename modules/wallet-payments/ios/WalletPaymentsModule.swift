/*
 * Do not remove or alter the notices in this preamble.
 *
 * This software is owned by Worldline and may not be be altered, copied, reproduced, republished,
 * uploaded, posted, transmitted or distributed in any way, without the prior written consent of Worldline.
 *
 * Copyright © 2024 Worldline and/or its affiliates.
 *
 * All rights reserved. License grant and user rights and obligations according to the applicable license agreement.
 *
 * Please contact Worldline for questions regarding license and user rights.
 */
 
import ExpoModulesCore

public class WalletPaymentsModule: Module {

  let applePayHandler = ApplePayHandler()

  public func definition() -> ModuleDefinition {
    Name("WalletPayments")

    // Event that is used to notify JavaScript that ApplePay was successful
    Events("onApplePaySuccess", "onApplePayFailure")

    AsyncFunction("startApplePayPayment") { (merchantId: String, networks: [String], countryCode: String, currencyCode: String, totalAmount: Int) in
        applePayHandler.showApplePayPaymentItem(
            merchantId: merchantId,
            networks: networks,
            countryCode: countryCode,
            currencyCode: currencyCode,
            totalAmount: totalAmount,
            onApplePaySuccess: { (encryptedPaymentData, transactionId) in
                // Send event to JavaScript that ApplePay was succesful and pass encryptedPaymentData and transactionId
                self.sendEvent("onApplePaySuccess", [
                  "encryptedPaymentData": encryptedPaymentData,
                  "transactionId": transactionId
                ])
            },
            onApplePayFailure: { errorMessage in
                // Send event to JavaScript that ApplePay failed
                self.sendEvent("onApplePayFailure", [
                  "errorMessage": errorMessage
                ])
            }
        )
    }
  }
}
