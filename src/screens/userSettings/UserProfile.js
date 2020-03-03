import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
  PickerIOS,
} from 'react-native';
// import {Toast} from 'native-base';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import ImagePickerCrop from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import moment from 'moment';
import {DatePickerDialog} from 'react-native-datepicker-dialog';
import Dialog from 'react-native-dialog';
// import Picker from 'react-native-wheel-picker';
import NetInfo from '@react-native-community/netinfo';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {Avatar} from '../../components/common/ui/react-native-elements';
// import {BASE_URL, headers} from '../../api/config/Config';
// import updateAssessmentsList from '../../store/actions/assessmentList';
// import updateAssessments from '../../components/utility/assessment/getAssessmentList';
// import CalculateBmi from '../../components/utility/bmi/Bmi';
// import {
//   updateUsername,
//   updateDob,
//   updateGender,
//   updateWeight,
//   updateHeight,
//   resetState,
//   updateBmi,
//   updateFetchedUrl,
//   updateUserSocialImage,
//   updateUserImageDetails,
//   updateLeaderBoardData,
// } from '../../store/actions/index';
// import {
//   setAssessmentType,
//   updateQuestions,
//   updateCurrentQuestion,
//   updateCurrentAnswerId,
// } from '../../store/actions/assessment';
import BottomZulTabs from '../../components/common/ui/navigation/BottomZulTabs';
// import themeCode from '../../components/utility/assessment/themeCodes';
import uploadImageHandler from '../../components/common/utility/userImage/GetUserImage';
// import GetAssessmentListService from '../../api/assessment/GetAssessmentListService';
import {
  fontMaker,
  regularButtonFont,
  defaultModalFont,
} from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  //   uName: state.User.name,
  //   currentAssessment: state.Assessment.currentAssessment,
  //   uSocialImage: state.User.socialImage,
  //   uHeight: state.User.height,
  //   uWeight: state.User.weight,
  //   uBmi: state.User.bmi,
  //   uDob: state.User.dob,
  //   uGender: state.User.gender,
  //   fetchedUrl: state.User.fetchedURL,
  //   imageDetails: {
  //     secure_url: state.User.imageDetails.secure_url,
  //     public_id: state.User.imageDetails.public_id,
  //     created_at: state.User.imageDetails.created_at,
  //   },
  //   wellAssessment: state.Assessment.wellnessAssessment,
});
const mapDispatchToProps = dispatch => ({
  //   updatedUserName: name => dispatch(updateUsername(name)),
  //   updatedWeight: weight => dispatch(updateWeight(weight)),
  //   updatedHeight: height => dispatch(updateHeight(height)),
  //   updatedGender: gender => dispatch(updateGender(gender)),
  //   updatedBmi: bmi => dispatch(updateBmi(bmi)),
  //   updatedDob: dob => dispatch(updateDob(dob)),
  //   updatedFetchedUrl: url => dispatch(updateFetchedUrl(url)),
  //   updatedUserSocialImage: uri => dispatch(updateUserSocialImage(uri)),
  //   ResetState: () => dispatch(resetState()),
  //   updatedUserImageDetails: imageDetails => updateUserImageDetails(imageDetails),
  //   SetAssessmentType: data => dispatch(setAssessmentType(data)),
  //   getAllQuestion: data => dispatch(updateQuestions(data)),
  //   getCurrentQuestion: data => dispatch(updateCurrentQuestion(data)),
  //   updatedCurrentAnswerId: data => dispatch(updateCurrentAnswerId(data)),
  //   updatedAssessmentsList: data => dispatch(updateAssessmentsList(data)),
  //   updatedLeaderBoardData: data => dispatch(updateLeaderBoardData(data)),
});
const width = Dimensions.get('window').width;
// const PickerItem = Picker.Item;
const PickerItemIOS = PickerIOS.Item;
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const {uHeight, uWeight, uBmi, uDob} = this.props;
    this.state = {
      isDialogVisible: false,
      spinner: false,
      spinner2: false,
      count: 0,
      inviteCode: '',
      wellnessAssessment: {},
      dob: uDob ? uDob : '',
      height: uHeight ? uHeight : '',
      weight: uWeight ? uWeight : '',
      bmi: uBmi ? uBmi : '',
      gender: 'Female',
      dobText: '',
      udobDate: null,
      modalVisible: false,
      changeDataHeight: false,
      changeDataWeight: false,
      selectedHeight: uHeight === 0 ? 122 : uHeight,
      selectedWeight: uWeight === 0 ? 24 : uWeight,
      tempHeight: uHeight === 0 ? 122 : uHeight,
      tempWeight: uWeight === 0 ? 24 : uWeight,
      genderIndex: '',
      weightList: [],
      heightList: [],
      cameraModel: false,
      showSCLAlert: false,
    };
    const {weightList, heightList} = this.state;
    for (let i = 0; i < 300; i += 1) {
      heightList[i] = i + 1;
    }
    for (let i = 0; i < 634; i += 1) {
      weightList[i] = i + 1;
    }
    // this._didFocusSubscription = props.navigation.addListener('didFocus', async () => { await this.userDataCollection(); });
  }

  componentDidMount() {
    const {navigation} = this.props;
    // fetch(`${BASE_URL}/api/user/id`, {
    //   method: 'POST',
    //   headers,
    //   body: JSON.stringify({name: uName}),
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     updatedHeight(responseJson.height);
    //     updatedWeight(responseJson.weight);
    //     updatedGender(responseJson.gender ? responseJson.gender : null);
    //     updatedBmi(CalculateBmi(responseJson.height, responseJson.weight));
    //     this.setState({
    //       selectedHeight: responseJson.height === 0 ? 122 : responseJson.height,
    //       selectedWeight: responseJson.weight === 0 ? 24 : responseJson.weight,
    //       userBmi: CalculateBmi(responseJson.height, responseJson.weight),
    //     });
    //     updatedDob(responseJson.dob);
    //     this.setState({genderIndex: this.condition(responseJson)});
    //   })
    //   .catch(err => {
    //     console.log('Network Error', err);
    //   });
    // this.updateWellnessAssessment();

    this.leaderBoardData();
    // this._didFocusSubscription = navigation.addListener('didFocus', () => this.userDataCollection());
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
  }

  condition = responseJson => {
    if (responseJson.gender === 'Male') {
      return 0;
    }
    if (responseJson.gender === 'Female') {
      return 1;
    }
    if (responseJson.gender === 'Others') {
      return 2;
    }
    return 1;
  };

  onAddItem = async selectedChoice => {
    const {
      uName,
      updatedHeight,
      updatedBmi,
      updatedWeight,
      uHeight,
      uWeight,
    } = this.props;
    const {tempHeight, tempWeight, heightList, weightList} = this.state;
    const heightCondition =
      selectedChoice === 'height' ? heightList[tempHeight] : uHeight;
    const weightCondition =
      selectedChoice === 'weight' ? weightList[tempWeight] : uWeight;
    const selectedHeightCondition =
      selectedChoice === 'height' ? tempHeight : uHeight === 0 ? 122 : uHeight;
    const selectedWeightCondition =
      selectedChoice === 'weight' ? tempWeight : uWeight === 0 ? 24 : uWeight;
    const stateHeightCondition =
      selectedChoice === 'height'
        ? heightList[tempHeight]
        : uHeight === 0
        ? 122
        : uHeight;
    const stateWeightCondition =
      selectedChoice === 'weight'
        ? weightList[tempWeight]
        : uWeight === 0
        ? 24
        : uWeight;
    await fetch(`${BASE_URL}/api/userData`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        height: heightCondition,
        weight: weightCondition,
      }),
    })
      .then(response => response.json())
      .then(() => {
        selectedChoice === 'height'
          ? updatedHeight(heightList[tempHeight])
          : null;
        selectedChoice === 'weight'
          ? updatedWeight(weightList[tempWeight])
          : null;
        this.setState({
          selectedHeight: selectedHeightCondition,
          selectedWeight: selectedWeightCondition,
          height: stateHeightCondition,
          weight: stateWeightCondition,
          bmi: CalculateBmi(heightCondition, weightCondition),
          userBmi: CalculateBmi(heightCondition, weightCondition),
        });
      })
      .then(
        updatedBmi(
          CalculateBmi(
            selectedChoice === 'height' ? heightList[tempHeight] : uHeight,
            selectedChoice === 'weight' ? weightList[tempWeight] : uWeight,
          ),
        ),
      )
      .catch(err => {
        console.log('Network Error', err);
      });
    Toast.show({
      text: 'Data Updated',
      duration: 2000,
      type: 'default',
    });
    this.toggleChangeDataModal(selectedChoice);
  };

  leaderBoardData = () => {
    const {uName, updatedLeaderBoardData} = this.props;
    fetch(`${BASE_URL}/api/zul/getLeaderBoard`, {
      method: 'POST',
      headers,
      body: JSON.stringify({userName: uName}),
    })
      .then(response => response.json())
      .then(responseJson => {
        updatedLeaderBoardData(responseJson);
      })
      .catch(err => {
        console.log('Network Error', err);
      });
  };

  // userDataCollection = () => {
  //   const {
  //     uName, updatedHeight, updatedWeight, updatedGender, updatedBmi, updatedDob
  //   } = this.props;
  //   this.leaderBoardData();
  //   fetch(`${BASE_URL}/api/user/id`, {
  //     method: 'POST',
  //     headers,
  //     body: JSON.stringify({ name: uName })
  //   }).then(response => response.json())
  //     .then((responseJson) => {
  //       updatedHeight(responseJson.height);
  //       updatedWeight(responseJson.weight);
  //       updatedGender(responseJson.gender ? responseJson.gender : null);
  //       updatedBmi(CalculateBmi(responseJson.height, responseJson.weight));
  //       this.setState({
  //         height: responseJson.height,
  //         weight: responseJson.weight,
  //         bmi: CalculateBmi(responseJson.height, responseJson.weight),
  //         dob: responseJson.dob
  //       });
  //       updatedDob(responseJson.dob);
  //     }).catch((err) => { console.log('Network Error', err); });
  // }

  imageCondition = () => {
    const {fetchedUrl} = this.props;
    let source = {uri: ''};
    if (fetchedUrl !== null && fetchedUrl !== '') {
      source = {uri: fetchedUrl};
    } else {
      source = {
        uri:
          'https://res.cloudinary.com/pratian-technologies/image/upload/v1560505157/Zul-Profile-Image/imageedit_8_5096704736.png',
      };
    }
    return source;
  };

  mapInviteCode = () => {
    const {uName, updatedAssessmentsList} = this.props;
    const {inviteCode} = this.state;
    fetch(`${BASE_URL}/api/mapInviteCodeToUserFromSettings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userName: uName,
        inviteCode: inviteCode.trim(),
      }),
    })
      .then(response => response.json(), this.setState({inviteCode: ''}))
      .then(responseJson => {
        if (responseJson.error) {
          this.setState({spinner2: false});
          // this.dailogVisible();
          Toast.show({
            text: responseJson.error,
            duration: 2000,
            type: 'default',
          });
        } else {
          this.setState({spinner2: false});
          // this.dailogVisible();
          Toast.show({
            text: 'Invite Code Added..',
            duration: 2000,
            type: 'default',
          });
          updateAssessments(uName, updatedAssessmentsList);
        }
      })
      .catch(err => {
        console.log('Network Error', err);
      });
  };

  dailogVisible = () => {
    this.setState(prevState => ({isDialogVisible: !prevState.isDialogVisible}));
  };

  async onDOBPress() {
    const {udobDate} = this.state;
    const {uDob} = this.props;
    let dobDate = udobDate;
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.setState({showSCLAlert: true});
      } else {
        if (uDob && uDob !== '') {
          dobDate = new Date(uDob);
        }

        if (!dobDate || dobDate === null) {
          dobDate = new Date(moment().year() - 12, 0, 0);
          this.setState({udobDate: dobDate});
        }
        // To open the dialog
        // this.refs.dobDailog.open({
        this.dobDialog.open({
          mode: 'spinner',
          date: dobDate,
          maxDate: new Date(moment().year() - 12, 0, 0, 0), // To restirct future date,
          minDate: new Date(moment().year() - 99, 0, 0, 0), // To restrict past date to 100 year
        });
      }
    });
  }

  onDOBDatePicked = async date => {
    const {uName, updatedDob} = this.props;
    await this.setState({
      dob: moment(date),
      dobDate: date,
      dobText: moment(date).format('MM-DD-YYYY'),
    });
    await updatedDob(date);
    await fetch(`${BASE_URL}/api/user/updateUserDob`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        dob: moment(date).format('MM-DD-YYYY'),
      }),
    })
      .then(response => {
        response.json();
      })
      .then(
        await this.setState({
          dobDate: date,
          dobText: moment(date).format('MM-DD-YYYY'),
        }),
      )
      .catch(err => {
        console.log('Network Error', err);
      });
    Toast.show({
      text: 'Data Updated',
      duration: 2000,
      type: 'default',
    });
  };

  onPickerSelect(index, selectedChoice) {
    if (selectedChoice === 'height') {
      this.setState({tempHeight: index});
    } else {
      this.setState({tempWeight: index});
    }
  }

  onSelect = (index, value) => {
    this.setState({
      gender: value,
      genderIndex: index,
    });
  };

  toggleModal = () => {
    //net
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.setState({showSCLAlert: true});
      } else {
        this.setState(prevState => ({
          modalVisible: !prevState.modalVisible,
          genderIndex: prevState.genderIndex,
        }));
      }
    });
  };

  toggleChangeDataModal = (selectedChoice, reverse = null) => () => {
    const {uHeight, uWeight} = this.props;
    const {selectedWeight, selectedHeight} = this.state;
    this.setState({tempHeight: selectedHeight, tempWeight: selectedWeight});
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.setState({showSCLAlert: true});
      } else {
        if (selectedChoice === 'height') {
          this.setState(prevState => ({
            changeDataHeight: !prevState.changeDataHeight,
          }));
        } else {
          this.setState(prevState => ({
            changeDataWeight: !prevState.changeDataWeight,
          }));
        }
        setTimeout(() => {
          if (reverse) {
            this.setPrevData(selectedChoice);
          }
        }, 100);
      }
    });
  };

  setPrevData = selectedChoice => {
    const {selectedHeight, selectedWeight} = this.state;
    if (selectedChoice === 'height') {
      this.setState({tempHeight: selectedHeight});
    } else {
      this.setState({tempWeight: selectedWeight});
    }
  };

  submit = () => {
    const {inviteCode} = this.state;
    this.setState({spinner2: true});
    if (inviteCode.trim() === '') {
      Toast.show({
        text: 'Please enter a valid invite code..',
        duration: 2000,
        type: 'default',
      });
    } else {
      this.dailogVisible();
      this.mapInviteCode();
    }
  };

  update = imageDetails => {
    const {
      updatedUserSocialImage,
      uName,
      updatedFetchedUrl,
      updatedUserImageDetails,
    } = this.props;
    const {count} = this.state;
    updatedUserSocialImage('');
    fetch(`${BASE_URL}/api/user/updateUserImageDetails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        userImageURL: imageDetails.secure_url,
        imageID: imageDetails.public_id,
        uploadDate: imageDetails.created_at,
      }),
    })
      .then(response => response.json())
      .then(() => {
        updatedFetchedUrl(imageDetails.secure_url);
        updatedUserImageDetails(imageDetails);
      })
      .catch(err => {
        console.log('Network Error', err);
      });
    if (count > 0) {
      this.setState({spinner: false, count: 0}, () =>
        Toast.show({
          text: 'Profile Picture Updated Successfully....',
          duration: 2000,
          type: 'default',
        }),
      );
    }
  };

  cameraModel(arg) {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.setState({showSCLAlert: true});
      } else {
        arg === 'Cancel'
          ? this.setState({cameraModel: false}, () =>
              Toast.show({
                text: 'Cancel By User',
                duration: 2000,
                type: 'default',
              }),
            )
          : this.setState({cameraModel: true});
      }
    });
  }

  pickImageHandler = mode => {
    const {uName} = this.props;
    if (mode === 'Camera') {
      ImagePickerCrop.openCamera({
        cropping: true,
        width: 500,
        height: 500,
        useFrontCamera: true,
        cropperCircleOverlay: true,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        includeExif: true,
        avoidEmptySpaceAroundImage: true,
      })
        .then(image => {
          console.log(image);
          this.setState({
            count: 1,
            spinner: true,
            cameraModel: false,
          });
          uploadImageHandler(image.path, this.update, uName);
        })
        .catch(e => {
          console.log(e);
          this.setState({cameraModel: false}, () =>
            Toast.show({
              text: e.message,
              duration: 2000,
              type: 'default',
            }),
          );
        });
    }
    if (mode === 'Gallary') {
      ImagePickerCrop.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        compressImageQuality: 1,
        includeExif: true,
        avoidEmptySpaceAroundImage: true,
      })
        .then(image => {
          console.log(image);
          this.setState({
            count: 1,
            spinner: true,
            cameraModel: false,
          });
          uploadImageHandler(image.path, this.update, uName);
        })
        .catch(e => {
          console.log(e);
          this.setState(
            {cameraModel: false},
            Toast.show({
              text: e.message,
              duration: 2000,
              type: 'default',
            }),
          );
        });
    }
  };

  getWellnessAssessment = data => {
    const {
      getAllQuestion,
      getCurrentQuestion,
      navigation,
      updatedCurrentAnswerId,
      SetAssessmentType,
    } = this.props;
    updatedCurrentAnswerId(null);
    SetAssessmentType(data);
    const requestUrl = `${BASE_URL}/api/theme/question?themeCode=${themeCode(
      data,
    )}`;
    let questions = [];
    let question = {};
    fetch(requestUrl, {
      method: 'GET',
      headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        questions = responseJson;
        question = responseJson[0];
        for (let i = 0; i < questions.length; i += 1) {
          questions[i].selectedIndex = null;
          for (let j = 0; j < questions[i].options.length; j += 1) {
            questions[i].options[j].checked = false;
          }
        }
        getAllQuestion(questions);
        getCurrentQuestion(question);
        updatedCurrentAnswerId(null);
        navigation.navigate('UserWellnessAssessmentRouteAssessmentInfo', {
          title: data,
        });
      })
      .catch(err => {
        console.log('Network Error', err);
      });
  };

  getWellnesDraftedAssessment = (data, id, state = null) => {
    const {
      getAllQuestion,
      getCurrentQuestion,
      navigation,
      SetAssessmentType,
      updatedCurrentAnswerId,
    } = this.props;
    updatedCurrentAnswerId(null);
    const reqObject = {id};
    fetch(`${BASE_URL}/api/getWellnessAnswer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reqObject),
    })
      .then(responseOption => responseOption.json())
      .then(responseJsonOption => {
        const optionAray = responseJsonOption[0];
        SetAssessmentType(data);
        const requestUrl = `${BASE_URL}/api/theme/question?themeCode=${themeCode(
          data,
        )}`;
        let questions = [];
        let question = {};
        fetch(requestUrl, {
          method: 'GET',
          headers,
        })
          .then(response => response.json())
          .then(responseJson => {
            questions = responseJson;
            question = responseJson[0];
            for (let i = 0; i < questions.length; i += 1) {
              questions[i].selectedIndex = null;
              for (let j = 0; j < questions[i].options.length; j += 1) {
                questions[i].options[j].checked = false;
              }
            }

            for (let i = 0; i < optionAray.options.length; i += 1) {
              // selected questions
              question = questions[i];
              if (!optionAray.options[i].answers.length) {
                break;
              }
              // Mapping old questions
              for (
                let j = 0;
                j < optionAray.options[i].answers.length;
                j += 1
              ) {
                questions[i].selectedIndex =
                  optionAray.options[i].answers[j].answerIndex - 1;
                if (optionAray.options[i].answers[j].ansType === 'single') {
                  continue;
                }
                for (let k = 0; k < questions[i].options.length; k += 1) {
                  if (questions[i].options[k].checked) {
                    continue;
                  }
                  questions[i].options[k].checked =
                    questions[i].options[k].label ===
                    optionAray.options[i].answers[j].answerDescription;
                }
              }
            }
            getAllQuestion(questions);
            if (state === 'completed' || questions[12].selectedIndex) {
              Toast.show({
                text: 'Your response has already been recorded.',
                duration: 3000,
                type: 'default',
              });
              getCurrentQuestion(questions[0]);
            } else {
              getCurrentQuestion(question);
            }
            updatedCurrentAnswerId(id);
            // navigation.navigate('UserWellnessAssessmentRoute');
            navigation.navigate('UserWellnessAssessmentRouteAssessment', {
              title: data,
            });
          })
          .catch(err => {
            console.log('Network Error', err);
          });
      });
  };

  updateWellnessAssessment = () => {
    const {uName, uWeight, uHeight} = this.props;
    this.setState({selectedHeight: uHeight, selectedWeight: uWeight});

    const reqData = {userName: uName};
    /* FETCH CALL TO GET ALL THE ASSESSMENTS */
    GetAssessmentListService.fetchWellnessAssessment(reqData)
      .then(responseJson => {
        this.setState({wellnessAssessment: responseJson});
        setTimeout(() => {
          this.wellnessAssessment();
        }, 100);
      })
      .catch(err => {
        console.log('Network Error', err);
      });
  };

  wellnessAssessment() {
    // this.updateWellnessAssessment();
    const {wellnessAssessment} = this.state;
    const {wellAssessment} = this.props;
    if (wellAssessment.drafted === 'completed') {
      // Toast.show({
      //   text: 'Your response has already been recorded.',
      //   duration: 2000,
      //   type: 'default'
      // });
      this.getWellnesDraftedAssessment(
        'Wellness',
        wellAssessment.id,
        'completed',
      );
    } else if (wellAssessment.drafted === 'drafted') {
      this.getWellnesDraftedAssessment('Wellness', wellAssessment.id);
    } else {
      this.getWellnessAssessment('Wellness');
    }
  }

  genderIcon = gender => {
    let genderIcon = null;
    if (gender === 'Male') {
      genderIcon = <Icon name="gender-male" size={18} color="#144e76" />;
    } else if (gender === 'Female') {
      genderIcon = <Icon name="gender-female" size={20} color="#144e76" />;
    } else if (gender === 'Others') {
      genderIcon = <Icon name="gender-male-female" size={18} color="#144e76" />;
    }
    return genderIcon;
  };

  submitGender = async () => {
    const {gender} = this.state;
    const {uName, updatedGender} = this.props;
    this.toggleModal();
    updatedGender(gender);
    await fetch(`${BASE_URL}/api/user/updateUserGender`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        gender,
      }),
    })
      .then(response => {
        response.json();
      })
      .catch(err => {
        console.log('Network Error', err);
      });
    Toast.show({
      text: 'Data Updated',
      duration: 2000,
      type: 'default',
    });
  };

  calculateAge = dob => {
    // if (dob) {
    const date = new Date(dob);
    const currDate = new Date();
    // console.log('Dob>>', date.getFullYear(), currDate.getFullYear(), currDate.getFullYear() - date.getFullYear());
    return currDate.getFullYear() - date.getFullYear();
    // }
    // return null;
  };

  handleClose = () => {
    this.setState({showSCLAlert: false});
  };

  shouldComponentUpdate(nextProps, nextState) {
    //console.log(this.props,nextProps, nextState);
    return !(
      this.props.uBmi === nextProps.uBmi &&
      this.props.uDob === nextProps.uDob &&
      this.props.uGender === nextProps.uGender &&
      this.props.uHeight === nextProps.uHeight &&
      this.props.uName === nextProps.uName &&
      this.props.uSocialImage === nextProps.uSocialImage &&
      this.props.uWeight === nextProps.uWeight &&
      this.props.fetchedUrl === nextProps.fetchedUrl &&
      this.props.currentAssessment === nextProps.currentAssessment &&
      this.state.changeDataWeight === nextState.changeDataWeight &&
      this.state.isDialogVisible === nextState.isDialogVisible &&
      this.state.modalVisible === nextState.modalVisible &&
      this.state.spinner === nextState.spinner &&
      this.state.changeDataHeight === nextState.changeDataHeight &&
      this.state.selectedHeight === nextState.selectedHeight &&
      this.state.selectedWeight === nextState.selectedWeight &&
      this.state.tempHeight === nextState.tempHeight &&
      this.state.tempWeight === nextState.tempWeight &&
      this.state.genderIndex === nextState.genderIndex &&
      this.state.showSCLAlert === nextState.showSCLAlert &&
      this.state.cameraModel === nextState.cameraModel
    );
  }

  render() {
    //alert("count"+count++);
    const {
      isDialogVisible,
      height,
      weight,
      bmi,
      dob,
      spinner,
      modalVisible,
      genderIndex,
      changeDataHeight,
      changeDataWeight,
      weightList,
      heightList,
      tempHeight,
      tempWeight,
      selectedHeight,
      selectedWeight,
    } = this.state;

    const {
      navigation,
      uName,
      uGender,
      uHeight,
      uWeight,
      uDob,
      uBmi,
    } = this.props;
    const genderDisplay = uGender ? uGender.substring(0, 1) : null;
    return (
      <View style={styles.container}>
        <SCLAlert
          theme="danger"
          show={this.state.showSCLAlert}
          title="Network Error"
          subtitle="Please check your network"
          onRequestClose={this.handleClose}
          titleStyle={{...defaultModalFont}}
          subtitleStyreact-native-scl-alertle={{...defaultModalFont}}>
          <SCLAlertButton
            theme="danger"
            onPress={this.handleClose}
            textStyle={{...regularButtonFont}}>
            CLOSE
          </SCLAlertButton>
        </SCLAlert>
        <Dialog.Container visible={modalVisible}>
          <Dialog.Title style={styles.dialogTitle}>
            {'Select Gender'}
          </Dialog.Title>
          <RadioGroup
            selectedIndex={genderIndex}
            style={styles.radio}
            color="black"
            onSelect={(index1, value) => this.onSelect(index1, value)}>
            <RadioButton value="Male" color="black">
              <Text style={styles.radioButton}>Male</Text>
            </RadioButton>

            <RadioButton value="Female" color="black">
              <Text style={styles.radioButton}>Female</Text>
            </RadioButton>

            <RadioButton value="Others" color="black">
              <Text style={styles.radioButton}>Others</Text>
            </RadioButton>
          </RadioGroup>

          <Dialog.Button
            style={styles.dialogButton}
            label="Cancel"
            onPress={this.toggleModal}
          />
          <Dialog.Button
            style={styles.dialogButton}
            label="Submit"
            onPress={this.submitGender}
          />
        </Dialog.Container>

        <Dialog.Container
          visible={changeDataHeight}
          style={styles.dialogContainer}>
          <Dialog.Title style={styles.dia}>
            <Text style={styles.height}>
              {`Selected Height: ${tempHeight + 1}`}
            </Text>
            <Text style={styles.heightcm}>{' cm'}</Text>
          </Dialog.Title>
          <View style={styles.dailogPickerStyle}>
            {Platform.OS === 'ios' ? (
              <PickerIOS
                style={styles.pickerIos}
                selectedValue={tempHeight}
                itemStyle={styles.pickerIosHeight}
                onValueChange={height => this.onPickerSelect(height, 'height')}>
                {heightList.map((height, i) => (
                  <PickerItemIOS
                    label={height.toString()}
                    value={i}
                    key={`number${height.toString()}`}
                  />
                ))}
              </PickerIOS>
            ) : // <Picker
            //   style={styles.pickerAnd}
            //   selectedValue={tempHeight}
            //   itemStyle={styles.pickerIosHeight}
            //   onValueChange={height => this.onPickerSelect(height, 'height')}
            // >
            //   {heightList.map((height, i) => (
            //     <PickerItem label={height.toString()} value={i} key={`number${height.toString()}`} />
            //   ))}
            // </Picker>
            null}
          </View>
          <Dialog.Button
            label="Cancel"
            style={styles.dialogButtonWeight}
            onPress={this.toggleChangeDataModal('height', true)}
          />
          <Dialog.Button
            label="OK"
            style={styles.dialogButtonWeight}
            onPress={() => {
              tempHeight !== selectedHeight
                ? this.onAddItem('height')
                : Toast.show({
                    text: 'Select Height',
                    duration: 2000,
                    type: 'default',
                  });
            }}
          />
        </Dialog.Container>

        <Dialog.Container
          visible={changeDataWeight}
          style={styles.dialogContainer1}>
          <Dialog.Title style={styles.dialogTitleWeight}>
            <Text style={styles.dialogTitleWeightStyle}>
              {`Selected Weight: ${tempWeight + 1}`}
            </Text>
            <Text style={styles.dialogKg}>{' kg'}</Text>
          </Dialog.Title>
          <View style={styles.dailogPickerStyle}>
            {Platform.OS === 'ios' ? (
              <PickerIOS
                style={styles.pickerIos}
                selectedValue={tempWeight}
                itemStyle={styles.pickerIosHeight}
                onValueChange={weight => this.onPickerSelect(weight, 'weight')}>
                {weightList.map((weight, i) => (
                  <PickerItemIOS
                    label={weight.toString()}
                    value={i}
                    key={`number${weight.toString()}`}
                  />
                ))}
              </PickerIOS>
            ) : // <Picker
            //   style={styles.pickerAnd}
            //   selectedValue={tempWeight}
            //   itemStyle={styles.pickerIosHeight}
            //   onValueChange={weight => this.onPickerSelect(weight, 'weight')}
            // >
            //   {weightList.map((weight, i) => (
            //     <PickerItem label={weight.toString()} value={i} key={`number${weight.toString()}`} />
            //   ))}
            // </Picker>
            null}
          </View>
          <Dialog.Button
            style={styles.dialogButtonWeight}
            label="Cancel"
            onPress={this.toggleChangeDataModal('weight', true)}
          />
          <Dialog.Button
            label="OK"
            style={styles.dialogButtonWeight}
            onPress={() => {
              tempWeight !== selectedWeight
                ? this.onAddItem('weight')
                : Toast.show({
                    text: 'Select Weight',
                    duration: 2000,
                    type: 'default',
                  });
            }}
          />
        </Dialog.Container>

        <Dialog.Container visible={isDialogVisible} style={styles.dialogCon}>
          <Dialog.Title style={styles.titleStyle}>
            {'Add Invite Code'}
          </Dialog.Title>
          <Dialog.Description style={styles.descStyle}>
            {'Enter invite code provided by Organisation'}
          </Dialog.Description>
          <Dialog.Input
            style={styles.dialogInput}
            maxLength={6}
            wrapperStyle={{
              backgroundColor: 'white',
              borderBottomWidth: 1,
              borderRadius: 6,
              borderColor: '#757575',
              marginBottom: 20,
              paddingHorizontal: 8,
            }}
            placeholder="e.g. a5b3c8"
            onChangeText={inputText =>
              this.setState({inviteCode: inputText})
            }></Dialog.Input>
          <Dialog.Button
            style={styles.dialogButton}
            label="Cancel"
            onPress={this.dailogVisible}
          />
          <Dialog.Button
            style={styles.dialogButton}
            label="Submit"
            onPress={this.submit}
          />
        </Dialog.Container>

        {/* camera dialog */}
        <Dialog.Container
          visible={this.state.cameraModel}
          onBackdropPress={() => this.cameraModel('Cancel')}
          style={{borderRadius: 30}}>
          <Dialog.Title style={styles.profileTitle}>
            Choose Profile Picture
          </Dialog.Title>
          <TouchableOpacity
            style={styles.cameraText}
            onPress={() => this.pickImageHandler('Camera')}>
            <Text style={styles.cameraTextStyle}>Take Photo...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraText}
            onPress={() => this.pickImageHandler('Gallary')}>
            <Text style={styles.cameraTextStyle}>Choose from Library...</Text>
          </TouchableOpacity>
          <Dialog.Button
            style={{fontFamily: 'System'}}
            label="Cancel"
            onPress={() => this.cameraModel('Cancel')}
          />
        </Dialog.Container>

        <View style={{flex: 1, flexDirection: 'column'}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            key="top"
            style={styles.linearGradient1}
            colors={['#fff', '#fff']}>
            <View style={styles.linearGradient2}>
              <TouchableOpacity
                onPress={() => navigation.navigate('OverviewRoute')}
                style={styles.linearGradient6}>
                <Icon
                  style={styles.linearGradient3}
                  name="arrow-left"
                  size={25}
                  color="#144e76"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linearGradient8}
                onPress={() =>
                  navigation.navigate('UserWellnessAssessmentRouteReportIssue')
                }>
                <Icon1
                  style={styles.linearGradient4}
                  name="support"
                  size={20}
                  color="#144e76"
                />
                <Text style={styles.linearGradient5}>Support</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.linearGradient7}>
              <View style={styles.linearGradient9}>
                {genderDisplay ? (
                  <Text style={styles.linearGradient10}>
                    {'Gender \n  '}
                    {this.genderIcon(uGender)} {genderDisplay}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={this.toggleModal.bind(this)}>
                    <Text style={styles.linearGradient10}>
                      {'   Set\nGender'}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* </View> */}
              </View>
              <View style={styles.spinner}>
                {spinner ? (
                  <ActivityIndicator
                    animating={spinner}
                    style={styles.spinner0}
                    color="rgb(66, 159, 247)"
                    size="large"
                  />
                ) : (
                  <Avatar
                    size={width * 0.33}
                    showEditButton
                    activeOpacity={0.7}
                    source={this.imageCondition()}
                    onEditPress={() => this.cameraModel()}
                    onPress={() => this.cameraModel()}
                  />
                )}
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                {/* <View style={{ flex: 1, alignItems: 'center' }}>
                  <Icon1 name="calendar" size={20} color="grey" />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}> */}
                {uDob ? (
                  <Text
                    style={{
                      fontFamily: 'System',
                      fontSize: 20,
                      color: '#144e76',
                      paddingHorizontal: 5,
                      //                 elevation: 5,
                      // shadowOffset: { width: 4, height: 4 },
                      // shadowColor: '#90a4ae',
                      // borderWidth: 0.15,
                      // shadowOpacity: 5.0,
                    }}>
                    {'Age \n '}
                    {this.calculateAge(uDob)}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                    <Text style={styles.linearGradient10}>
                      {'  Set\nD.O.B'}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* </View> */}
              </View>
            </View>
            <View style={styles.spinner1}>
              <Text style={styles.spinner2}>{uName}</Text>
            </View>
            <View style={styles.spinner3}>
              <View style={styles.spinner4}>
                {uHeight ? (
                  <View style={styles.smallCards}>
                    <View style={styles.spinnerHeight}>
                      <Icon1 name="arrows-v" size={20} color="grey" />
                    </View>
                    <View style={styles.spinnerHeight1}>
                      <Text style={styles.spinnerHeight2}>
                        {`${uHeight} cm`}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.smallCards}
                    onPress={this.toggleChangeDataModal('height')}>
                    <View style={styles.spinnerHeight}>
                      <Icon1 name="arrows-v" size={20} color="#144e76" />
                    </View>
                    <View style={styles.spinnerHeight3}>
                      <Text style={styles.spinnerHeight4}>Set Height</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.spinner4}>
                {uWeight ? (
                  <View style={styles.smallCards}>
                    <View style={styles.spinnerHeight}>
                      <Icon name="weight-kilogram" size={20} color="grey" />
                    </View>
                    <View style={styles.spinnerHeight5}>
                      <Text style={styles.spinnerHeight2}>
                        {`${uWeight} kg`}
                      </Text>
                    </View>
                  </View>
                ) : (
                  // navigation.navigate('UserAccountControls')
                  <TouchableOpacity
                    style={styles.smallCards}
                    onPress={this.toggleChangeDataModal('weight')}>
                    <View style={styles.smallCards2}>
                      <Icon name="weight-kilogram" size={20} color="#144e76" />
                    </View>
                    <View style={styles.spinnerHeight1}>
                      <Text style={styles.spinnerHeight4}>Set Weight</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.spinner4}>
                <View style={styles.smallCards}>
                  {uBmi === '' ? (
                    <Text style={styles.smallCards1}>BMI: 0.00</Text>
                  ) : (
                    <Text style={styles.spinnerHeight2}>{`BMI: ${uBmi}`}</Text>
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>
          <View key="Bottom" style={styles.keyButton}>
            <View style={styles.keyButton1}>
              <TouchableOpacity
                style={styles.keyButton2}
                onPress={this.dailogVisible}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#41D387', '#12BCEB']}
                  style={[styles.card]}>
                  <Icon1 name="envelope-open" size={35} color="#fff" />
                  <Text style={styles.inviteCode}>Invite Code</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.spinner4}
                onPress={() =>
                  navigation.navigate('UserWellnessAssessmentRouteLeaderBoard')
                }>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#6FD3EE', '#A969EE']}
                  style={[styles.card]}>
                  <Icon1 name="bar-chart-o" size={35} color="#fff" />
                  <Text style={styles.inviteCode}>Leader board</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.keyButton3}>
              <TouchableOpacity
                style={styles.keyButton2}
                onPress={() =>
                  navigation.navigate(
                    'UserWellnessAssessmentRouteUserAccountControls',
                  )
                }>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#E9214C', '#D78CE7']}
                  style={[styles.card]}>
                  <Icon name="account-settings" size={40} color="#fff" />
                  <Text style={styles.inviteCode}>Account Control</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.spinner4}
                onPress={this.wellnessAssessment.bind(this)}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#F29B3C', '#F66FD8']}
                  style={[styles.card]}>
                  <Icon1 name="user-md" size={40} color="#fff" />
                  <Text style={styles.inviteCode}>User Wellness</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <DatePickerDialog
          ref={foc => {
            this.dobDialog = foc;
          }}
          onDatePicked={this.onDOBDatePicked}
        />
        <BottomZulTabs navigator={navigation} activeTab="settings" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dialogTitle: {
    color: 'black',
    alignSelf: 'center',
  },
  radio: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  radioButton: {
    fontFamily: 'System',
    color: 'black',
    fontSize: 16,
  },
  height: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#000',
  },
  heightcm: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000',
  },
  dialogButton: {fontFamily: 'System'},
  dialogContainer: {borderRadius: 50, flex: 1},
  dialogContainer1: {borderRadius: 50},
  pickerIos: {width: 100, height: 40},
  pickerAnd: {width: 100, height: 120},
  dialogTitleWeight: {alignSelf: 'center'},
  dialogTitleWeightStyle: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#000',
  },
  pickerIosHeight: {fontFamily: 'System', color: 'black', fontSize: 26},
  dialogButtonWeight: {fontFamily: 'System', fontSize: 16},
  dialogKg: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'normal',
    alignItems: 'flex-end',
    color: '#000',
  },
  dialogCon: {borderRadius: 8},
  linearGradient: {flex: 1, flexDirection: 'column'},
  linearGradient1: {flex: 4.5, flexDirection: 'column'},
  linearGradient2: {flex: 0.5, flexDirection: 'row', paddingTop: 15},
  linearGradient3: {paddingLeft: 5},
  linearGradient4: {paddingLeft: 19},
  linearGradient5: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#144e76',
    paddingHorizontal: 5,
  },
  linearGradient6: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  linearGradient7: {flex: 3, flexDirection: 'row', alignItems: 'center'},
  linearGradient8: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  linearGradient9: {flex: 1, alignItems: 'center'},
  linearGradient10: {
    fontFamily: 'System',
    fontSize: 20,
    color: '#144e76',
    paddingHorizontal: 5,
  },
  spinner0: {paddingVertical: 35},
  spinner: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 100,
  },
  spinner1: {flex: 0.8, justifyContent: 'center', alignItems: 'center'},
  spinner2: {fontFamily: 'System', fontSize: 25, color: '#144e76'},
  spinner3: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#f2f2f2',
  },
  spinner4: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  spinnerHeight: {flex: 1, alignItems: 'flex-end'},
  spinnerHeight1: {flex: 3, alignItems: 'flex-start', paddingLeft: 5},
  smallCards1: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#144e76',
    paddingLeft: 5,
  },
  spinnerHeight2: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#000',
    paddingLeft: 5,
  },
  spinnerHeight3: {flex: 3, alignItems: 'flex-start', paddingLeft: 10},
  spinnerHeight4: {fontFamily: 'System', fontSize: 12, color: '#144e76'},
  spinnerHeight5: {flex: 2, alignItems: 'flex-start', paddingLeft: 5},
  keyButton: {
    flex: 6,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff',
  },
  keyButton1: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#D3D3D3',
  },
  keyButton2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#D3D3D3',
  },
  keyButton3: {flex: 1, flexDirection: 'row'},
  inviteCode: {fontFamily: 'System', fontSize: 18, color: '#fff'},
  smallCards2: {flex: 1, alignItems: 'flex-end', paddingLeft: 5},
  titleStyle: {
    fontFamily: 'System',
    color: 'black',
    alignSelf: 'center',
  },
  cameraTextStyle: {
    fontFamily: 'System',
    fontSize: 18,
  },
  cameraText: {
    marginLeft: 15,
    height: 40,
    width: '100%',
    fontSize: 18,
  },
  profileTitle: {
    fontFamily: 'System',
    color: 'black',
    fontSize: 22,
  },
  descStyle: {color: 'black', fontFamily: 'System'},
  dialogInput: {
    ...Platform.select({ios: {padding: 10}}),
    paddingHorizontal: 10,
    borderBottomColor: '#000',
  },
  smallCards: {
    height: '80%',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#144e76',
    borderWidth: 1,
    // elevation: 5,
    // shadowOffset: { width: 4, height: 4 },
    // shadowColor: '#90a4ae',
    // borderWidth: 0.15,

    // shadowOpacity: 5.0,
    flexDirection: 'row',
  },
  dailogPickerStyle: {
    ...Platform.select({
      ios: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      android: {
        // backgroundColor: '#757575',
        height: 130,
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
    }),
  },
  card: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    flexDirection: 'column',
    elevation: 5,
    borderColor: 'transparent',
    borderWidth: 0.15,
    backgroundColor: 'white',
    shadowOffset: {width: 4, height: 4},
    shadowColor: '#90a4ae',
    shadowOpacity: 5.0,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
