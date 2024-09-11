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
import { styles } from '@/styles/Style';
import { Image } from 'expo-image';
import {
  AccountOnFile,
  BasicPaymentProduct,
} from 'onlinepayments-sdk-client-reactnative';
import { Text, View } from 'react-native';

interface PaymentProductItemProps {
  paymentProduct: BasicPaymentProduct;
  accountOnFile?: AccountOnFile;
}

export default function PaymentProductItem({
  paymentProduct,
  accountOnFile,
}: PaymentProductItemProps) {
  return (
    <View style={styles.paymentProductItem}>
      <Image
        source={getLogoURL()}
        contentFit="contain"
        style={styles.paymentProductIcon}
      />
      <Text style={styles.defaultText}>{getLabel()}</Text>
    </View>
  );

  function getLabel(): string | undefined {
    if (accountOnFile !== undefined && accountOnFile !== null) {
      return accountOnFile.getLabel();
    } else {
      return paymentProduct.displayHintsList.at(0)?.label;
    }
  }

  function getLogoURL(): string | undefined {
    return paymentProduct.displayHintsList[0].logo;
  }
}
