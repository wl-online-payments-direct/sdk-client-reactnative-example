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
import RequiredTextInput from '../reusable_components/RequiredTextInput';
import { Strings } from '../constants/Strings';

interface Props {
  hasError: boolean;
  setMerchantName: (id: string) => void;
  openBottomSheet: (text: string) => void;
  merchantName?: string;
}

function MerchantNameInput({
  hasError,
  setMerchantName,
  openBottomSheet,
  merchantName,
}: Props) {
  return (
    <RequiredTextInput
      placeholder={Strings.merchantNameLabel}
      value={merchantName}
      onChangeText={(value) => setMerchantName(value)}
      hasError={hasError}
      suffixIconSource={'information-outline'}
      openBottomSheet={() => openBottomSheet(Strings.merchantNameTooltip)}
    />
  );
}

export default React.memo(MerchantNameInput, (prevProps, nextProps) => {
  return (
    prevProps.merchantName === nextProps.merchantName &&
    prevProps.hasError === nextProps.hasError
  );
});
