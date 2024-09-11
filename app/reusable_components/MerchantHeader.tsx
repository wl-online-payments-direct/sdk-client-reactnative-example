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

/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-ignore
import React from 'react';
import { styles } from '@/styles/Style';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { Strings } from '../constants/Strings';

export default function MerchantHeader() {
  return (
    <View>
      <Image
        source={require('../../assets/images/logo_merchant.png')}
        contentFit="contain"
        accessibilityLabel={Strings.merchantLogoLabel}
        style={styles.merchantLogo}
      />
      <View style={styles.rowEnd}>
        <Image
          source={require('../../assets/images/lock.png')}
          contentFit="contain"
          accessibilityLabel={Strings.lockLogoLabel}
          style={styles.lockLogo}
        />
        <Text style={styles.securePaymentText}>
          {Strings.securePaymentLabel}
        </Text>
      </View>
    </View>
  );
}
