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
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Snackbar } from 'react-native-paper';
import { styles } from '@/styles/Style';
import { useContext } from 'react';
import { PreparedWalletPaymentRequestContext } from '../contexts/PreparedWalletPaymentRequestContext';
import { PreparedCardPaymentRequestContext } from '../contexts/PreparedCardPaymentRequestContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import DefaultPressable from '../reusable_components/DefaultPressable';
import { Strings } from '../constants/Strings';

type Props = NativeStackScreenProps<RootStackParamList, 'EndScreen'>;

export default function EndScreen({ navigation }: Props) {
  const { preparedWalletPaymentRequest } = useContext(
    PreparedWalletPaymentRequestContext
  );
  const { preparedCardPaymentRequest } = useContext(
    PreparedCardPaymentRequestContext
  );
  const [showEncryptedFieldsData, setShowEncryptedFieldsData] =
    useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>('');

  const preparedPaymentRequest =
    preparedCardPaymentRequest ?? preparedWalletPaymentRequest;

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={[styles.container, styles.endScreenContainer]}>
          <Text style={styles.successTitle}>{Strings.successHeader}</Text>
          <Text style={styles.defaultText}>
            {Strings.endScreenInstructionLabel}
          </Text>
          <View style={styles.endScreenButtonContainer}>
            <DefaultPressable
              text={
                showEncryptedFieldsData
                  ? Strings.hideEncryptedFieldsButtonLabel
                  : Strings.showEncryptedFieldsButtonLabel
              }
              onPress={() => {
                setShowEncryptedFieldsData(!showEncryptedFieldsData);
              }}
              pressableStyle={[
                styles.defaultPressable,
                styles.invertedPressableBlue,
              ]}
              pressableTextStyle={[
                styles.defaultPressableText,
                styles.invertedPressableBlueText,
              ]}
            />
            {showEncryptedFieldsData && (
              <View style={styles.encryptedFieldsContainer}>
                <Text style={[styles.defaultText, styles.defaultBoldText]}>
                  {Strings.encryptedFieldsHeader}
                </Text>
                <Text>{preparedPaymentRequest?.encryptedFields}</Text>
              </View>
            )}

            <DefaultPressable
              text={Strings.copyEncryptedFieldsButtonLabel}
              onPress={copyEncryptedFieldsToClipboard}
              pressableStyle={[
                styles.defaultPressable,
                styles.invertedPressable,
              ]}
              pressableTextStyle={[
                styles.defaultPressableText,
                styles.invertedPressableText,
              ]}
            />

            <DefaultPressable
              text={Strings.returnToStartButtonLabel}
              onPress={() => {
                navigation.popToTop();
              }}
              pressableStyle={[
                styles.defaultPressable,
                styles.invertedPressableRed,
              ]}
              pressableTextStyle={[
                styles.defaultPressableText,
                styles.invertedPressableRedText,
              ]}
            />
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
        duration={1250}
      >
        {snackBarText}
      </Snackbar>
    </View>
  );

  async function copyEncryptedFieldsToClipboard() {
    if (preparedPaymentRequest?.encryptedFields !== undefined) {
      await Clipboard.setStringAsync(preparedPaymentRequest.encryptedFields);
      setSnackBarText(Strings.copiedEncryptedFieldsLabel);
      setShowSnackBar(true);
    } else {
      setSnackBarText(Strings.emptyEncryptedFieldsLabel);
      setShowSnackBar(true);
    }
  }
}
