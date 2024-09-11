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
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  IinDetailsListener,
  IinDetailsRequest,
  IinDetailsResponse,
  IinDetailsStatus,
  PaymentProductListener,
  PaymentProductRequest,
  PaymentRequest,
  PaymentRequestPreparedListener,
  PreparePaymentRequest,
  ValidationErrorMessage,
} from 'onlinepayments-sdk-client-reactnative';
import { SessionContext } from '../contexts/SessionContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { PreparedCardPaymentRequestContext } from '../contexts/PreparedCardPaymentRequestContext';
import { CardFieldsErrors } from './models/CardFieldsErrors';
import { Constants } from '../constants/Constants';
import { ValidationErrorMessageHelper } from '../helpers/ValidationErrorMessageHelper';
import { Strings } from '../constants/Strings';

type Props = NativeStackScreenProps<RootStackParamList, 'CardDetail'>;

export default function CardDetail({ navigation }: Props) {
  const { session, paymentDetails } = useContext(SessionContext);
  const {
    selectedPaymentProduct,
    selectedAccountOnFile,
    setSelectedPaymentProduct,
  } = useContext(SelectedPaymentProductContext);
  const { setPreparedPaymentRequest } = useContext(
    PreparedCardPaymentRequestContext
  );
  const cardField = useMemo(
    () =>
      selectedPaymentProduct?.fields.find(
        (field) => field.id === Constants.cardFieldId
      ),
    [selectedPaymentProduct?.fields]
  );
  const expiryDateField = useMemo(
    () =>
      selectedPaymentProduct?.fields.find(
        (field) => field.id === Constants.expiryDateFieldId
      ),
    [selectedPaymentProduct?.fields]
  );
  const cvvField = useMemo(
    () =>
      selectedPaymentProduct?.fields.find(
        (field) => field.id === Constants.cvvFieldId
      ),
    [selectedPaymentProduct?.fields]
  );
  const securityCodeField = useMemo(
    () =>
      selectedPaymentProduct?.fields.find(
        (field) => field.id === Constants.securityCodeFieldId
      ),
    [selectedPaymentProduct?.fields]
  );
  const cardholderField = useMemo(
    () =>
      selectedPaymentProduct?.fields.find(
        (field) => field.id === Constants.cardHolderFieldId
      ),
    [selectedPaymentProduct?.fields]
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
  const [wasValidated, setWasValidated] = useState<boolean>(false);

  const snapPoints = useMemo(() => ['25%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetText, setBottomSheetText] = useState<string>('');

  const handleOpenPress = () => bottomSheetRef.current?.expand();

  useEffect(() => {
    if (wasValidated && fieldsAreValid()) {
      // Only when validation took place & there are no errors, the payment can be encrypted
      encryptPaymentRequest();
    }

    setWasValidated(false);
  }, [wasValidated]);

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
            logoUrl={getLogoURL()}
            fieldsInput={fieldsInput}
            errors={errors}
            onCardNumberChange={(changedCardNumber) => {
              if (liveValidationEnabled) {
                cardField
                  ?.validateValue(changedCardNumber)
                  .then((cardNumberErrors) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      cardNumberError: getFirstErrorMessage(cardNumberErrors),
                    }));
                  });
              }
              setFieldsInput((prevFieldsInput) => ({
                ...prevFieldsInput,
                cardNumber: changedCardNumber,
              }));
              if (changedCardNumber.length >= 6) {
                const newIin = changedCardNumber.substring(0, 6);

                if (newIin !== previousIin) {
                  setPreviousIin(newIin);
                  getIinDetails(newIin);
                }
              }
            }}
            onExpiryDateChange={(changedExpiryDate) => {
              if (liveValidationEnabled) {
                expiryDateField
                  ?.validateValue(changedExpiryDate)
                  .then((expiryDateErrors) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      expiryDateError: getFirstErrorMessage(expiryDateErrors),
                    }));
                  });
              }
              setFieldsInput((prevFieldsInput) => ({
                ...prevFieldsInput,
                expiryDate: changedExpiryDate,
              }));
            }}
            onCvvChange={(changedCvv) => {
              if (liveValidationEnabled) {
                cvvField?.validateValue(changedCvv).then((cvvErrors) => {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    cvvError: getFirstErrorMessage(cvvErrors),
                  }));
                });
              }
              setFieldsInput((prevFieldsInput) => ({
                ...prevFieldsInput,
                cvv: changedCvv,
              }));
            }}
            onSecurityCodeChange={(changedSecurityCode) => {
              if (liveValidationEnabled) {
                securityCodeField
                  ?.validateValue(changedSecurityCode)
                  .then((securityCodeErrors) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      securityCodeError:
                        getFirstErrorMessage(securityCodeErrors),
                    }));
                  });
              }
              setFieldsInput((prevFieldsInput) => ({
                ...prevFieldsInput,
                PinCode: changedSecurityCode,
              }));
            }}
            onCardholderNameChange={(changedCardholderName) => {
              if (liveValidationEnabled) {
                cardholderField
                  ?.validateValue(changedCardholderName)
                  .then((cardholderNameErrors) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      cardholderNameError:
                        getFirstErrorMessage(cardholderNameErrors),
                    }));
                  });
              }
              setFieldsInput((prevFieldsInput) => ({
                ...prevFieldsInput,
                cardholderName: changedCardholderName,
              }));
            }}
            openBottomSheet={(text) => openBottomSheet(text)}
          />
          <DefaultPressable
            text={Strings.payButtonLabel}
            onPress={validateFields}
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

  function getIinDetails(partialCreditCardNumber: string) {
    const iinDetailsRequest: IinDetailsRequest = {
      partialCreditCardNumber,
      paymentContext: paymentDetails.paymentContext,
    };

    session?.getIinDetails(
      iinDetailsRequest,
      new IinDetailsListener(
        (iinDetailsResponse) => {
          handleIinDetailsResponse(iinDetailsResponse);
        },
        (errorResponse) => {
          Alert.alert(Strings.apiErrorTitle, errorResponse?.message);
        },
        (exception) => {
          Alert.alert(Strings.nativeExceptionTitle, exception?.error);
        }
      )
    );
  }

  function handleIinDetailsResponse(response: IinDetailsResponse) {
    switch (response.status) {
      case IinDetailsStatus.Supported: {
        setErrors((prevCardFieldsErrors) => ({
          ...prevCardFieldsErrors,
          cardNumberError: undefined,
        }));

        const productId = response.paymentProductId ?? '';

        if (selectedPaymentProduct?.id !== productId) {
          const paymentProductRequest: PaymentProductRequest = {
            productId,
            paymentContext: paymentDetails.paymentContext,
          };
          session?.getPaymentProduct(
            paymentProductRequest,
            new PaymentProductListener(
              (paymentProduct) => {
                setSelectedPaymentProduct(paymentProduct);
              },
              (errorResponse) => {
                Alert.alert(Strings.apiErrorTitle, errorResponse?.message);
              },
              (exception) => {
                Alert.alert(Strings.nativeExceptionTitle, exception?.error);
              }
            )
          );
        }
        break;
      }
      case IinDetailsStatus.ExistingButNotAllowed: {
        setErrors((prevCardFieldsErrors) => ({
          ...prevCardFieldsErrors,
          cardNumberError: Strings.unsupportedCard,
        }));
        break;
      }
      case IinDetailsStatus.Unknown: {
        setErrors((prevCardFieldsErrors) => ({
          ...prevCardFieldsErrors,
          cardNumberError: Strings.invalidCard,
        }));
        break;
      }
      case IinDetailsStatus.NotEnoughDigits: {
        setErrors((prevCardFieldsErrors) => ({
          ...prevCardFieldsErrors,
          cardNumberError: Strings.iinNotEnoughDigitsLabel,
        }));
        break;
      }
    }
  }

  function getLogoURL(): string | undefined {
    return selectedPaymentProduct?.displayHintsList[0].logo;
  }

  function openBottomSheet(text: string) {
    setBottomSheetText(text);
    handleOpenPress();
  }

  async function validateFields() {
    if (selectedPaymentProduct !== undefined) {
      // If an Account on File exists, there are no errors for card number because it cannot be modified
      const cardNumberErrors =
        selectedAccountOnFile === undefined
          ? await cardField?.validateValue(fieldsInput.cardNumber ?? '')
          : undefined;

      const expiryDateValue = getFieldValue('expiryDate');
      const expiryDateErrors = await expiryDateField?.validateValue(
        expiryDateValue ?? ''
      );

      const cvvValue = getFieldValue('cvv');
      const cvvErrors = await cvvField?.validateValue(cvvValue ?? '');

      const securityCodeValue = getFieldValue('PinCode');
      const securityCodeErrors = await securityCodeField?.validateValue(
        securityCodeValue ?? ''
      );

      const cardholderNameValue = getFieldValue('cardholderName');
      const cardholderNameErrors = await cardholderField?.validateValue(
        cardholderNameValue ?? ''
      );

      setLiveValidationEnabled(true);

      setErrors({
        cardNumberError: getFirstErrorMessage(cardNumberErrors),
        expiryDateError: getFirstErrorMessage(expiryDateErrors),
        cvvError: getFirstErrorMessage(cvvErrors),
        securityCodeError: getFirstErrorMessage(securityCodeErrors),
        cardholderNameError: getFirstErrorMessage(cardholderNameErrors),
      });

      setWasValidated(true);
    } else {
      Alert.alert(
        Strings.undefinedPaymentProductTitle,
        Strings.undefinedPaymentProductValidationMessage
      );
    }
  }

  function getFieldValue(fieldId: keyof CardFieldsInput): string | undefined {
    // If value in fieldsInput does not exist, check for AccountOnFile attribute, if that also does not exist then return undefined
    if (fieldsInput[fieldId] !== undefined) {
      return fieldsInput[fieldId];
    } else {
      return selectedAccountOnFile?.attributes.find(
        (attribute) => attribute.key === fieldId
      )?.value;
    }
  }

  function getFirstErrorMessage(
    errorMessages?: ValidationErrorMessage[]
  ): string | undefined {
    return ValidationErrorMessageHelper.getErrorMessage(errorMessages?.[0]);
  }

  function fieldsAreValid() {
    return (
      errors.cardNumberError === undefined &&
      errors.cardholderNameError === undefined &&
      errors.cvvError === undefined &&
      errors.expiryDateError === undefined &&
      errors.securityCodeError === undefined
    );
  }

  function encryptPaymentRequest() {
    if (selectedPaymentProduct !== undefined) {
      const paymentRequest = new PaymentRequest(
        selectedPaymentProduct,
        selectedAccountOnFile,
        rememberPaymentDetails
      );

      // Define a new object that only has the entered fieldsInput properties
      const filteredInputFields = Object.entries(fieldsInput).reduce(
        (filtered, [key, value]) => {
          if (value !== undefined) {
            filtered[key] = value;
          }
          return filtered;
        },
        {} as { [key: string]: string }
      );

      // For each filteredInputFields property, set the value on PaymentRequest
      Object.entries(filteredInputFields).forEach(([key, value]) => {
        paymentRequest.setValue(key, value);
      });

      const preparePaymentRequest = new PreparePaymentRequest(paymentRequest);

      session?.preparePaymentRequest(
        preparePaymentRequest,
        new PaymentRequestPreparedListener(
          (preparedPaymentRequest) => {
            setPreparedPaymentRequest(preparedPaymentRequest);
            navigation.navigate('EndScreen');
          },
          (errorResponse) => {
            Alert.alert(Strings.apiErrorTitle, errorResponse?.message);
          },
          (exception) => {
            Alert.alert(
              Strings.nativeExceptionTitle,
              exception?.throwable?.message
            );
          }
        )
      );
    } else {
      Alert.alert(
        Strings.undefinedPaymentProductTitle,
        Strings.undefinedPaymentProductEncryptionMessage
      );
    }
  }
}
