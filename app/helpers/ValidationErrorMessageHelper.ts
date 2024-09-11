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

import {
  ValidationErrorMessage,
  ValidationRuleLength,
  ValidationRuleRange,
  ValidationType,
} from 'onlinepayments-sdk-client-reactnative';
import { Strings } from '../constants/Strings';

export class ValidationErrorMessageHelper {
  static getErrorMessage(
    validationErrorMessage?: ValidationErrorMessage
  ): string | undefined {
    if (validationErrorMessage === undefined) {
      return undefined;
    } else if (
      validationErrorMessage.rule?.validationType === ValidationType.Length
    ) {
      return this.validationErrorLength(
        validationErrorMessage.rule as ValidationRuleLength
      );
    } else if (
      validationErrorMessage.rule?.validationType === ValidationType.Range
    ) {
      return this.validationErrorRange(
        validationErrorMessage.rule as ValidationRuleRange
      );
    } else {
      return Strings.getErrorMessage(validationErrorMessage.errorMessage);
    }
  }

  static validationErrorLength(
    validationRuleLength: ValidationRuleLength
  ): string | undefined {
    if (validationRuleLength.minLength === validationRuleLength.maxLength) {
      const errorMessage = Strings.getErrorMessage('length.exact');
      return errorMessage.replaceAll(
        '{maxLength}',
        validationRuleLength.maxLength.toString()
      );
    } else if (
      validationRuleLength.minLength === 0 &&
      validationRuleLength.maxLength > 0
    ) {
      const errorMessage = Strings.getErrorMessage('length.max');
      return errorMessage.replaceAll(
        '{maxLength}',
        validationRuleLength.maxLength.toString()
      );
    } else if (
      validationRuleLength.minLength > 0 &&
      validationRuleLength.maxLength > 0
    ) {
      let errorMessage = Strings.getErrorMessage('length.between');
      errorMessage = errorMessage.replaceAll(
        '{minLength}',
        validationRuleLength.minLength.toString()
      );
      return errorMessage.replaceAll(
        '{maxLength}',
        validationRuleLength.maxLength.toString()
      );
    } else {
      return undefined;
    }
  }

  static validationErrorRange(
    validationRuleRange: ValidationRuleRange
  ): string | undefined {
    let errorMessage = Strings.getErrorMessage('range');
    errorMessage = errorMessage.replaceAll(
      '{minValue}',
      validationRuleRange.minValue.toString()
    );
    return errorMessage.replaceAll(
      '{maxValue}',
      validationRuleRange.maxValue.toString()
    );
  }
}
