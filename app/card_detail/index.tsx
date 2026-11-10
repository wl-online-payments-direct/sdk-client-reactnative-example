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

// @ts-ignore
import React, { useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import MerchantHeader from '../reusable_components/MerchantHeader';
import { styles } from '@/styles/Style';
import { useContext } from 'react';
import { SelectedPaymentProductContext } from '../contexts/SelectedPaymentProductContext';
import DefaultPressable from '../reusable_components/DefaultPressable';
import RememberPaymentDetailsSwitch from './RememberPaymentDetailsSwitch';
import CardInputFields from './CardInputFields';
import { CardFieldsInput } from './models/CardFieldsInput';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  IinDetailsResponse,
  IinDetailStatus,
  InvalidArgumentError,
  PaymentProductField,
  PaymentRequest,
  ResponseError,
  ValidationErrorMessage,
} from 'onlinepayments-sdk-client-reactnative';
import { SessionContext } from '../contexts/SessionContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { EncryptedRequestContext } from '../contexts/EncryptedRequestContext';
import { CardFieldsErrors } from './models/CardFieldsErrors';
import { Constants } from '../constants/Constants';
import { ValidationErrorMessageHelper } from '../helpers/ValidationErrorMessageHelper';
import { SdkErrorHelper } from '../helpers/SdkErrorHelper';
import { Strings } from '../constants/Strings';

type Props = NativeStackScreenProps<RootStackParamList, 'CardDetail'>;

const errorKeyByFieldId: Record<string, keyof CardFieldsErrors> = {
  [Constants.cardFieldId]: 'cardNumberError',
  [Constants.expiryDateFieldId]: 'expiryDateError',
  [Constants.cvvFieldId]: 'cvvError',
  [Constants.securityCodeFieldId]: 'securityCodeError',
  [Constants.cardHolderFieldId]: 'cardholderNameError',
};

export default function CardDetail({ navigation }: Props) {
  const { sdk, paymentDetails } = useContext(SessionContext);
  const {
    selectedPaymentProduct,
    selectedAccountOnFile,
    setSelectedPaymentProduct,
  } = useContext(SelectedPaymentProductContext);
  const { setEncryptedRequest } = useContext(EncryptedRequestContext);

  const cardField = selectedPaymentProduct?.getField(Constants.cardFieldId);
  const expiryDateField = selectedPaymentProduct?.getField(
    Constants.expiryDateFieldId
  );
  const cvvField = selectedPaymentProduct?.getField(Constants.cvvFieldId);
  const securityCodeField = selectedPaymentProduct?.getField(
    Constants.securityCodeFieldId
  );
  const cardholderField = selectedPaymentProduct?.getField(
    Constants.cardHolderFieldId
  );

  const [rememberPaymentDetails, setRememberPaymentDetails] =
    useState<boolean>(false);
  const [fieldsInput, setFieldsInput] = useState<CardFieldsInput>(
    new CardFieldsInput()
  );
  const [previousIin, setPreviousIin] = useState<string>();

  const [errors, setErrors] = useState<CardFieldsErrors>({
    cardNumberError: undefined,
    cardholderNameError: undefined,
    cvvError: undefined,
    expiryDateError: undefined,
    securityCodeError: undefined,
  });
  const [liveValidationEnabled, setLiveValidationEnabled] =
    useState<boolean>(false);

  const snapPoints = useMemo(() => ['25%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetText, setBottomSheetText] = useState<string>('');

  const handleOpenPress = () => bottomSheetRef.current?.expand();

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <MerchantHeader />
          {renderCardDetail()}
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.defaultText}>{bottomSheetText}</Text>
        </View>
      </BottomSheet>
    </View>
  );

  function renderCardDetail() {
    if (selectedPaymentProduct !== undefined) {
      return (
        <View style={styles.contentContainer}>
          <CardInputFields
            cardField={cardField}
            expiryDateField={expiryDateField}
            cvvField={cvvField}
            securityCodeField={securityCodeField}
            cardholderField={cardholderField}
            accountOnFile={selectedAccountOnFile}
            logoUrl={selectedPaymentProduct.logo}
            fieldsInput={fieldsInput}
            errors={errors}
            onCardNumberChange={(changedCardNumber) => {
              onFieldChange('cardNumber', cardField, changedCardNumber);

              const unmaskedCardNumber =
                cardField?.removeMask(changedCardNumber) ?? changedCardNumber;
              if (unmaskedCardNumber.length >= 6) {
                const newIin = unmaskedCardNumber.substring(0, 6);

                if (newIin !== previousIin) {
                  setPreviousIin(newIin);
                  getIinDetails(newIin);
                }
              }
            }}
            onExpiryDateChange={(changedExpiryDate) =>
              onFieldChange('expiryDate', expiryDateField, changedExpiryDate)
            }
            onCvvChange={(changedCvv) =>
              onFieldChange('cvv', cvvField, changedCvv)
            }
            onSecurityCodeChange={(changedSecurityCode) =>
              onFieldChange('PinCode', securityCodeField, changedSecurityCode)
            }
            onCardholderNameChange={(changedCardholderName) =>
              onFieldChange(
                'cardholderName',
                cardholderField,
                changedCardholderName
              )
            }
            openBottomSheet={(text) => openBottomSheet(text)}
          />
          <DefaultPressable
            text={Strings.payButtonLabel}
            onPress={validateAndEncryptPaymentRequest}
            pressableStyle={styles.defaultPressable}
            pressableTextStyle={styles.defaultPressableText}
          />
          {selectedPaymentProduct.allowsTokenization &&
            selectedAccountOnFile === undefined && (
              <RememberPaymentDetailsSwitch
                rememberPaymentDetails={rememberPaymentDetails}
                setRememberPaymentDetails={() =>
                  setRememberPaymentDetails(!rememberPaymentDetails)
                }
              />
            )}
        </View>
      );
    } else {
      return <Text>{Strings.errorRetrievingProductLabel}</Text>;
    }
  }

  function onFieldChange(
    fieldId: keyof CardFieldsInput,
    field: PaymentProductField | undefined,
    value: string
  ) {
    if (liveValidationEnabled && field !== undefined) {
      const fieldErrors = field.validate(field.removeMask(value));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [errorKeyByFieldId[fieldId]]: getFirstErrorMessage(fieldErrors, field),
      }));
    }

    setFieldsInput((prevFieldsInput) => ({
      ...prevFieldsInput,
      [fieldId]: value,
    }));
  }

  async function getIinDetails(iin: string) {
    if (sdk === undefined) {
      return;
    }

    const { paymentContext } = paymentDetails;
    let iinDetailsResponse: IinDetailsResponse;

    try {
      iinDetailsResponse = await sdk.getIinDetails(iin, {
        ...paymentContext,
        amountOfMoney: {
          ...paymentContext.amountOfMoney,
          amount: paymentContext.amountOfMoney.amount ?? 0,
        },
      });
    } catch (error) {
      handleIinDetailsError(error);
      return;
    }

    try {
      await handleIinDetailsResponse(iinDetailsResponse);
    } catch (error) {
      SdkErrorHelper.showError(error);
    }
  }

  function handleIinDetailsError(error: unknown) {
    if (error instanceof ResponseError) {
      // If the IIN is unknown, the Client API returns an error response
      setCardNumberError(Strings.invalidCard);
    } else if (
      error instanceof InvalidArgumentError &&
      (
        (error.metadata as Record<string, unknown> | undefined)?.data as
          IinDetailsResponse | undefined
      )?.status === IinDetailStatus.NOT_ENOUGH_DIGITS
    ) {
      setCardNumberError(Strings.iinNotEnoughDigitsLabel);
    } else {
      SdkErrorHelper.showError(error);
    }
  }

  async function handleIinDetailsResponse(response: IinDetailsResponse) {
    switch (response.status) {
      case IinDetailStatus.SUPPORTED: {
        setCardNumberError(undefined);

        const productId = response.paymentProductId;

        if (
          sdk !== undefined &&
          productId !== undefined &&
          selectedPaymentProduct?.id !== productId
        ) {
          const paymentProduct = await sdk.getPaymentProduct(
            productId,
            paymentDetails.paymentContext
          );
          setSelectedPaymentProduct(paymentProduct);
        }
        break;
      }
      case IinDetailStatus.EXISTING_BUT_NOT_ALLOWED:
      case IinDetailStatus.UNSUPPORTED: {
        setCardNumberError(Strings.unsupportedCard);
        break;
      }
      case IinDetailStatus.UNKNOWN: {
        setCardNumberError(Strings.invalidCard);
        break;
      }
      case IinDetailStatus.NOT_ENOUGH_DIGITS: {
        setCardNumberError(Strings.iinNotEnoughDigitsLabel);
        break;
      }
    }
  }

  function setCardNumberError(cardNumberError?: string) {
    setErrors((prevCardFieldsErrors) => ({
      ...prevCardFieldsErrors,
      cardNumberError,
    }));
  }

  function openBottomSheet(text: string) {
    setBottomSheetText(text);
    handleOpenPress();
  }

  function createPaymentRequest(): PaymentRequest | undefined {
    if (selectedPaymentProduct === undefined) {
      return undefined;
    }

    const paymentRequest = new PaymentRequest(
      selectedPaymentProduct,
      selectedAccountOnFile,
      rememberPaymentDetails
    );

    // For each entered value, set the value on PaymentRequest, except for READ_ONLY Account on File fields
    Object.entries(fieldsInput).forEach(([fieldId, value]) => {
      const isWritable = selectedAccountOnFile?.isWritable(fieldId) ?? true;

      if (
        value !== undefined &&
        isWritable &&
        selectedPaymentProduct.getField(fieldId) !== undefined
      ) {
        paymentRequest.setValue(fieldId, value);
      }
    });

    return paymentRequest;
  }

  async function validateAndEncryptPaymentRequest() {
    if (sdk === undefined || selectedPaymentProduct === undefined) {
      Alert.alert(
        Strings.undefinedPaymentProductTitle,
        Strings.undefinedPaymentProductValidationMessage
      );
      return;
    }

    try {
      const paymentRequest = createPaymentRequest();
      if (paymentRequest === undefined) {
        return;
      }
      const validationResult = paymentRequest.validate();

      setLiveValidationEnabled(true);
      setErrors(mapValidationErrors(validationResult.errors));

      if (!validationResult.isValid) {
        showErrorsForFieldsWithoutInput(validationResult.errors);
        return;
      }

      const encryptedRequest = await sdk.encryptPaymentRequest(paymentRequest);
      setEncryptedRequest(encryptedRequest);
      navigation.navigate('EndScreen');
    } catch (error) {
      SdkErrorHelper.showError(error);
    }
  }

  function mapValidationErrors(
    validationErrors: ValidationErrorMessage[]
  ): CardFieldsErrors {
    const mappedErrors: CardFieldsErrors = {};

    validationErrors.forEach((validationError) => {
      const errorKey = errorKeyByFieldId[validationError.paymentProductFieldId];
      if (errorKey !== undefined && mappedErrors[errorKey] === undefined) {
        mappedErrors[errorKey] = getFirstErrorMessage(
          [validationError],
          selectedPaymentProduct?.getField(
            validationError.paymentProductFieldId
          )
        );
      }
    });

    return mappedErrors;
  }

  // Errors of payment product fields that are not shown on this screen are shown in an alert
  function showErrorsForFieldsWithoutInput(
    validationErrors: ValidationErrorMessage[]
  ) {
    const otherFieldIds = [
      ...new Set(
        validationErrors
          .map((validationError) => validationError.paymentProductFieldId)
          .filter((fieldId) => errorKeyByFieldId[fieldId] === undefined)
      ),
    ];

    if (otherFieldIds.length > 0) {
      Alert.alert(
        Strings.validationFailedTitle,
        `${Strings.invalidOtherFieldsMessage}\n${otherFieldIds.join('\n')}`
      );
    }
  }

  function getFirstErrorMessage(
    errorMessages?: ValidationErrorMessage[],
    field?: PaymentProductField
  ): string | undefined {
    return ValidationErrorMessageHelper.getErrorMessage(
      errorMessages?.[0],
      field
    );
  }
}
