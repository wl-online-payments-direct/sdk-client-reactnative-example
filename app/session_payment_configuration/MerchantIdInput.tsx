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
  setMerchantId: (id: string) => void;
  openBottomSheet: (text: string) => void;
  merchantId?: string;
}

function MerchantIdInput({
  hasError,
  setMerchantId,
  openBottomSheet,
  merchantId,
}: Props) {
  return (
    <RequiredTextInput
      placeholder={Strings.merchantIdLabel}
      value={merchantId}
      onChangeText={(value) => setMerchantId(value)}
      hasError={hasError}
      suffixIconSource={'information-outline'}
      openBottomSheet={() => openBottomSheet(Strings.merchantIdTooltip)}
    />
  );
}

export default React.memo(MerchantIdInput, (prevProps, nextProps) => {
  return (
    prevProps.merchantId === nextProps.merchantId &&
    prevProps.hasError === nextProps.hasError
  );
});
