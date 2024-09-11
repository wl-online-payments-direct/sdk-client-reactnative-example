import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gestureHandler: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingBottom: 20,
    gap: 20,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 20,
  },
  bottomSheetContainer: {
    marginHorizontal: 25,
    marginTop: 25,
  },
  endScreenContainer: {
    alignItems: 'center',
  },
  endScreenButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  encryptedFieldsContainer: {
    alignItems: 'center',
  },
  merchantLogo: {
    width: '100%',
    height: 100,
  },
  lockLogo: {
    width: '5%',
    height: 20,
  },
  securePaymentText: {
    fontSize: 16,
    color: 'limegreen',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputTextField: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: 'white',
    textAlign: 'auto',
  },
  disabledInputTextField: {
    backgroundColor: 'lightGray',
  },
  defaultPressable: {
    backgroundColor: 'forestgreen',
    borderColor: 'forestgreen',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  defaultPressableText: {
    color: 'white',
    fontSize: 18,
  },
  invertedPressable: {
    backgroundColor: 'white',
    borderColor: 'forestgreen',
  },
  invertedPressableText: {
    color: 'forestgreen',
    fontSize: 18,
  },
  pasteJsonPressable: {
    alignSelf: 'flex-end',
  },
  invertedPressableBlue: {
    backgroundColor: 'white',
    borderColor: 'dodgerblue',
  },
  invertedPressableBlueText: {
    color: 'dodgerblue',
  },
  invertedPressableRed: {
    backgroundColor: 'white',
    borderColor: 'red',
  },
  invertedPressableRedText: {
    color: 'red',
  },
  defaultText: {
    fontSize: 17,
  },
  defaultBoldText: {
    fontWeight: 'bold',
  },
  textWithTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  background: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  accountsOnFileFlatList: {
    paddingBottom: 40,
  },
  paymentProductsFlatList: {
    gap: 20,
  },
  paymentProductItem: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    gap: 10,
    borderColor: 'lightgray',
    borderRadius: 20,
    borderWidth: 0.75,
    backgroundColor: 'white',
  },
  paymentProductIcon: {
    height: 25,
    width: 40,
  },
  successTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  cardProductLogo: {
    width: 30,
    height: 25,
  },
  cardInputRow: {
    gap: 10,
    alignItems: 'flex-start',
  },
  cardInputRowView: {
    flex: 1,
  },
});
