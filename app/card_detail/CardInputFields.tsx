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
import 'react-native-reanimated';
import { View } from 'react-native';
import { styles } from '@/styles/Style';
import {
  AccountOnFile,
  PaymentProductField,
} from 'onlinepayments-sdk-client-reactnative';
import CardNumberInputField from './CardNumberInputField';
import { CardFieldsInput } from './models/CardFieldsInput';
import ExpiryDateInputField from './ExpiryDateInputField';
import CvvInputField from './CvvInputField';
import SecurityCodeInputField from './SecurityCodeInputField';
import CardholderNameInputField from './CardholderNameInputField';
import { CardFieldsErrors } from './models/CardFieldsErrors';

interface Props {
  cardField?: PaymentProductField;
  expiryDateField?: PaymentProductField;
  cvvField?: PaymentProductField;
  securityCodeField?: PaymentProductField;
  cardholderField?: PaymentProductField;
  accountOnFile?: AccountOnFile;
  logoUrl?: string;
  fieldsInput: CardFieldsInput;
  errors: CardFieldsErrors;
  onCardNumberChange: (value: string) => void;
  onExpiryDateChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onSecurityCodeChange: (value: string) => void;
  onCardholderNameChange: (value: string) => void;
  openBottomSheet: (text: string) => void;
}

function CardInputFields({
  cardField,
  expiryDateField,
  cvvField,
  securityCodeField,
  cardholderField,
  accountOnFile,
  logoUrl,
  fieldsInput,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  onSecurityCodeChange,
  onCardholderNameChange,
  openBottomSheet,
}: Props) {
  return (
    <View style={styles.contentContainer}>
      {cardField !== undefined && (
        <CardNumberInputField
          accountOnFile={accountOnFile}
          field={cardField}
          logoUrl={logoUrl}
          value={fieldsInput.cardNumber}
          errorMessage={errors.cardNumberError}
          onValueChange={onCardNumberChange}
        />
      )}
      {renderExpiryDateCVV()}
      {securityCodeField !== undefined && (
        <SecurityCodeInputField
          field={securityCodeField}
          value={fieldsInput.PinCode}
          errorMessage={errors.securityCodeError}
          onValueChange={onSecurityCodeChange}
        />
      )}
      {cardholderField !== undefined && (
        <CardholderNameInputField
          accountOnFile={accountOnFile}
          field={cardholderField}
          value={fieldsInput.cardholderName}
          errorMessage={errors.cardholderNameError}
          onValueChange={onCardholderNameChange}
        />
      )}
    </View>
  );

  function renderExpiryDateCVV() {
    if (expiryDateField !== undefined && cvvField !== undefined) {
      return (
        <View style={[styles.row, styles.cardInputRow]}>
          {renderExpiryDateField(expiryDateField)}
          {renderCVVField(cvvField)}
        </View>
      );
    } else if (expiryDateField !== undefined) {
      renderExpiryDateField(expiryDateField);
    } else if (cvvField !== undefined) {
      renderCVVField(cvvField);
    }
  }

  function renderExpiryDateField(field: PaymentProductField) {
    return (
      <View style={styles.cardInputRowView}>
        <ExpiryDateInputField
          accountOnFile={accountOnFile}
          field={field}
          value={fieldsInput.expiryDate}
          errorMessage={errors.expiryDateError}
          onValueChange={onExpiryDateChange}
        />
      </View>
    );
  }

  function renderCVVField(field: PaymentProductField) {
    return (
      <View style={styles.cardInputRowView}>
        <CvvInputField
          field={field}
          value={fieldsInput.cvv}
          errorMessage={errors.cvvError}
          onValueChange={onCvvChange}
          openBottomSheet={openBottomSheet}
        />
      </View>
    );
  }
}

export default React.memo(CardInputFields, (prevProps, nextProps) => {
  return (
    isEqualFieldsInput(prevProps.fieldsInput, nextProps.fieldsInput) &&
    prevProps.logoUrl === nextProps.logoUrl &&
    isEqualErrors(prevProps.errors, nextProps.errors)
  );
});

function isEqualFieldsInput(
  prevFieldsInput: CardFieldsInput,
  nextFieldsInput: CardFieldsInput
) {
  return (
    prevFieldsInput.cardNumber === nextFieldsInput.cardNumber &&
    prevFieldsInput.expiryDate === nextFieldsInput.expiryDate &&
    prevFieldsInput.cvv === nextFieldsInput.cvv &&
    prevFieldsInput.PinCode === nextFieldsInput.PinCode &&
    prevFieldsInput.cardholderName === nextFieldsInput.cardholderName
  );
}

function isEqualErrors(
  prevErrors: CardFieldsErrors,
  nextErrors: CardFieldsErrors
) {
  return (
    prevErrors.cardNumberError === nextErrors.cardNumberError &&
    prevErrors.expiryDateError === nextErrors.expiryDateError &&
    prevErrors.cvvError === nextErrors.cvvError &&
    prevErrors.securityCodeError === nextErrors.securityCodeError &&
    prevErrors.cardholderNameError === nextErrors.cardholderNameError
  );
}
