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
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
  pressableStyle: StyleProp<ViewStyle>;
  pressableTextStyle: StyleProp<TextStyle>;
}

export default function DefaultPressable({
  text,
  onPress,
  pressableStyle,
  pressableTextStyle,
}: Props) {
  return (
    <Pressable style={pressableStyle} onPress={onPress}>
      <Text style={pressableTextStyle}>{text}</Text>
    </Pressable>
  );
}
