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
import { KeyboardType, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { Strings } from '../constants/Strings';

interface Props {
  keyboardType?: KeyboardType;
  placeholder?: string;
  value?: string;
  onChangeText: (value: string) => void;
  hasError: boolean;
  suffixIconSource: IconSource;
  openBottomSheet: () => void;
}

export default function RequiredTextInput({
  keyboardType,
  placeholder,
  value,
  onChangeText,
  hasError,
  suffixIconSource,
  openBottomSheet,
}: Props) {
  return (
    <View>
      <TextInput
        keyboardType={keyboardType}
        style={styles.inputTextField}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        error={hasError}
        right={
          suffixIconSource && (
            <TextInput.Icon
              icon={suffixIconSource}
              forceTextInputFocus={false}
              onPress={openBottomSheet}
            />
          )
        }
      />
      {hasError ? (
        <HelperText type="error">
          {Strings.emptyFieldValidationMessage}
        </HelperText>
      ) : null}
    </View>
  );
}
