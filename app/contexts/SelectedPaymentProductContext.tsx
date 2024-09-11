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
import {
  AccountOnFile,
  PaymentProduct,
} from 'onlinepayments-sdk-client-reactnative';

interface SelectedPaymentProductContextInterface {
  selectedPaymentProduct?: PaymentProduct;
  selectedAccountOnFile?: AccountOnFile;

  setSelectedPaymentProduct: Dispatch<
    SetStateAction<PaymentProduct | undefined>
  >;
  setSelectedAccountOnFile: Dispatch<SetStateAction<AccountOnFile | undefined>>;
}

export const SelectedPaymentProductContext =
  createContext<SelectedPaymentProductContextInterface>(
    {} as SelectedPaymentProductContextInterface
  );

export default function SelectedPaymentProductContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedPaymentProduct, setSelectedPaymentProduct] =
    useState<PaymentProduct>();
  const [selectedAccountOnFile, setSelectedAccountOnFile] =
    useState<AccountOnFile>();

  return (
    <SelectedPaymentProductContext.Provider
      value={{
        selectedPaymentProduct,
        setSelectedPaymentProduct,
        selectedAccountOnFile,
        setSelectedAccountOnFile,
      }}
    >
      {children}
    </SelectedPaymentProductContext.Provider>
  );
}
