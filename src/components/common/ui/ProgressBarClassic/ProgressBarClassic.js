'use strict'


var React = require('react')
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
} = require('react-native')

export default class ProgressBarClassic extends React.Component {
  constructor() {
    super()
    this.state = {
      progress: 0,
      init_animation: false,
    }
  }

  componentDidMount() {
    LayoutAnimation.spring()
    setTimeout(() => {
      this.setState({ progress: this.props.progress })
    }, 0)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ progress: nextProps.progress })
  }

  componentWillUpdate() {
    LayoutAnimation.spring()
  }

  render() {
    var value = false
    var valueBalloon = false
    var label = false
    var marginTop = 0

    switch (this.props.valueStyle) {
      case 'balloon':
        valueBalloon = (
          <View style={Style.flexBox}>
            <View style={[{ flex: this.state.progress }]}>
              <View style={Style.progressBar__balloon}>
                <View style={Style.progressBar__balloonArrow}></View>
                <Text style={Style.progressBar__balloonVal}>{this.state.progress}%</Text>
              </View>
            </View>
            <View style={[{ flex: 100 - this.state.progress }]}></View>
          </View>
        )
        marginTop = 30

        break
      case 'none':
        break
      default:
        value = (
          <View style={Style.progressBar_mes}>
            <Text style={Style.progressBar__val}>{this.state.progress}%</Text>
          </View>
        )
        break
    }

    if (this.props.valueStyle !== 'balloon' && this.props.label) {
      marginTop = 20
      label = (
        <View style={Style.labelWrap}>
          <Text style={Style.label}>{this.props.label} {this.props.value && `: ${this.props.value}`}</Text>
        </View>
      )
    }

    var chart = (
      <View style={{ height: '10%', width: '90%', flex: 1 }}>
        {valueBalloon}
        {label}
        <View style={[Style.flexBox, Style.progressBar, { marginTop: marginTop }]}>
          <View style={[Style.progressBar_left, { flex: this.props.progress }]}>
            {value}
          </View>
          <View style={[Style.progressBar_right, { flex: 100 - this.props.progress }]}></View>
        </View>

      </View>
    )
    return chart
  }
}

ProgressBarClassic.defaultProps = {
  progress: 0,
}

const Style = StyleSheet.create({
  flexBox: {
    flex: 1,
    flexDirection: 'row',
  },
  progressBar: {
    overflow: 'visible',
    height: '10%',
    borderRadius: 20,
    marginBottom: 5,
  },
  progressBar_left: {
    backgroundColor: '#296e01',
    height: '20%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  progressBar_right: {
    backgroundColor: '#DCDCDC',
    height: '20%',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  progressBar_mes: {
    position: 'absolute',
    right: 0,
    paddingRight: 5,
    // lineHeight: 30,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
  },
  progressBar__balloon: {
    position: 'absolute',
    padding: 3,
    right: -15,
    backgroundColor: '#296e01',
    borderRadius: 2,
    paddingRight: 5,
    flexDirection: 'row',
  },
  progressBar__balloonArrow: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: '#296e01',
    borderRadius: 30,
    width: 30,
    height: 30,
  },
  progressBar__val: {
    // textAlign: 'center',
    color: '#fff',
    // lineHeight: 30,
  },
  progressBar__balloonVal: {
    textAlign: 'center',
    color: '#fff',
    // lineHeight: 30,
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: .2,
  },
  label: {
    color: 'rgb(0, 122, 255)',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center'
  }
});
