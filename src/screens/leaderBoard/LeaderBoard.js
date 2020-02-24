import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Image,
  ScrollView,
} from 'react-native';
import {List, ListItem, Container} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ReportLoading from '../assessmentReport/ReportLoading';
import {BASE_URL, headers} from '../../api/config/Config';
import {fontMaker} from '../../components/utility/fonts/FontMaker';

const width = Dimensions.get('window').width;

const mapStateToProps = state => ({
  uName: state.User.name,
  uSocialImage: state.User.socialImage,
  fetchedUrl: state.User.fetchedURL,
  imageDetails: {
    secure_url: state.User.imageDetails.secure_url,
    public_id: state.User.imageDetails.public_id,
    created_at: state.User.imageDetails.created_at,
  },
  leaderBoardData: state.User.leaderBoard,
});
class LeaderBoard extends PureComponent {
  state = {
    score: '',
    rank: '',
    scoreBoardArray: [],
    spinner: true,
  };

  componentWillMount() {
    this.fetchLeaderBoardData();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.backHandle = this.backHandle.bind(this);
    this.didFocusSubscription = navigation.addListener('didFocus', () =>
      BackHandler.addEventListener('hardwareBackPress', this.backHandle),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  backHandle = () => {
    const {navigation} = this.props;
    navigation.pop(1);
    return true;
  };

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

  fetchLeaderBoardData = () => {
    this.setState({
      spinner: false,
    });
  };

  cropName = userName => {
    const {uName} = this.props;
    let changedName;
    if (userName.length > 2) {
      const substring = userName.substr(0, 2);
      const str1 = '***';
      changedName = substring.concat(str1);
    } else {
      changedName = userName;
    }
    return changedName;
  };

  render() {
    const {uName, navigation} = this.props;
    const {spinner} = this.state;
    const {leaderBoardData} = this.props;

    const score = leaderBoardData.overAllLeaderBoard.overAllScore;
    const rank = leaderBoardData.overAllLeaderBoard.overAllRank;
    const scoreBoardArray = leaderBoardData.user;
    if (!leaderBoardData) {
      return (
        <Container>
          <ReportLoading />
        </Container>
      );
    }
    if (scoreBoardArray.length > 0 && !spinner) {
      return (
        <View style={styles.leaderBoardView}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            key="top"
            style={styles.gradientStyle}
            colors={['#fff', '#fff']}>
            <View style={styles.contentStyle}></View>
            <View style={styles.scoreViewContainer}>
              <View style={styles.scoreViewStyles}>
                <Text style={styles.scoreTextLabelStyle}>Score</Text>
                <Text style={styles.scoreTextDataStyle}>
                  {Math.round(score)}
                </Text>
              </View>
              <View style={styles.leaderboardImageContainer}>
                <View style={styles.image}>
                  <Image
                    style={styles.imagesrc}
                    source={this.imageCondition()}
                    accessible
                    accessibilityLabel="Profile Picture"
                    accessibilityHint="User Profile Picture"
                  />
                </View>
              </View>
              <View style={styles.leaderboardImageContainer}>
                <Text style={styles.scoreTextLabelStyle}>Rank</Text>
                <Text style={styles.scoreTextDataStyle}>{rank}</Text>
              </View>
            </View>
            <View style={styles.leaderboardUserContainer}>
              <Text style={styles.usernameTextStyle}>{uName}</Text>
            </View>
          </LinearGradient>

          <View key="Bottom" style={styles.bottomViewStyle}>
            <View>
              <View style={styles.bottomDataView}>
                <List>
                  <ListItem key="Data" style={{}}>
                    <View style={styles.flexRow}>
                      <View style={styles.leaderboardUserData}>
                        <Text style={styles.labelStyle}>Name</Text>
                      </View>
                      <View style={styles.dataViewStyle}>
                        <Text style={styles.labelStyle}>Score</Text>
                      </View>
                      <View style={styles.flexAlignCenter}>
                        <Text style={styles.rankStyle}>Rank</Text>
                      </View>
                    </View>
                  </ListItem>
                </List>
              </View>
              <ScrollView style={styles.marginBottom10}>
                <View style={styles.marginBottom10White}>
                  <List>
                    {scoreBoardArray.map((scoreBoard, index) => (
                      <ListItem key="Data">
                        <View style={styles.flexRow}>
                          {scoreBoard.userName === uName ? (
                            <View style={styles.leaderboardUserData}>
                              <Text style={styles.usernameStyle}>
                                {this.cropName(scoreBoard.userName)}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.leaderboardUserData}>
                              <Text style={styles.usernameTexyStyle}>
                                {this.cropName(scoreBoard.userName)}
                              </Text>
                            </View>
                          )}
                          {scoreBoard.userName === uName ? (
                            <View style={styles.dataViewStyle}>
                              <Text style={styles.usernameStyle}>
                                {Math.round(scoreBoard.dailyOverAllScore)}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.dataViewStyle}>
                              <Text style={styles.usernameTexyStyle}>
                                {Math.round(scoreBoard.dailyOverAllScore)}
                              </Text>
                            </View>
                          )}
                          {scoreBoard.userName === uName ? (
                            <View style={styles.flexAlignCenter}>
                              {index === 0 ? (
                                <Image
                                  style={styles.smallImageSrc}
                                  source={require('./LeaderBoardImage/LeaderBoard.png')}
                                  accessible
                                  accessibilityLabel="Profile Picture"
                                  accessibilityHint="User Profile Picture"
                                />
                              ) : (
                                <Text style={styles.countStyle}>
                                  {index + 1}
                                </Text>
                              )}
                            </View>
                          ) : (
                            <View style={styles.flexAlignCenter}>
                              {index === 0 ? (
                                <Image
                                  style={styles.smallImageSrc}
                                  source={require('./LeaderBoardImage/LeaderBoard.png')}
                                  accessible
                                  accessibilityLabel="Profile Picture"
                                  accessibilityHint="User Profile Picture"
                                />
                              ) : (
                                <Text style={styles.countStyle2}>
                                  {index + 1}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      </ListItem>
                    ))}
                  </List>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      );
    }
    return <View style={styles.viewStyle} />;
  }
}

const itemFontStyle = fontMaker({fontFamily: 'OpenSans', fontWeight:"400"});
const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
    borderColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.34,
    width: width * 0.34,
    borderRadius: 100,
  },
  imagesrc: {
    height: width * 0.34,
    width: width * 0.34,
    borderRadius: (width * 0.34) / 2,
  },
  smallImageSrc: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  listText: {
    fontSize: 16,
    color: 'black',
    ...itemFontStyle,
  },
  viewStyle: {
    fontFamily: 'OpenSans',
    fontWeight: "400",
  },
  leaderBoardView: {
    flex: 1,
    flexDirection: 'column',
  },
  gradientStyle: {
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  contentStyle: {
    flex: 0.5,
    alignItems: 'flex-start',
    paddingTop: 15,
    paddingLeft: 5,
  },
  scoreViewContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreViewStyles: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreTextLabelStyle: {
    fontFamily: 'System',
    fontSize: 25,
    color: '#144e76',
    fontWeight: 'normal',
  },
  scoreTextDataStyle: {
    fontFamily: 'System',
    fontSize: 22,
    color: '#000',
    fontWeight: 'normal',
  },
  leaderboardImageContainer: {
    flex: 1,
    paddingLeft: 15,
    alignItems: 'center',
    flexDirection: 'column',
  },
  leaderboardUserContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
  },
  usernameTextStyle: {
    fontFamily: 'System',
    fontSize: 25,
    color: '#144e76',
  },
  bottomViewStyle: {
    flex: 7,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  bottomDataView: {
    backgroundColor: '#fff',
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
  },
  flexRow: {flexDirection: 'row'},
  leaderboardUserData: {
    flex: 2,
    alignItems: 'flex-start',
  },
  labelStyle: {
    fontFamily: 'System',
    fontSize: 22,
    color: '#37474f',
  },
  dataViewStyle: {
    flex: 3,
    alignItems: 'center',
    paddingLeft: 10,
  },
  flexAlignCenter: {
    flex: 1,
    alignItems: 'center',
  },
  rankStyle: {
    fontFamily: 'System',
    fontSize: 22,
    color: '#37474f',
    alignItems: 'center',
  },
  marginBottom10: {marginBottom: '10%'},
  marginBottom10White: {
    backgroundColor: '#fff',
    marginBottom: '10%',
  },
  usernameStyle: {
    fontFamily: 'System',
    fontSize: 22,
    color: '#757575',
  },
  usernameTexyStyle: {
    fontFamily: 'System',
    fontSize: 18,
    color: '#37474f',
  },
  countStyle: {
    fontFamily: 'System',
    fontSize: 22,
    color: '#757575',
    alignItems: 'center',
  },
  countStyle2: {
    fontFamily: 'System',
    fontSize: 18,
    color: '#37474f',
    alignItems: 'center',
  },
});

export default connect(
  mapStateToProps,
  null,
)(LeaderBoard);
