/*
 * Do not remove or alter the notices in this preamble.
 *
 * This software is owned by Worldline and may not be be altered, copied, reproduced, republished, uploaded, posted, transmitted or distributed in any way, without the prior written consent of Worldline.
 *
 * Copyright © 2026 Worldline and/or its affiliates.
 *
 * All rights reserved. License grant and user rights and obligations according to the applicable license agreement.
 *
 * Please contact Worldline for questions regarding license and user rights.
 */

import {
  PaymentProductField,
  ValidationErrorMessage,
} from 'onlinepayments-sdk-client-reactnative';
import { Strings } from '../constants/Strings';

// Used to read the allowed values of the length and range validation rules
interface LengthRuleParameters {
  minLength?: number;
  maxLength?: number;
}

interface RangeRuleParameters {
  minValue?: number;
  maxValue?: number;
}

export class ValidationErrorMessageHelper {
  static getErrorMessage(
    validationErrorMessage?: ValidationErrorMessage,
    field?: PaymentProductField
  ): string | undefined {
    if (validationErrorMessage === undefined) {
      return undefined;
    }

    // ValidationRuleType is not exported by the SDK, so the type is compared as a string
    const type: string = validationErrorMessage.type;
    const rule = field?.dataRestrictions.getValidationRule(
      validationErrorMessage.type
    );

    switch (type) {
      case 'length':
        return (
          this.validationErrorLength(
            rule as LengthRuleParameters | undefined
          ) ?? Strings.getErrorMessage('length')
        );
      case 'range':
        return (
          this.validationErrorRange(rule as RangeRuleParameters | undefined) ??
          // If the allowed values are unknown, use the SDK message
          validationErrorMessage.errorMessage
        );
      default:
        return Strings.getErrorMessage(type);
    }
  }

  private static validationErrorLength(
    rule?: LengthRuleParameters
  ): string | undefined {
    const minLength = rule?.minLength;
    const maxLength = rule?.maxLength;

    if (minLength === undefined || maxLength === undefined) {
      return undefined;
    } else if (minLength === maxLength) {
      return Strings.getErrorMessage('length.exact').replaceAll(
        '{maxLength}',
        maxLength.toString()
      );
    } else if (minLength === 0 && maxLength > 0) {
      return Strings.getErrorMessage('length.max').replaceAll(
        '{maxLength}',
        maxLength.toString()
      );
    } else if (minLength > 0 && maxLength > 0) {
      return Strings.getErrorMessage('length.between')
        .replaceAll('{minLength}', minLength.toString())
        .replaceAll('{maxLength}', maxLength.toString());
    } else {
      return undefined;
    }
  }

  private static validationErrorRange(
    rule?: RangeRuleParameters
  ): string | undefined {
    const minValue = rule?.minValue;
    const maxValue = rule?.maxValue;

    if (minValue === undefined || maxValue === undefined) {
      return undefined;
    }

    return Strings.getErrorMessage('range')
      .replaceAll('{minValue}', minValue.toString())
      .replaceAll('{maxValue}', maxValue.toString());
  }
}
