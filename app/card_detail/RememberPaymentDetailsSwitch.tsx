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
import { Text, View } from 'react-native';
import { styles } from '@/styles/Style';
import DefaultSwitch from '../reusable_components/DefaultSwitch';
import { Strings } from '../constants/Strings';

interface Props {
  rememberPaymentDetails: boolean;
  setRememberPaymentDetails: () => void;
}

function RememberPaymentDetailsSwitch({
  rememberPaymentDetails,
  setRememberPaymentDetails,
}: Props) {
  return (
    <View style={styles.row}>
      <Text>{Strings.rememberPaymentDetailsLabel}</Text>
      <DefaultSwitch
        value={rememberPaymentDetails}
        onValueChange={setRememberPaymentDetails}
      />
    </View>
  );
}

export default React.memo(
  RememberPaymentDetailsSwitch,
  (prevProps, nextProps) => {
    return (
      prevProps.rememberPaymentDetails === nextProps.rememberPaymentDetails
    );
  }
);
