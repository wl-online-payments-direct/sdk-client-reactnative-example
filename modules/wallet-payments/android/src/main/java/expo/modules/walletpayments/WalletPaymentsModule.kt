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

package expo.modules.walletpayments

import android.app.Activity
import expo.modules.kotlin.events.OnActivityResultPayload
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.android.gms.wallet.AutoResolveHelper
import com.google.android.gms.wallet.PaymentData
import org.json.JSONException
import org.json.JSONObject

class WalletPaymentsModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("WalletPayments")

    // Event that is used to notify JavaScript the status of the GooglePay payment
    Events("onGooglePaySuccess", "onGooglePayFailure", "onGooglePayCancel")

    AsyncFunction("startGooglePayPayment") {
      merchantId: String,
      merchantName: String,
      gateway: String,
      networks: List<String>,
      totalAmount: Long,
      countryCode: String,
      currencyCode: String ->
        val activity = appContext.currentActivity ?: throw Exceptions.MissingActivity()
        val googlePayHandler = GooglePayHandler(activity, merchantId, merchantName, gateway, networks)
        googlePayHandler.startGooglePayPayment(totalAmount, countryCode, currencyCode) { errorMessage ->
          sendEvent(
            "onGooglePayFailure", mapOf(
              "errorMessage" to errorMessage
            )
          )
        }
    }

    // Used to receive the result of the GooglePay payment sheet
    OnActivityResult { _, payload ->
      handleActivityResult(payload)
    }
  }

  private fun handleActivityResult(payload: OnActivityResultPayload) {
    if (payload.requestCode != GooglePayHandler.GOOGLE_PAY_REQUEST_CODE) {
      return
    }

    when (payload.resultCode) {
      Activity.RESULT_OK ->
        payload.data?.let { intent ->
          PaymentData.getFromIntent(intent)?.let(::handleGooglePaySuccess)
        }
      Activity.RESULT_CANCELED -> sendEvent("onGooglePayCancel")
      AutoResolveHelper.RESULT_ERROR -> {
        AutoResolveHelper.getStatusFromIntent(payload.data)?.let { status ->
          sendEvent(
            "onGooglePayFailure", mapOf(
              "errorMessage" to "GooglePay failed with error code: ${status.statusCode}"
            )
          )
        }
      }
    }
  }

  private fun handleGooglePaySuccess(paymentData: PaymentData) {
    val paymentInformation = paymentData.toJson()

    try {
      // Token will be null if PaymentDataRequest was not constructed using fromJson(String) (see GooglePayHandler).
      val googlePayToken = JSONObject(paymentInformation)
        .getJSONObject("paymentMethodData")
        .getJSONObject("tokenizationData").getString("token")

      // Send event to JavaScript that GooglePay was successful and pass token
      sendEvent("onGooglePaySuccess", mapOf(
        "token" to googlePayToken
      ))
    } catch (exception: JSONException) {
      sendEvent(
        "onGooglePayFailure", mapOf(
          "errorMessage" to "GooglePay failed with error: ${exception.message}"
        )
      )
    }
  }
}
