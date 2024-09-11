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
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import { styles } from '@/styles/Style';
import { AmountOfMoney } from 'onlinepayments-sdk-client-reactnative';
import { PaymentDetailsValidation } from './models/Validation';
import RequiredTextInput from '../reusable_components/RequiredTextInput';
import { Strings } from '../constants/Strings';

interface Props {
  amountOfMoney: AmountOfMoney;
  countryCode: string;
  errors: PaymentDetailsValidation;
  setAmountInCents: (amount: string) => void;
  setCountryCode: (countryCode: string) => void;
  setCurrencyCode: (currencyCode: string) => void;
  openBottomSheet: (text: string) => void;
}

function PaymentDetailsInput({
  amountOfMoney,
  countryCode,
  errors,
  setAmountInCents,
  setCountryCode,
  setCurrencyCode,
  openBottomSheet,
}: Props) {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>{Strings.paymentDetailsHeader}</Text>
      <RequiredTextInput
        keyboardType="number-pad"
        placeholder={Strings.amountInCentsLabel}
        value={amountOfMoney.amount.toString()}
        onChangeText={(value) => setAmountInCents(value)}
        hasError={errors.amountValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.amountInCentsTooltip)}
      />
      <RequiredTextInput
        placeholder={Strings.countryCodeLabel}
        value={countryCode}
        onChangeText={(value) => setCountryCode(value)}
        hasError={errors.countryCodeValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.countryCodeTooltip)}
      />
      <RequiredTextInput
        placeholder={Strings.currencyCodeLabel}
        value={amountOfMoney.currencyCode}
        onChangeText={(value) => setCurrencyCode(value)}
        hasError={errors.currencyCodeValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.currencyCodeTooltip)}
      />
    </View>
  );
}

export default React.memo(PaymentDetailsInput, (prevProps, nextProps) => {
  return (
    prevProps.amountOfMoney === nextProps.amountOfMoney &&
    prevProps.countryCode === nextProps.countryCode &&
    prevProps.errors === nextProps.errors
  );
});
