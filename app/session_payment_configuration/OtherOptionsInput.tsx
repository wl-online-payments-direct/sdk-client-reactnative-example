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

// @ts-ignore
import React from 'react';
import { Platform, Text, View } from 'react-native';
import 'react-native-reanimated';
import { IconButton } from 'react-native-paper';
import { styles } from '@/styles/Style';
import MerchantIdInput from './MerchantIdInput';
import MerchantNameInput from './MerchantNameInput';
import { PaymentDetails } from './models/PaymentDetails';
import { OtherOptionsValidation } from './models/Validation';
import DefaultSwitch from '../reusable_components/DefaultSwitch';
import { Strings } from '../constants/Strings';

interface Props {
  paymentDetails: PaymentDetails;
  loggingEnabled: boolean;
  errors: OtherOptionsValidation;
  setApplePayEnabled: () => void;
  setGooglePayEnabled: () => void;
  setPaymentIsRecurring: () => void;
  setMerchantId: (id: string) => void;
  setMerchantName: (name: string) => void;
  setLoggingEnabled: () => void;
  openBottomSheet: (text: string) => void;
}

function OtherOptionsInput({
  paymentDetails,
  loggingEnabled,
  errors,
  setApplePayEnabled,
  setGooglePayEnabled,
  setPaymentIsRecurring,
  setMerchantId,
  setMerchantName,
  setLoggingEnabled,
  openBottomSheet,
}: Props) {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>{Strings.otherOptionsHeader}</Text>
      <View style={styles.row}>
        <View style={styles.textWithTooltip}>
          <Text style={styles.defaultText}>
            {Strings.recurringPaymentLabel}
          </Text>
          <IconButton
            icon="information-outline"
            onPress={() => {
              openBottomSheet(Strings.recurringPaymentTooltip);
            }}
          />
        </View>
        <DefaultSwitch
          value={paymentDetails.paymentContext.isRecurring}
          onValueChange={setPaymentIsRecurring}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.textWithTooltip}>
          <Text style={styles.defaultText}>{Strings.enableLoggingLabel}</Text>
          <IconButton
            icon="information-outline"
            onPress={() => {
              openBottomSheet(Strings.enableLoggingTooltip);
            }}
          />
        </View>
        <DefaultSwitch
          value={loggingEnabled}
          onValueChange={setLoggingEnabled}
        />
      </View>
      {Platform.OS === 'ios' && (
        <View style={styles.row}>
          <Text style={styles.defaultText}>{Strings.applePayLabel}</Text>
          <DefaultSwitch
            value={paymentDetails.applePayEnabled}
            onValueChange={setApplePayEnabled}
          />
        </View>
      )}
      {paymentDetails.applePayEnabled && !paymentDetails.googlePayEnabled && (
        <MerchantIdInput
          hasError={errors.merchantIdValid}
          setMerchantId={(id) => setMerchantId(id)}
          openBottomSheet={(bottomSheetText) =>
            openBottomSheet(bottomSheetText)
          }
          merchantId={paymentDetails.merchantId}
        />
      )}
      <View style={styles.row}>
        <Text style={styles.defaultText}>{Strings.googlePayLabel}</Text>
        <DefaultSwitch
          value={paymentDetails.googlePayEnabled}
          onValueChange={setGooglePayEnabled}
        />
      </View>
      {paymentDetails.googlePayEnabled && (
        <View style={styles.contentContainer}>
          <MerchantIdInput
            hasError={errors.merchantIdValid}
            setMerchantId={(id) => setMerchantId(id)}
            openBottomSheet={(bottomSheetText) =>
              openBottomSheet(bottomSheetText)
            }
            merchantId={paymentDetails.merchantId}
          />
          <MerchantNameInput
            hasError={errors.merchantNameValid}
            setMerchantName={(name) => setMerchantName(name)}
            openBottomSheet={(bottomSheetText) =>
              openBottomSheet(bottomSheetText)
            }
            merchantName={paymentDetails.merchantName}
          />
        </View>
      )}
    </View>
  );
}

export default React.memo(OtherOptionsInput, (prevProps, nextProps) => {
  return (
    prevProps.paymentDetails.applePayEnabled ===
      nextProps.paymentDetails.applePayEnabled &&
    prevProps.paymentDetails.googlePayEnabled ===
      nextProps.paymentDetails.googlePayEnabled &&
    prevProps.paymentDetails.paymentContext.isRecurring ===
      nextProps.paymentDetails.paymentContext.isRecurring &&
    prevProps.paymentDetails.merchantId ===
      nextProps.paymentDetails.merchantId &&
    prevProps.paymentDetails.merchantName ===
      nextProps.paymentDetails.merchantName &&
    prevProps.loggingEnabled === nextProps.loggingEnabled &&
    prevProps.errors === nextProps.errors
  );
});
