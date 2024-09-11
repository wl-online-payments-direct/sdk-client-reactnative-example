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
import {
  Alert,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MerchantHeader from '../reusable_components/MerchantHeader';
import { styles } from '@/styles/Style';
import PaymentProductItem from './PaymentProductItem';
import { Constants } from '../constants/Constants';
import {
  AccountOnFile,
  BasicPaymentProduct,
  PaymentProductRequest,
  PaymentProductListener,
  PaymentRequest,
  PaymentRequestPreparedListener,
  PreparePaymentRequest,
} from 'onlinepayments-sdk-client-reactnative';
import { SessionContext } from '../contexts/SessionContext';
import { useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { SelectedPaymentProductContext } from '../contexts/SelectedPaymentProductContext';
import { WalletPaymentHelper } from '../helpers/WalletPaymentHelper';
import { PreparedWalletPaymentRequestContext } from '../contexts/PreparedWalletPaymentRequestContext';
import { Strings } from '../constants/Strings';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PaymentProductsOverview'
>;

export default function PaymentProductsOverview({ navigation }: Props) {
  const { session, paymentDetails, basicPaymentProducts } =
    useContext(SessionContext);
  const { setSelectedPaymentProduct, setSelectedAccountOnFile } = useContext(
    SelectedPaymentProductContext
  );
  const { setPreparedPaymentRequest } = useContext(
    PreparedWalletPaymentRequestContext
  );

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <MerchantHeader />
        <View style={styles.contentContainer}>
          {renderPaymentProductsOverview()}
        </View>
      </View>
    </View>
  );

  function renderPaymentProductsOverview() {
    if (basicPaymentProducts === undefined) {
      return <Text>{Strings.undefinedBasicPaymentProductsMessage}</Text>;
    } else {
      const paymentProducts = basicPaymentProducts.basicPaymentProducts;
      const accountsOnFile = basicPaymentProducts.accountsOnFile;

      if (accountsOnFile.length !== 0) {
        return paymentProductsListWithAccountsOnFile(
          accountsOnFile,
          paymentProducts
        );
      }
      return paymentProductsList(paymentProducts);
    }
  }

  function paymentProductsListWithAccountsOnFile(
    accountsOnFile: AccountOnFile[],
    paymentProducts: BasicPaymentProduct[]
  ) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>{Strings.accountsOnFileHeader}</Text>
        <FlatList
          contentContainerStyle={styles.paymentProductsFlatList}
          data={accountsOnFile}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => getPaymentProduct(item.paymentProductId, item)}
            >
              <View>
                <PaymentProductItem
                  paymentProduct={getBasicPaymentProduct(paymentProducts, item)}
                  accountOnFile={item}
                />
              </View>
            </TouchableWithoutFeedback>
          )}
        />
        <Text style={styles.sectionTitle}>{Strings.paymentProductsHeader}</Text>
        {paymentProductsList(paymentProducts)}
      </View>
    );
  }

  function paymentProductsList(paymentProducts: BasicPaymentProduct[]) {
    return (
      <FlatList
        contentContainerStyle={styles.paymentProductsFlatList}
        data={paymentProducts}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => getPaymentProduct(item.id)}>
            <View>
              <PaymentProductItem paymentProduct={item} />
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    );
  }

  function getBasicPaymentProduct(
    paymentProducts: BasicPaymentProduct[],
    accountOnFile: AccountOnFile
  ): BasicPaymentProduct {
    return paymentProducts.find(
      (basicPaymentProduct) =>
        basicPaymentProduct.id === accountOnFile.paymentProductId
    )!;
  }

  function getPaymentProduct(productId: string, accountOnFile?: AccountOnFile) {
    const paymentProductRequest: PaymentProductRequest = {
      productId,
      paymentContext: paymentDetails.paymentContext,
    };
    session?.getPaymentProduct(
      paymentProductRequest,
      new PaymentProductListener(
        (paymentProduct) => {
          if (paymentProduct.id === Constants.applePayId) {
            WalletPaymentHelper.startApplePayPayment(
              paymentProduct,
              paymentDetails,
              (paymentRequest) => {
                encryptPaymentRequest(paymentRequest);
              },
              (text) => {
                Alert.alert(Strings.defaultErrorTitle, text);
              }
            );
          } else if (paymentProduct.id === Constants.googlePayId) {
            WalletPaymentHelper.startGooglePayPayment(
              paymentProduct,
              paymentDetails,
              (paymentRequest) => {
                encryptPaymentRequest(paymentRequest);
              },
              (text) => {
                Alert.alert(Strings.defaultErrorTitle, text);
              }
            );
          } else if (
            paymentProduct.paymentMethod === Constants.cardPaymentMethod
          ) {
            setSelectedPaymentProduct(paymentProduct);
            setSelectedAccountOnFile(accountOnFile);
            navigation.navigate('CardDetail');
          } else {
            Alert.alert(
              Strings.productNotAvailableTitle,
              Strings.productNotAvailableMessage
            );
          }
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

  function encryptPaymentRequest(paymentRequest: PaymentRequest) {
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
          Alert.alert(Strings.nativeExceptionTitle, exception?.error);
        }
      )
    );
  }
}
