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

export class Constants {
  // Payment Products
  static applePayId = '302';
  static googlePayId = '320';
  static cardPaymentMethod = 'card';

  // Used to identify Card product fields
  static cardFieldId = 'cardNumber';
  static expiryDateFieldId = 'expiryDate';
  static cvvFieldId = 'cvv';
  static securityCodeFieldId = 'PinCode';
  static cardHolderFieldId = 'cardholderName';
}
