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

// @ts-ignore
import React from 'react';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import SessionPaymentConfiguration from './session_payment_configuration';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnlinePaymentsContextProvider from './contexts/SessionContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardDetail from './card_detail';
import PaymentProductsOverview from './payment_products_overview';
import { styles } from '@/styles/Style';
import SelectedPaymentProductContextProvider from './contexts/SelectedPaymentProductContext';
import { StatusBar } from 'expo-status-bar';
import PreparedWalletPaymentRequestContextProvider from './contexts/PreparedWalletPaymentRequestContext';
import EndScreen from './end_screen';
import PreparedCardPaymentRequestContextProvider from './contexts/PreparedCardPaymentRequestContext';

export type RootStackParamList = {
  SessionPaymentConfiguration: undefined;
  PaymentProductsOverview: undefined;
  CardDetail: undefined;
  EndScreen: undefined;
};

function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <OnlinePaymentsContextProvider>
      <SelectedPaymentProductContextProvider>
        <PreparedWalletPaymentRequestContextProvider>
          <PreparedCardPaymentRequestContextProvider>
            <NavigationContainer>
              <StatusBar />
              <GestureHandlerRootView style={styles.gestureHandler}>
                <Stack.Navigator
                  screenOptions={{
                    headerTitle: '',
                    headerTintColor: 'black',
                    headerStyle: {
                      backgroundColor: '#f2f2f2',
                    },
                    headerShadowVisible: false,
                  }}
                >
                  <Stack.Screen
                    name="SessionPaymentConfiguration"
                    component={SessionPaymentConfiguration}
                  />
                  <Stack.Screen
                    name="PaymentProductsOverview"
                    component={PaymentProductsOverview}
                  />
                  <Stack.Screen name="CardDetail" component={CardDetail} />
                  <Stack.Screen name="EndScreen" component={EndScreen} />
                </Stack.Navigator>
              </GestureHandlerRootView>
            </NavigationContainer>
          </PreparedCardPaymentRequestContextProvider>
        </PreparedWalletPaymentRequestContextProvider>
      </SelectedPaymentProductContextProvider>
    </OnlinePaymentsContextProvider>
  );
}

registerRootComponent(App);
