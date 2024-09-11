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
import React, { useState } from 'react';
import 'react-native-reanimated';
import { PaymentProductField } from 'onlinepayments-sdk-client-reactnative';
import CardDetailTextInput from './CardDetailTextInput';

interface Props {
  field: PaymentProductField;
  value?: string;
  errorMessage?: string;
  onValueChange: (newValue: string) => void;
  openBottomSheet: (text: string) => void;
}

function CvvInputField({
  field,
  value,
  errorMessage,
  onValueChange,
  openBottomSheet,
}: Props) {
  const [maskedValue, setMaskedValue] = useState<string>();

  return (
    <CardDetailTextInput
      keyboardType="number-pad"
      placeholder={field.displayHints?.label}
      value={maskedValue ?? value}
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
      prefixIconSource="lock"
      suffixIconSource={'information-outline'}
      openBottomSheet={() =>
        openBottomSheet(field.displayHints?.tooltip?.label ?? '')
      }
    />
  );
}

export default React.memo(CvvInputField, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.errorMessage === nextProps.errorMessage
  );
});
