import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ScrollView, PickerIOS, Platform
} from 'react-native';
import {
  Left, Body, Right, List, ListItem
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import moment from 'moment';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import Dialog from 'react-native-dialog';
// import Picker from 'react-native-wheel-picker';
import {
  updateWeight,
  updateHeight,
  updateBmi,
  updateGender,
  updateDob
} from '../../store/actions/index';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { BASE_URL, headers } from '../../api/config/Config';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  uName: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
  uBmi: state.User.bmi,
  uDob: state.User.dob,
  uGender: state.User.gender
});

const mapDispatchToProps = dispatch => ({
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedBmi: bmi => dispatch(updateBmi(bmi)),
  updatedGender: gender => dispatch(updateGender(gender)),
  updatedDob: dob => dispatch(updateDob(dob))
});

// const PickerItem = Picker.Item;
const PickerItemIOS = PickerIOS.Item;
export class PersonalSetting extends Component {
  constructor(props) {
    super(props);
    const { uHeight, uWeight, uBmi } = this.props;
    this.state = {
      gender: 'Male',
      dobText: '',
      udobDate: null,
      modalVisible: false,
      changeDataHeight: false,
      changeDataWeight: false,
      selectedHeight: uHeight === '' ? 0 : uHeight,
      selectedWeight: uWeight === '' ? 0 : uWeight,
      userBmi: uBmi === '' ? 0 : uBmi,
      tempHeight: uHeight === '' ? 0 : uHeight,
      tempWeight: uWeight === '' ? 0 : uWeight,
      genderIndex: '',
      weightList: [],
      heightList: []
    };
    const { weightList, heightList } = this.state;
    for (let i = 0; i <= 300; i += 1) {
      heightList[i] = i;
    }
    for (let i = 0; i <= 634; i += 1) {
      weightList[i] = i;
    }
  }

  componentWillMount() {
    const {
      uName, updatedHeight, updatedWeight, updatedGender, updatedBmi, updatedDob
    } = this.props;
    fetch(`${BASE_URL}/api/user/id`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: uName })
    }).then(response => response.json())
      .then((responseJson) => {
        updatedHeight(responseJson.height);
        updatedWeight(responseJson.weight);
        updatedGender(responseJson.gender ? responseJson.gender : null);
        updatedBmi(CalculateBmi(responseJson.height, responseJson.weight));
        this.setState({
          selectedHeight: responseJson.height,
          selectedWeight: responseJson.weight,
          userBmi: CalculateBmi(responseJson.height, responseJson.weight),
        });
        updatedDob(responseJson.dob);
        this.setState({ genderIndex: this.condition(responseJson) });
      }).catch((err) => { console.log('Network Error', err); });
  }

  onPickerSelect(index, selectedChoice) {
    if (selectedChoice === 'height') {
      this.setState({ tempHeight: index });
    } else {
      this.setState({ tempWeight: index });
    }
  }

  onAddItem = (selectedChoice) => {
    const {
      uName, updatedHeight, updatedBmi, updatedWeight
    } = this.props;
    const {
      tempHeight, tempWeight, heightList, weightList
    } = this.state;
    fetch(`${BASE_URL}/api/userData`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        height: heightList[tempHeight],
        weight: weightList[tempWeight],
      })
    }).then(response => response.json())
      .then(() => {
        updatedHeight(heightList[tempHeight]);
        updatedWeight(weightList[tempWeight]);
        this.setState({
          selectedHeight: tempHeight,
          selectedWeight: tempWeight,
          userBmi: CalculateBmi(heightList[tempHeight], weightList[tempWeight])
        });
      })
      .then(updatedBmi(CalculateBmi(heightList[tempHeight], weightList[tempWeight])))
      .catch((err) => { console.log('Network Error', err); });

    this.toggleChangeDataModal(selectedChoice);
  }

  condition = (responseJson) => {
    if (responseJson.gender === 'Male') {
      return 0;
    }
    if (responseJson.gender === 'Female') {
      return 1;
    }
    if (responseJson.gender === 'Others') {
      return 2;
    }
    return null;
  }

  onDOBPress = async () => {
    const { udobDate } = this.state;
    let dobDate = udobDate;

    if (!dobDate || dobDate === null) {
      dobDate = new Date(moment().year() - 12, 0, 0);
      this.setState({ udobDate: dobDate });
    }
    // To open the dialog
    // this.refs.dobDailog.open({
    this.dobDialog.open({
      mode: 'spinner',
      date: dobDate,
      maxDate: new Date(moment().year() - 12, 0, 0, 0), // To restirct future date,
      minDate: new Date(moment().year() - 99, 0, 0, 0) // To restrict past date to 100 year
    });
  }

  onDOBDatePicked = async (date) => {
    const { uName, updatedDob } = this.props;
    await this.setState({
      dobDate: date,
      dobText: moment(date).format('MM-DD-YYYY')
    });
    await updatedDob(date);
    fetch(`${BASE_URL}/api/user/updateUserDob`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        dob: moment(date).format('MM-DD-YYYY')
      })
    }).then((response) => { response.json(); })
      .then(await this.setState({
        dobDate: date,
        dobText: moment(date).format('MM-DD-YYYY')
      })).catch((err) => { console.log('Network Error', err); });
  }

  onSelect = (index, value) => {
    this.setState({
      gender: value,
      genderIndex: index
    });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible,
      genderIndex: prevState.genderIndex
    }));
  }

  toggleChangeDataModal = async (selectedChoice, reverse = null) => {
    if (selectedChoice === 'height') {
      await this.setState(prevState => ({ changeDataHeight: !prevState.changeDataHeight }));
    } else {
      await this.setState(prevState => ({ changeDataWeight: !prevState.changeDataWeight }));
    }
    setTimeout(() => {
      if (reverse) {
        this.setPrevData(selectedChoice);
      }
    }, 1);
  }

  setPrevData = (selectedChoice) => {
    const { selectedHeight, selectedWeight } = this.state;
    if (selectedChoice === 'height') {
      this.setState({ tempHeight: selectedHeight });
    } else {
      this.setState({ tempWeight: selectedWeight });
    }
  }

  submitGender = () => {
    const { gender } = this.state;
    const { uName, updatedGender } = this.props;
    this.toggleModal();
    updatedGender(gender);
    fetch(`${BASE_URL}/api/user/updateUserGender`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        gender
      })
    }).then((response) => {
      response.json();
    })
      .catch((err) => { console.log('Network Error', err); });
  }

  pageSelect = (index) => {
    const { uDob } = this.props;
    if (index === 1) {
      if (uDob) {
        if (uDob === '') {
          this.onDOBPress();
        }
      } else { this.onDOBPress(); }
    }
    if (index === 2) {
      this.toggleModal();
    }
    if (index === 4) {
      this.toggleChangeDataModal('height');
    }
    if (index === 5) {
      this.toggleChangeDataModal('weight');
    }
  }

  render() {
    const { uName, uDob, uGender } = this.props;
    const {
      modalVisible, genderIndex, changeDataHeight, changeDataWeight, selectedHeight, userBmi,
      selectedWeight, weightList, heightList, tempHeight, tempWeight
    } = this.state;
    const list = [
      { name: 'Display Name', func: '', label: uName },
      { name: 'Date of Birth', func: '', label: uDob ? moment(uDob).format('LL') : 'Set D.O.B' },
      { name: 'Gender', func: '', label: uGender === '' || uGender === null ? 'Set Gender' : uGender },
      { name: 'BMI', func: '', label: userBmi === '' || userBmi === '0.00' ? 'N.A.' : userBmi },
      { name: 'Height', func: 'ChangeHeight', label: selectedHeight === 0 || !Number.isFinite(selectedHeight) ? 'Set height' : (`${selectedHeight} cm`) },
      { name: 'Weight', func: 'ChangeWeight', label: selectedWeight === 0 || !Number.isFinite(selectedWeight) ? 'Set weight' : (`${selectedWeight} kg`) }];
    return (
      <View style={styles.container}>
        <Dialog.Container visible={modalVisible}>
          <Dialog.Title style={{ color: 'black', alignSelf: 'center' }}>
            {'Select Gender'}
          </Dialog.Title>
          <RadioGroup selectedIndex={genderIndex} style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row' }} color="black" onSelect={(index1, value) => this.onSelect(index1, value)}>

            <RadioButton value="Male" color="black">
              <Text style={{ fontFamily: 'System', color: 'black', fontSize: 16 }}>Male</Text>
            </RadioButton>


            <RadioButton value="Female" color="black">
              <Text style={{ fontFamily: 'System', color: 'black', fontSize: 16 }}>Female</Text>
            </RadioButton>


            <RadioButton value="Others" color="black">
              <Text style={{ fontFamily: 'System', color: 'black', fontSize: 16 }}>Others</Text>
            </RadioButton>

          </RadioGroup>

          <Dialog.Button label="Cancel" onPress={this.toggleModal} />
          <Dialog.Button label="Submit" onPress={this.submitGender} />
        </Dialog.Container>

        <Dialog.Container
          visible={changeDataHeight}
          style={{ borderRadius: 50, flex: 1 }}
        >
          <Dialog.Title style={{ alignSelf: 'center' }}>
            <Text style={{ fontFamily: 'System', fontSize: 20, fontWeight: 'normal' }}>
              {`Selected Height ${tempHeight}`}
            </Text>
          </Dialog.Title>
          <View style={styles.dailogPickerStyle}>
            {Platform.OS === 'ios'
              ? (
                <PickerIOS
                  style={{ width: 100, height: 40 }}
                  selectedValue={tempHeight}
                  itemStyle={{ fontFamily: 'System', color: 'black', fontSize: 26 }}
                  onValueChange={height => this.onPickerSelect(height, 'height')}
                >
                  {heightList.map((height, i) => (
                    <PickerItemIOS label={height.toString()} value={i} key={`number${height.toString()}`} />
                  ))}
                </PickerIOS>
              ) : (
                // <Picker
                //   style={{ width: 100, height: 120 }}
                //   selectedValue={tempHeight}
                //   itemStyle={{ fontFamily: 'System', color: 'black', fontSize: 26 }}
                //   onValueChange={height => this.onPickerSelect(height, 'height')}
                // >
                //   {heightList.map((height, i) => (
                //     <PickerItem label={height.toString()} value={i} key={`number${height.toString()}`} />
                //   ))}
                // </Picker>
                null
              )
            }
          </View>
          <Dialog.Button label="Cancel" onPress={() => this.toggleChangeDataModal('height', true)} />
          <Dialog.Button label="OK" onPress={() => this.onAddItem('height')} />
        </Dialog.Container>

        <Dialog.Container
          visible={changeDataWeight}
          style={{ borderRadius: 50 }}
        >
          <Dialog.Title style={{ alignSelf: 'center' }}>
            <Text style={{ fontFamily: 'System', fontSize: 20, fontWeight: 'normal' }}>
              {`Selected Weight ${tempWeight}`}
            </Text>
          </Dialog.Title>
          <View style={styles.dailogPickerStyle}>
            {Platform.OS === 'ios'
              ? (
                <PickerIOS
                  style={{ width: 100, height: 40 }}
                  selectedValue={tempWeight}
                  itemStyle={{ fontFamily: 'System', color: 'black', fontSize: 26 }}
                  onValueChange={weight => this.onPickerSelect(weight, 'weight')}
                >
                  {weightList.map((weight, i) => (
                    <PickerItemIOS label={weight.toString()} value={i} key={`number${weight.toString()}`} />
                  ))}
                </PickerIOS>
              ) : (
                // <Picker
                //   style={{ width: 100, height: 120 }}
                //   selectedValue={tempWeight}
                //   itemStyle={{ fontFamily: 'System', color: 'black', fontSize: 26 }}
                //   onValueChange={weight => this.onPickerSelect(weight, 'weight')}
                // >
                //   {weightList.map((weight, i) => (
                //     <PickerItem label={weight.toString()} value={i} key={`number${weight.toString()}`} />
                //   ))}
                // </Picker>
                null
              )
            }
          </View>
          <Dialog.Button label="Cancel" onPress={() => this.toggleChangeDataModal('weight', true)} />
          <Dialog.Button label="OK" onPress={() => this.onAddItem('weight')} />
        </Dialog.Container>

        <ScrollView contentContainerStyle={{ flex: 1, marginTop: 10 }}>
          <View style={styles.touchID}>
            <List>
              {list.map((Names, i) => (
                <ListItem key={Names.func} onPress={({ Name = Names.func }) => { this.pageSelect(i, Name); }}>
                  <Left>
                    <View style={styles.list}>
                      <View><Text style={styles.listText}>{Names.name}</Text></View>
                    </View>
                  </Left>
                  <Body>
                    <Text style={{
                      fontSize: 14, color: 'grey', alignSelf: 'flex-end', ...valueFontStyle
                    }}
                    >
                      {Names.label}
                    </Text>
                  </Body>
                  {i === 4 || i === 5
                    ? <Right>
                      <Icon name="angle-right" size={20} color="grey" />
                    </Right>
                    : null
                  }
                </ListItem>
              ))}
            </List>
          </View>
        </ScrollView>
        <DatePickerDialog ref={(foc) => { this.dobDialog = foc; }} onDatePicked={this.onDOBDatePicked} />
      </View>
    );
  }
}

const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const valueFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  authModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  authModeText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10
  },
  dailogPickerStyle: {
    ...Platform.select({
      ios: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'flex-start'
      },
      android: {
        height: 130,
        alignItems: 'center',
        justifyContent: 'flex-start'
      }
    }),
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    width: 130,
    marginRight: 75,
    marginLeft: 75,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  logoutContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    borderBottomColor: 'grey',
    borderTopColor: 'grey',
    borderWidth: 1
  },

  imageFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  list: { flexDirection: 'row' },
  listText: {
    fontSize: 16,
    color: 'black',
    ...itemFontStyle
  },
  image: {
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 150,
    borderRadius: 75
  },
  imagesrc: {
    height: 150,
    width: 150,
    borderRadius: 75
  },
  userName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  touchID: {
    flex: 3,
    justifyContent: 'flex-start'
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  modal: {
    paddingVertical: 200,
    width: 320,
    alignSelf: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSetting);
