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

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { EncryptedRequest } from 'onlinepayments-sdk-client-reactnative';

interface EncryptedRequestContextInterface {
  encryptedRequest?: EncryptedRequest;
  setEncryptedRequest: Dispatch<SetStateAction<EncryptedRequest | undefined>>;
}

export const EncryptedRequestContext =
  createContext<EncryptedRequestContextInterface>(
    {} as EncryptedRequestContextInterface
  );

export default function EncryptedRequestContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [encryptedRequest, setEncryptedRequest] = useState<EncryptedRequest>();

  return (
    <EncryptedRequestContext.Provider
      value={{
        encryptedRequest,
        setEncryptedRequest,
      }}
    >
      {children}
    </EncryptedRequestContext.Provider>
  );
}
