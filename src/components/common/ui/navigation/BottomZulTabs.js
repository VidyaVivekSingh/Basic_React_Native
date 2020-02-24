import React, {Component} from 'react';
import {Icon, Toast} from 'native-base';
import {connect} from 'react-redux';
import {Platform, StyleSheet, Dimensions} from 'react-native';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';
import {fontMaker} from '../../utility/fonts/FontMaker';


const mapStateToProps = state => ({ goalsEssentials: state.Goals.essentials });
class BottomZulTabs extends Component {
  tabs = [
    {
      key: 'home',
      icon: 'md-home',
      label: 'Home',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: 'grey',
      screen: 'OverviewRouteOverview',
    },
    {
      key: 'checks',
      icon: 'md-list',
      label: 'Checks',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: 'grey',
      screen: 'ReportRouteAssessmentList',
    },
    {
      key: 'goals',
      icon: 'md-radio-button-on',
      label: 'Goals',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: 'grey',
      screen: 'GoalsRouteGoals',
    },
    {
      key: 'vitals',
      icon: 'md-pulse',
      label: 'Vitals',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: 'grey',
      screen: 'VitalsRouteVitals',
    },
    {
      key: 'experts',
      icon: 'md-contacts',
      label: 'Experts',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: 'grey',
      screen: 'ExpertsRouteExpertConnect',
    },
    {
      key: 'settings',
      icon: 'md-contact',
      label: 'Profile',
      barColor: '#ffffff',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      labelColor: 'grey',
      screen: 'UserWellnessAssessmentRouteUserProfile',
    },
  ];

  renderIcon = icon => ({ isActive }) =>
    isActive ? (
      <Icon size={20} name={icon} style={{ color: '#144e76' }} />
    ) : (
        <Icon style={{ color: '#494949' }} size={20} name={icon} />
      );

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      labelStyle={{
        color: isActive ? '#144e76' : '#494949',
        ...bottomTabsFontStyle,
      }}
      renderIcon={this.renderIcon(tab.icon)}
      style={[styles.iosPadding]}

    />
  );

  setNewTab = newTab => {
    const { navigator, goalsEssentials } = this.props;
    if (goalsEssentials.length > 0 && newTab.screen === 'GoalsRouteGoals') {
      navigator.navigate(newTab.screen);
    } else if (newTab.screen === 'GoalsRouteGoals') {
      Toast.show({
        text: 'Please wait while data gets updated..!!',
        duration: 2000,
        type: 'default',
      });
    } else {
      navigator.navigate(newTab.screen);
    }
  };

  render() {
    const { activeTab } = this.props;
    return (
      <BottomNavigation
        onTabPress={this.setNewTab}
        renderTab={this.renderTab}
        tabs={this.tabs}
        activeTab={activeTab}
      />
    );
  }
}

const bottomTabsFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  iosPadding: {
    ...Platform.select({
      ios: { paddingBottom: 15, minWidth: Dimensions.get('window').width/10 },
      android: { minWidth: Dimensions.get('window').width/10 }
    })
  }
});

export default connect(
  mapStateToProps,
  null,
)(BottomZulTabs);
