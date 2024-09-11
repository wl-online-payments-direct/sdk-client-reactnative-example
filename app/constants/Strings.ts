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

export class Strings {
  /* Initialize session page */
  static merchantLogoLabel = 'Merchant logo';
  static lockLogoLabel = 'Security lock';
  static securePaymentLabel = 'Secure payment';
  static proceedButtonLabel = 'Proceed to checkout';

  // Client Session Details
  static clientSessionDetailsHeader = 'Client session details';
  static clientSessionIdLabel = 'Client session ID';
  static clientSessionIdTooltip =
    'Returned in the Server to Server Create Client Session call. This is the identifier of the current session.';
  static customerIdLabel = 'Customer ID';
  static customerIdTooltip =
    'Returned in the Server to Server Create Client Session call. This is a temporary identifier for you within the session.';
  static clientApiUrlLabel = 'Client API URL';
  static clientApiUrlTooltip =
    'Returned in the Server to Server Create Client Session call. This URL points to the Online Payments Client API.';
  static assetsUrlLabel = 'Assets URL';
  static assetsUrlTooltip =
    'Returned in the Server to Server Create Client Session call. This URL can be used to retrieve static resources, such as payment product logo images.';
  static pasteJsonButtonLabel = 'Paste client session JSON response';

  /* Payment Details */
  static paymentDetailsHeader = 'Payment details';
  static amountInCentsLabel = 'Amount in cents';
  static amountInCentsTooltip =
    'The amount that will be used for this payment. Note that the value must be provided in the smallest possible denominator for the currency.';
  static countryCodeLabel = 'Country code';
  static countryCodeTooltip =
    'The ISO 3166-1 alpha-2 standard 2-letter Country Code of the consumer.';
  static currencyCodeLabel = 'Currency code';
  static currencyCodeTooltip =
    'The ISO 4217 standard 3-letter Currency Code of the currency in which the payment will be made.';

  /* Other options */
  static otherOptionsHeader = 'Other options';
  static recurringPaymentLabel = 'Payment is recurring';
  static recurringPaymentTooltip =
    'Indicates whether the payment product that is used for this payment should support recurring payments. If enabled, products not supporting recurring will be filtered.';
  static enableLoggingLabel = 'Enable logging';
  static enableLoggingTooltip =
    'Indicates whether requests and responses should be logged to the console.';
  static applePayLabel = 'Apple Pay';
  static googlePayLabel = 'Google Pay';
  static merchantIdLabel = 'Merchant ID';
  static merchantIdTooltip =
    'Your Worldline merchant ID. You can find this ID in the Configuration Center.';
  static merchantNameLabel = 'Merchant name';
  static merchantNameTooltip =
    'The name of your business which will be shown to customers in the Payment Sheet and in payment overviews.';

  /* Payment Products Overview */
  static accountsOnFileHeader = 'Previously used accounts';
  static paymentProductsHeader = 'Other payment products';
  static productNotAvailableTitle = 'Product unavailable';
  static productNotAvailableMessage =
    'The product you selected is currently not available, please select another one.';

  /* Card Detail */
  static rememberPaymentDetailsLabel =
    'Remember my payment details \nfor future purchases';
  static payButtonLabel = 'Pay';
  static iinNotEnoughDigitsLabel =
    'Not enough digits were entered. Please enter at least 6 digits';
  static errorRetrievingProductLabel =
    'The product could not be retrieved. Please select another product';

  /* End screen */
  static successHeader = 'Success!';
  static endScreenInstructionLabel =
    'Tap below to copy the encrypted fields that must be used in the Create Payment request.';
  static showEncryptedFieldsButtonLabel = 'Show encrypted fields data';
  static hideEncryptedFieldsButtonLabel = 'Hide encrypted fields data';
  static encryptedFieldsHeader = 'Encrypted fields:';
  static copyEncryptedFieldsButtonLabel = 'Copy encrypted fields to clipboard';
  static copiedEncryptedFieldsLabel = 'Encrypted fields copied successfully';
  static emptyEncryptedFieldsLabel =
    'Encrypted fields are empty, so could not be copied';
  static returnToStartButtonLabel = 'Return to start';

  /* Errors */
  static defaultErrorTitle = 'Something went wrong';
  static apiErrorTitle = 'API error';
  static nativeExceptionTitle = 'Native exception';
  static parsingFailedTitle = 'Parsing failed';
  static parsingFailedMessage =
    'Please paste a properly formatted JSON string.';
  static emptyFieldValidationMessage = 'This field should not be empty';
  static undefinedBasicPaymentProductsMessage =
    'Basic payment products are undefined';
  static undefinedPaymentProductTitle = 'Undefined payment product';
  static undefinedPaymentProductValidationMessage =
    'The selected payment product is undefined, so the input fields could not be validated.';
  static undefinedPaymentProductEncryptionMessage =
    'The selected payment product is undefined, so the payment request cannot be encrypted.';
  static invalidCard = 'Please provide a valid card number';
  static unsupportedCard =
    'The card you entered is not supported. Please enter another card or try another payment method.';
  static merchantIdNotFoundMessage =
    'Could not find merchant id. Please try again by re-instantiating your Session and ensure you provide a merchant id.';
  static merchantNameNotFoundMessage =
    'Could not find merchant name. Please try again by re-instantiating your Session and ensure you provide a merchant name.';
  static noInformationGatewayMessage =
    "We are unable to retrieve information about the selected payment product's gateway. \n\n Please check your internet connection and the provided client session identifier and customer identifier.";
  static noInformationNetworksMessage =
    "We are unable to retrieve information about the selected payment product's networks. \n\n Please check your internet connection and the provided client session identifier and customer identifier.";

  /* Validation error messages */
  static defaultValidationError = 'Please provide a valid value';
  static validationErrorMessagesMap = new Map<string, string>([
    [
      'allowedInContext',
      'The card you entered is not supported. Please enter another card or try another payment method.',
    ],
    [
      'cardholderName',
      'Please provide the name as exactly written on your card',
    ],
    ['emailAddress', 'Please provide a valid email address'],
    ['expirationDate', 'Please provide a valid expiration date'],
    ['fixedList', 'Please select one of the values from the list'],
    ['iban', 'Please enter a valid IBAN'],
    ['iin', 'Please provide a valid card number'],
    ['invalidContent', 'Please provide a value of the correct format'],
    [
      'length.between',
      'Please provide a value between {minLength} and {maxLength} characters',
    ],
    [
      'length.exact',
      'Please provide a value of exactly {maxLength} characters',
    ],
    ['length', 'Please provide a value of the correct length'],
    [
      'length.max',
      'Please provide a value of maximum of {maxLength} characters',
    ],
    ['luhn', 'Please provide a valid card number'],
    ['range', 'Please provide a value between {minValue} and {maxValue}'],
    ['regularExpression', 'Please provide a value of the correct format'],
    ['required', 'Please provide a value'],
    [
      'residentIdName',
      'Please provide the exact name as written on your Resident Identity Card',
    ],
    [
      'residentIdNumber',
      'Please provide the exact number as written on your Resident Identity Card',
    ],
    ['termsAndConditions', 'Please accept the terms and conditions'],
  ]);

  static getErrorMessage(errorMessageKey: string): string {
    return (
      this.validationErrorMessagesMap.get(errorMessageKey) ??
      Strings.defaultValidationError
    );
  }
}
