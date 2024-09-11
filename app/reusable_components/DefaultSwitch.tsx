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
import { Switch } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: () => void;
}

export default function DefaultSwitch({ value, onValueChange }: Props) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: 'lightgray', true: 'forestgreen' }}
      thumbColor={'white'}
    />
  );
}
