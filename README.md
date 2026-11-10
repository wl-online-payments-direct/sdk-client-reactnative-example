# Online Payments React Native example
This example illustrates the use of the Online Payments React Native SDK and the services provided by the Online Payments platform.

The example uses version 2.x of the [Online Payments React Native SDK](https://www.npmjs.com/package/onlinepayments-sdk-client-reactnative). The SDK is initialized with the details of a Client Session, created by your server using one of our Server SDKs:

```ts
import { init } from 'onlinepayments-sdk-client-reactnative';

const sdk = init(
  { clientSessionId, customerId, clientApiUrl, assetUrl },
  { appIdentifier: 'Online Payments React Native Example' }
);

const basicPaymentProducts = await sdk.getBasicPaymentProducts(paymentContext);
```

Card payments are validated with `PaymentRequest.validate()` and encrypted with `sdk.encryptPaymentRequest()`. The resulting `encryptedCustomerInput` must be sent to your server and used in the Create Payment request.


Requirements
------------
The example is built with Expo SDK 58 (React Native 0.88) and requires:
- Node.js 22.13 or higher
- Android Studio with a recent Android SDK (the app targets Android 16, API level 36)
- Xcode 27 or higher with an iOS 16.4 or higher deployment target, for running on iOS

The example contains a custom native module for Apple Pay and Google Pay, so it cannot be run in Expo Go.

Installation
------------
To run this project, clone or download the source from Github and open the project in your preferred IDE.

Use the terminal to navigate to the root of the project and install its dependencies.
```bash
npm install
```

Once the dependencies have been installed, you can run the project.
Run Android by:
```bash
npm run android
```

Run iOS by:
```bash
npm run ios
```

If you previously ran an older version of this example (SDK 1.x or Expo SDK 51), regenerate the native projects first:
```bash
npx expo prebuild --clean
```