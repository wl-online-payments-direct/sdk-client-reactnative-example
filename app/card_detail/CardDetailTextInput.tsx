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

interface Props {
  editable?: boolean;
  keyboardType?: KeyboardType;
  placeholder?: string;
  value?: string;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onFocusLost: (unmaskedValue?: string) => void;
  errorMessage?: string;
  prefixIconSource: IconSource;
  suffixIconSource?: IconSource;
  openBottomSheet?: () => void;
}

export default function CardDetailInputField({
  editable,
  keyboardType,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onFocusLost,
  errorMessage,
  prefixIconSource,
  suffixIconSource,
  openBottomSheet,
}: Props) {
  const canBeEdited = editable ?? true;

  return (
    <View>
      <TextInput
        editable={canBeEdited}
        keyboardType={keyboardType}
        style={
          canBeEdited
            ? styles.inputTextField
            : [styles.inputTextField, styles.disabledInputTextField]
        }
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={() => onFocusLost(value)}
        error={errorMessage !== undefined}
        left={
          prefixIconSource && (
            <TextInput.Icon
              icon={prefixIconSource}
              forceTextInputFocus={false}
            />
          )
        }
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
      {errorMessage !== undefined ? (
        <HelperText type="error">{errorMessage}</HelperText>
      ) : null}
    </View>
  );
}
