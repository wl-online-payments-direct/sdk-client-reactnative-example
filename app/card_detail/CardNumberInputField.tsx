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
import React, { useMemo, useState } from 'react';
import { Image } from 'react-native';
import 'react-native-reanimated';
import {
  AccountOnFile,
  PaymentProductField,
} from 'onlinepayments-sdk-client-reactnative';
import { styles } from '@/styles/Style';
import CardDetailTextInput from './CardDetailTextInput';
import { Constants } from '../constants/Constants';

interface Props {
  accountOnFile?: AccountOnFile;
  field: PaymentProductField;
  logoUrl?: string;
  value?: string;
  errorMessage?: string;
  onValueChange: (newValue: string) => void;
}

function CardNumberInputField({
  accountOnFile,
  field,
  logoUrl,
  value,
  errorMessage,
  onValueChange,
}: Props) {
  const [maskedValue, setMaskedValue] = useState<string>();

  const cardNumberAccountOnFile = useMemo(
    () =>
      accountOnFile?.attributes.find(
        (attribute) => attribute.key === Constants.cardFieldId
      )?.value,
    [accountOnFile?.attributes]
  );
  const cardNumberValue = value ?? cardNumberAccountOnFile;

  return (
    <CardDetailTextInput
      editable={accountOnFile === undefined}
      keyboardType="number-pad"
      placeholder={field.displayHints?.label}
      value={maskedValue ?? cardNumberValue}
      onChangeText={(newValue) => onValueChange(newValue)}
      onFocus={() => setMaskedValue(undefined)}
      onFocusLost={(unmaskedValue) => {
        if (unmaskedValue !== undefined) {
          field
            .applyMask(unmaskedValue)
            .then((newMaskedValue) => setMaskedValue(newMaskedValue));
        }
      }}
      errorMessage={errorMessage}
      prefixIconSource="credit-card-outline"
      suffixIconSource={renderCardProductLogo}
    />
  );

  function renderCardProductLogo() {
    return <Image style={styles.cardProductLogo} source={{ uri: logoUrl }} />;
  }
}

export default React.memo(CardNumberInputField, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.logoUrl === nextProps.logoUrl &&
    prevProps.errorMessage === nextProps.errorMessage
  );
});
