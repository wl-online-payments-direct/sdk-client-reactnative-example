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

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { PreparedPaymentRequest } from 'onlinepayments-sdk-client-reactnative';

interface PreparedWalletPaymentRequestContextInterface {
  preparedWalletPaymentRequest?: PreparedPaymentRequest;
  setPreparedPaymentRequest: Dispatch<
    SetStateAction<PreparedPaymentRequest | undefined>
  >;
}

export const PreparedWalletPaymentRequestContext =
  createContext<PreparedWalletPaymentRequestContextInterface>(
    {} as PreparedWalletPaymentRequestContextInterface
  );

export default function PreparedWalletPaymentRequestContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preparedWalletPaymentRequest, setPreparedPaymentRequest] =
    useState<PreparedPaymentRequest>();

  return (
    <PreparedWalletPaymentRequestContext.Provider
      value={{
        preparedWalletPaymentRequest,
        setPreparedPaymentRequest,
      }}
    >
      {children}
    </PreparedWalletPaymentRequestContext.Provider>
  );
}
