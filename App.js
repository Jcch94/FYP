import React from 'react';
import { View, Text, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
; // Version can be specified in package.json
import StopWatch from './src/StopWatch';
import SignUp from './src/SignUp';
import Main from './src/Main';
import Login from './src/Login';
import Loading from './src/Loading'
import Profile from './src/Profile'
import CoursePage from './src/CoursePage'
import SDA from './src/SDA'
import { createAppContainer } from 'react-navigation';
class HomeScreen extends React.Component {

  // create the title for the screen
  static navigationOptions = {
    title : "Home"
  }
  
  // create constructor to get access to props
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen Stack Navigation Sample</Text>
        <Button title="next screen" onPress={()=> this.props.navigation.navigate("Detail")}></Button>
      </View>
    );
  }
}

class DetailScreen extends React.Component {

  // create the title for the screen
  static navigationOptions = {
    title : "Details"
  }

  // create constructor to get access to props
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Detail Screen Stack Navigation Sample</Text>
        <Button title="StopWatch
        " onPress={()=> this.props.navigation.navigate("StopWatch")}></Button>
        <Button title="Sign Up Here
        " onPress={()=> this.props.navigation.navigate("SignUp")}></Button>
      </View>
    );
  }
}

const RootStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Detail: {
    screen: DetailScreen,
  },
  SignUp : {
    screen : SignUp,
  },
  StopWatch : {
    screen : StopWatch,
  },
  Main : {
    screen : Main,
  },
  Login :{
    screen : Login,
  },
 Loading:{
   screen : Loading
 },
 Profile : {
   screen : Profile
 },
 CoursePage:{
   screen : CoursePage
 },
 SDA:{
   screen :SDA
 }
},
{initialRouteName: 'Loading'});
const AppContainer = createAppContainer(RootStack)
export default AppContainer