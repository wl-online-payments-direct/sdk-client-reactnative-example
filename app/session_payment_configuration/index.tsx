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
import * as Clipboard from 'expo-clipboard';
import { Alert, ScrollView, Text, View } from 'react-native';
import 'react-native-reanimated';
import { useMemo, useRef, useState, useContext, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { SessionDetails } from './models/SessionDetails';
import {
  BasicPaymentProductsListener,
  Session,
} from 'onlinepayments-sdk-client-reactnative';
import { styles } from '@/styles/Style';
import MerchantHeader from '../reusable_components/MerchantHeader';
import { SessionContext } from '../contexts/SessionContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import PaymentDetailsInput from './PaymentDetailsInput';
import OtherOptionsInput from './OtherOptionsInput';
import ClientSessionDetailsInput from './ClientSessionDetailsInput';
import { SessionPaymentConfigurationValidation } from './models/Validation';
import DefaultPressable from '../reusable_components/DefaultPressable';
import { Strings } from '../constants/Strings';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SessionPaymentConfiguration'
>;

export default function SessionPaymentConfiguration({ navigation }: Props) {
  const {
    session,
    paymentDetails,
    setSession,
    setPaymentDetails,
    setBasicPaymentProducts,
  } = useContext(SessionContext);

  const snapPoints = useMemo(() => ['25%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetText, setBottomSheetText] = useState<string>('');

  const [sessionDetails, setSessionDetails] = useState<SessionDetails>(
    new SessionDetails()
  );

  const [errors, setErrors] = useState<SessionPaymentConfigurationValidation>({
    clientSessionDetails: {
      clientSessionIdValid: false,
      customerIdValid: false,
      clientAPIUrlValid: false,
      assetUrlValid: false,
    },
    paymentDetails: {
      amountValid: false,
      countryCodeValid: false,
      currencyCodeValid: false,
    },
    otherOptions: {
      merchantIdValid: false,
      merchantNameValid: false,
    },
  });
  const [liveValidationEnabled, setLiveValidationEnabled] =
    useState<boolean>(false);
  const [wasValidated, setWasValidated] = useState<boolean>(false);

  useEffect(() => {
    getBasicPaymentProducts();
  }, [session]);

  useEffect(() => {
    if (wasValidated && inputFieldsAreValid()) {
      // Only when live validation is enabled & there are no errors, a session can be created
      createSession();
    }

    setWasValidated(false);
  }, [wasValidated]);

  const handleOpenPress = () => bottomSheetRef.current?.expand();

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <MerchantHeader />
          <ClientSessionDetailsInput
            sessionDetails={sessionDetails}
            errors={errors.clientSessionDetails}
            setClientSessionId={(clientSessionId) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  clientSessionDetails: {
                    ...prevErrors.clientSessionDetails,
                    clientSessionIdValid: !clientSessionId,
                  },
                }));
              }
              setSessionDetails((prevSessionDetails) => ({
                ...prevSessionDetails,
                clientSessionId,
              }));
            }}
            setCustomerId={(customerId) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  clientSessionDetails: {
                    ...prevErrors.clientSessionDetails,
                    customerIdValid: !customerId,
                  },
                }));
              }
              setSessionDetails((prevSessionDetails) => ({
                ...prevSessionDetails,
                customerId,
              }));
            }}
            setClientAPIUrl={(clientApiUrl) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  clientSessionDetails: {
                    ...prevErrors.clientSessionDetails,
                    clientAPIUrlValid: !clientApiUrl,
                  },
                }));
              }
              setSessionDetails((prevSessionDetails) => ({
                ...prevSessionDetails,
                clientApiUrl,
              }));
            }}
            setAssetUrl={(assetUrl) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  clientSessionDetails: {
                    ...prevErrors.clientSessionDetails,
                    assetUrlValid: !assetUrl,
                  },
                }));
              }
              setSessionDetails((prevSessionDetails) => ({
                ...prevSessionDetails,
                assetUrl,
              }));
            }}
            pasteClientJSONResponse={pasteClientJSONResponse}
            openBottomSheet={(text) => openBottomSheet(text)}
          />
          <PaymentDetailsInput
            amountOfMoney={paymentDetails.paymentContext.amountOfMoney}
            countryCode={paymentDetails.paymentContext.countryCode}
            errors={errors.paymentDetails}
            setAmountInCents={(value) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  paymentDetails: {
                    ...prevErrors.paymentDetails,
                    amountValid: !(value !== undefined),
                  },
                }));
              }
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                paymentContext: {
                  ...prevPaymentDetails.paymentContext,
                  amountOfMoney: {
                    ...prevPaymentDetails.paymentContext.amountOfMoney,
                    amount: parseInt(value) || 0,
                  },
                },
              }));
            }}
            setCountryCode={(value) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  paymentDetails: {
                    ...prevErrors.paymentDetails,
                    countryCodeValid: !value,
                  },
                }));
              }
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                paymentContext: {
                  ...prevPaymentDetails.paymentContext,
                  countryCode: value,
                },
              }));
            }}
            setCurrencyCode={(value) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  paymentDetails: {
                    ...prevErrors.paymentDetails,
                    currencyCodeValid: !value,
                  },
                }));
              }
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                paymentContext: {
                  ...prevPaymentDetails.paymentContext,
                  amountOfMoney: {
                    ...prevPaymentDetails.paymentContext.amountOfMoney,
                    currencyCode: value,
                  },
                },
              }));
            }}
            openBottomSheet={(text) => openBottomSheet(text)}
          />
          <OtherOptionsInput
            paymentDetails={paymentDetails}
            loggingEnabled={sessionDetails.loggingEnabled}
            errors={errors.otherOptions}
            setApplePayEnabled={() =>
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                applePayEnabled: !prevPaymentDetails.applePayEnabled,
              }))
            }
            setGooglePayEnabled={() =>
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                googlePayEnabled: !prevPaymentDetails.googlePayEnabled,
              }))
            }
            setPaymentIsRecurring={() =>
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                paymentContext: {
                  ...prevPaymentDetails.paymentContext,
                  isRecurring: !prevPaymentDetails.paymentContext.isRecurring,
                },
              }))
            }
            setMerchantId={(id) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  otherOptions: {
                    ...prevErrors.otherOptions,
                    merchantIdValid: !id,
                  },
                }));
              }
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                merchantId: id,
              }));
            }}
            setMerchantName={(name) => {
              if (liveValidationEnabled) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  otherOptions: {
                    ...prevErrors.otherOptions,
                    merchantNameValid: !name,
                  },
                }));
              }
              setPaymentDetails((prevPaymentDetails) => ({
                ...prevPaymentDetails,
                merchantName: name,
              }));
            }}
            setLoggingEnabled={() =>
              setSessionDetails((prevSessionDetails) => ({
                ...prevSessionDetails,
                loggingEnabled: !prevSessionDetails.loggingEnabled,
              }))
            }
            openBottomSheet={(text) => openBottomSheet(text)}
          />
          <DefaultPressable
            text={Strings.proceedButtonLabel}
            onPress={validateFields}
            pressableStyle={styles.defaultPressable}
            pressableTextStyle={styles.defaultPressableText}
          />
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

  function openBottomSheet(text: string) {
    setBottomSheetText(text);
    handleOpenPress();
  }

  async function pasteClientJSONResponse() {
    try {
      const clipboardText = await Clipboard.getStringAsync();
      const pastedSessionDetails = JSON.parse(clipboardText) as SessionDetails;
      setSessionDetails(pastedSessionDetails);
      validateClientSessionDetailsInput(pastedSessionDetails);
    } catch {
      Alert.alert(Strings.parsingFailedTitle, Strings.parsingFailedMessage);
    }
  }

  function validateClientSessionDetailsInput(
    pastedSessionDetails: SessionDetails
  ) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      clientSessionDetails: {
        clientSessionIdValid: !pastedSessionDetails.clientSessionId,
        customerIdValid: !pastedSessionDetails.customerId,
        clientAPIUrlValid: !pastedSessionDetails.clientApiUrl,
        assetUrlValid: !pastedSessionDetails.assetUrl,
      },
    }));
  }

  function inputFieldsAreValid() {
    return (
      Object.values(errors.clientSessionDetails).every((value) => !value) &&
      Object.values(errors.paymentDetails).every((value) => !value) &&
      Object.values(errors.otherOptions).every((value) => !value)
    );
  }

  function createSession() {
    setSession(
      new Session({
        clientSessionId: sessionDetails.clientSessionId ?? '',
        customerId: sessionDetails.customerId ?? '',
        clientApiUrl: sessionDetails.clientApiUrl ?? '',
        assetUrl: sessionDetails.assetUrl ?? '',
        isEnvironmentProduction: false,
        loggingEnabled: sessionDetails.loggingEnabled,
      })
    );
  }

  function validateFields() {
    setErrors({
      clientSessionDetails: {
        clientSessionIdValid: !sessionDetails.clientSessionId,
        customerIdValid: !sessionDetails.customerId,
        clientAPIUrlValid: !sessionDetails.clientApiUrl,
        assetUrlValid: !sessionDetails.assetUrl,
      },
      paymentDetails: {
        amountValid: !(
          paymentDetails.paymentContext.amountOfMoney.amount !== undefined
        ),
        countryCodeValid: !paymentDetails.paymentContext.countryCode,
        currencyCodeValid:
          !paymentDetails.paymentContext.amountOfMoney.currencyCode,
      },
      otherOptions: {
        merchantIdValid: validateMerchantId(),
        merchantNameValid: validateMerchantName(),
      },
    });

    setLiveValidationEnabled(true);
    setWasValidated(true);
  }

  function validateMerchantId(): boolean {
    if (
      ((paymentDetails.applePayEnabled || paymentDetails.googlePayEnabled) &&
        Boolean(paymentDetails.merchantId)) ||
      (!paymentDetails.applePayEnabled && !paymentDetails.googlePayEnabled)
    ) {
      return false;
    } else {
      return true;
    }
  }

  function validateMerchantName(): boolean {
    if (
      (paymentDetails.googlePayEnabled &&
        Boolean(paymentDetails.merchantName)) ||
      !paymentDetails.googlePayEnabled
    ) {
      return false;
    } else {
      return true;
    }
  }

  function getBasicPaymentProducts() {
    session?.getBasicPaymentProducts(
      paymentDetails.paymentContext,
      new BasicPaymentProductsListener(
        (paymentProducts) => {
          setBasicPaymentProducts(paymentProducts);
          navigation.navigate('PaymentProductsOverview');
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
}
