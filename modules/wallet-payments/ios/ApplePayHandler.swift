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

import Foundation
import PassKit
import SwiftUI

class ApplePayHandler: NSObject, PKPaymentAuthorizationViewControllerDelegate {

    private var summaryItems: [PKPaymentSummaryItem] = []
    private var onApplePaySuccess: ((String, String) -> Void)?
    private var onApplePayFailure: ((String) -> Void)?
    private var onApplePayCancel: (() -> Void)?
    private var didSendResult = false

    func showApplePayPaymentItem(
        merchantId: String,
        networks: [String],
        countryCode: String,
        currencyCode: String,
        totalAmount: Int,
        onApplePaySuccess: @escaping ((String, String) -> Void),
        onApplePayFailure: @escaping((String) -> Void),
        onApplePayCancel: @escaping (() -> Void)
    ) {
        self.onApplePaySuccess = onApplePaySuccess
        self.onApplePayFailure = onApplePayFailure
        self.onApplePayCancel = onApplePayCancel
        self.didSendResult = false

        guard PKPaymentAuthorizationViewController.canMakePayments() else {
            sendFailure("Apple Pay is not available on this device")
            return
        }

        let availableNetworks = networks.map { PKPaymentNetwork(rawValue: $0) }

        self.showApplePaySheet(
            merchantId: merchantId,
            countryCode: countryCode,
            currencyCode: currencyCode,
            totalAmount: totalAmount,
            withAvailableNetworks: availableNetworks
        )
    }

    private func showApplePaySheet(
        merchantId: String,
        countryCode: String,
        currencyCode: String,
        totalAmount: Int,
        withAvailableNetworks paymentNetworks: [PKPaymentNetwork]
    ) {
        generateSummaryItems(totalAmount: totalAmount)

        let paymentRequest = PKPaymentRequest()
        paymentRequest.countryCode = countryCode
        paymentRequest.currencyCode = currencyCode
        paymentRequest.supportedNetworks = paymentNetworks
        paymentRequest.paymentSummaryItems = summaryItems
        paymentRequest.merchantCapabilities = [.capability3DS, .capabilityDebit, .capabilityCredit]

        // This merchant id is set in the merchants apple developer portal and is linked to a certificate
        paymentRequest.merchantIdentifier = merchantId

        // These shipping contact fields are optional and can be chosen by the merchant
        // paymentRequest.requiredShippingContactFields = [.name, .postalAddress]
        let authorizationViewController = PKPaymentAuthorizationViewController(paymentRequest: paymentRequest)
        authorizationViewController?.delegate = self

        // The authorizationViewController will be nil if the paymentRequest was incomplete or not created correctly
        guard let authorizationViewController else {
            sendFailure("Could not create the Apple Pay payment request")
            return
        }

        guard PKPaymentAuthorizationViewController.canMakePayments(usingNetworks: paymentNetworks) else {
            sendFailure("Apple Pay is not available for the supported networks")
            return
        }

        guard let rootViewController = UIApplication.shared.rootViewController else {
            sendFailure("Could not present the Apple Pay payment sheet")
            return
        }

        rootViewController.present(authorizationViewController, animated: true, completion: nil)
    }

    private func generateSummaryItems(totalAmount: Int) {
        var summaryItems = [PKPaymentSummaryItem]()

        summaryItems.append(
            PKPaymentSummaryItem(
                label: "Merchant Name",
                amount: NSDecimalNumber(mantissa: UInt64(totalAmount), exponent: -2, isNegative: false),
                type: .final
            )
        )

        self.summaryItems = summaryItems
    }

    func paymentAuthorizationViewController(
        _ controller: PKPaymentAuthorizationViewController,
        didAuthorizePayment payment: PKPayment,
        completion: @escaping (PKPaymentAuthorizationStatus) -> Void
    ) {
        guard let paymentDataString = String(data: payment.token.paymentData, encoding: String.Encoding.utf8) else {
            sendFailure("Could not encode paymentData")
            completion(.failure)
            return
        }

        didSendResult = true
        onApplePaySuccess?(paymentDataString, payment.token.transactionIdentifier)
        completion(.success)
    }

    func paymentAuthorizationViewControllerDidFinish(_ controller: PKPaymentAuthorizationViewController) {
        controller.dismiss(animated: true, completion: { return })

        if !didSendResult {
            didSendResult = true
            onApplePayCancel?()
        }
    }

    private func sendFailure(_ errorMessage: String) {
        didSendResult = true
        onApplePayFailure?(errorMessage)
    }

    func paymentAuthorizationViewController(
        _ controller: PKPaymentAuthorizationViewController,
        didSelect paymentMethod: PKPaymentMethod,
        completion: @escaping ([PKPaymentSummaryItem]) -> Void
    ) {
        completion(summaryItems)
    }
}
