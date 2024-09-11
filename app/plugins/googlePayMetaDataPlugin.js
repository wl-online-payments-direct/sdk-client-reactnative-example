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

/* eslint-disable @typescript-eslint/no-require-imports */
const { withAndroidManifest } = require('@expo/config-plugins');

// Plugin used to add the correct meta data to the AndroidManifest to enable usage of GooglePay
module.exports = function googlePayMetaDataPlugin(config) {
  return withAndroidManifest(config, async (configuration) => {
    const googlePayMetaDataTag = {
      $: {
        'android:name': 'com.google.android.gms.wallet.api.enabled',
        'android:value': 'true',
      },
    };
    configuration.modResults.manifest.application[0]['meta-data'].push(
      googlePayMetaDataTag
    );

    return configuration;
  });
};
