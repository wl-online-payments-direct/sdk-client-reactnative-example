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
import { PaymentDetails } from '../session_payment_configuration/models/PaymentDetails';
import {
  BasicPaymentProducts,
  Session,
} from 'onlinepayments-sdk-client-reactnative';

interface SessionContextInterface {
  session?: Session;
  setSession: Dispatch<SetStateAction<Session | undefined>>;
  paymentDetails: PaymentDetails;
  setPaymentDetails: Dispatch<SetStateAction<PaymentDetails>>;
  basicPaymentProducts?: BasicPaymentProducts;
  setBasicPaymentProducts: Dispatch<
    SetStateAction<BasicPaymentProducts | undefined>
  >;
}

export const SessionContext = createContext<SessionContextInterface>(
  {} as SessionContextInterface
);

export default function SessionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session>();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(
    new PaymentDetails()
  );
  const [basicPaymentProducts, setBasicPaymentProducts] =
    useState<BasicPaymentProducts>();

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        paymentDetails,
        setPaymentDetails,
        basicPaymentProducts,
        setBasicPaymentProducts,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
