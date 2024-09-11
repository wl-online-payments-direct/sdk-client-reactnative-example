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
import 'react-native-reanimated';
import {
  AccountOnFile,
  PaymentProductField,
} from 'onlinepayments-sdk-client-reactnative';
import CardDetailTextInput from './CardDetailTextInput';
import { Constants } from '../constants/Constants';

interface Props {
  accountOnFile?: AccountOnFile;
  field: PaymentProductField;
  value?: string;
  errorMessage?: string;
  onValueChange: (newValue: string) => void;
}

function CardholderNameInputField({
  accountOnFile,
  field,
  value,
  errorMessage,
  onValueChange,
}: Props) {
  const [maskedValue, setMaskedValue] = useState<string>();

  const cardholderNameAccountOnFile = useMemo(
    () =>
      accountOnFile?.attributes.find(
        (attribute) => attribute.key === Constants.cardHolderFieldId
      )?.value,
    [accountOnFile?.attributes]
  );
  const cardholderNameValue = value ?? cardholderNameAccountOnFile;

  return (
    <CardDetailTextInput
      placeholder={field.displayHints?.label}
      value={maskedValue ?? cardholderNameValue}
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
      prefixIconSource="account"
    />
  );
}

export default React.memo(CardholderNameInputField, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.errorMessage === nextProps.errorMessage
  );
});
