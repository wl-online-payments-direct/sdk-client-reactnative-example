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
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import { SessionDetails } from './models/SessionDetails';
import { styles } from '@/styles/Style';
import { ClientSessionDetailsValidation } from './models/Validation';
import RequiredTextInput from '../reusable_components/RequiredTextInput';
import DefaultPressable from '../reusable_components/DefaultPressable';
import { Strings } from '../constants/Strings';

interface Props {
  sessionDetails: SessionDetails;
  errors: ClientSessionDetailsValidation;
  setClientSessionId: (value: string) => void;
  setCustomerId: (value: string) => void;
  setClientAPIUrl: (value: string) => void;
  setAssetUrl: (value: string) => void;
  pasteClientJSONResponse: () => Promise<void>;
  openBottomSheet: (text: string) => void;
}

function ClientSessionDetailsInput({
  sessionDetails,
  errors,
  setClientSessionId,
  setCustomerId,
  setClientAPIUrl,
  setAssetUrl,
  pasteClientJSONResponse,
  openBottomSheet,
}: Props) {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>
        {Strings.clientSessionDetailsHeader}
      </Text>
      <RequiredTextInput
        placeholder={Strings.clientSessionIdLabel}
        value={sessionDetails.clientSessionId}
        onChangeText={(value) => setClientSessionId(value)}
        hasError={errors.clientSessionIdValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.clientSessionIdTooltip)}
      />
      <RequiredTextInput
        placeholder={Strings.customerIdLabel}
        value={sessionDetails.customerId}
        onChangeText={(value) => setCustomerId(value)}
        hasError={errors.customerIdValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.customerIdTooltip)}
      />
      <RequiredTextInput
        placeholder={Strings.clientApiUrlLabel}
        value={sessionDetails.clientApiUrl}
        onChangeText={(value) => setClientAPIUrl(value)}
        hasError={errors.clientAPIUrlValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.clientApiUrlTooltip)}
      />
      <RequiredTextInput
        placeholder={Strings.assetsUrlLabel}
        value={sessionDetails.assetUrl}
        onChangeText={(value) => setAssetUrl(value)}
        hasError={errors.assetUrlValid}
        suffixIconSource={'information-outline'}
        openBottomSheet={() => openBottomSheet(Strings.assetsUrlTooltip)}
      />
      <DefaultPressable
        text={Strings.pasteJsonButtonLabel}
        onPress={pasteClientJSONResponse}
        pressableStyle={[
          styles.defaultPressable,
          styles.invertedPressable,
          styles.pasteJsonPressable,
        ]}
        pressableTextStyle={styles.invertedPressableText}
      />
    </View>
  );
}

export default React.memo(ClientSessionDetailsInput, (prevProps, nextProps) => {
  return (
    prevProps.sessionDetails.clientSessionId ===
      nextProps.sessionDetails.clientSessionId &&
    prevProps.sessionDetails.customerId ===
      nextProps.sessionDetails.customerId &&
    prevProps.sessionDetails.clientApiUrl ===
      nextProps.sessionDetails.clientApiUrl &&
    prevProps.sessionDetails.assetUrl === nextProps.sessionDetails.assetUrl &&
    prevProps.errors === nextProps.errors
  );
});
