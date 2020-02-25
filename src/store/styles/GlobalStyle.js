import {StyleSheet} from 'react-native';
import {
  boldButtonFont,
  defaultModalFont,
  fontMaker,
  regularButtonFont,
} from './fonts/FontMaker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  flexOne: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  centreAligned: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  whiteText: {
    color: '#fff',
    fontSize: 15,
    ...regularButtonFont,
  },
  blackText: {
    color: '#000',
    fontSize: 15,
    ...regularButtonFont,
  },
  enableButton: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
  },
  disableButton: {
    backgroundColor: '#757575',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
  },
});

export default styles;
