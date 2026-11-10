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

import { Alert } from 'react-native';
import {
  CommunicationError,
  ErrorResponse,
  ResponseError,
  SdkError,
} from 'onlinepayments-sdk-client-reactnative';
import { Strings } from '../constants/Strings';

export class SdkErrorHelper {
  static showError(error: unknown) {
    const { title, message } = SdkErrorHelper.describe(error);
    Alert.alert(title, message);
  }

  static describe(error: unknown): { title: string; message: string } {
    if (error instanceof ResponseError) {
      const apiError = (error.metadata as ErrorResponse | undefined)
        ?.errors?.[0];
      return {
        title: Strings.apiErrorTitle,
        message: apiError?.message ?? apiError?.errorCode ?? error.message,
      };
    }

    if (error instanceof CommunicationError) {
      const status =
        error.httpStatusCode !== undefined
          ? ` (HTTP ${error.httpStatusCode})`
          : '';
      return {
        title: Strings.communicationErrorTitle,
        message: `${Strings.communicationErrorMessage}${status}`,
      };
    }

    if (error instanceof SdkError) {
      return { title: Strings.sdkErrorTitle, message: error.message };
    }

    return {
      title: Strings.defaultErrorTitle,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
