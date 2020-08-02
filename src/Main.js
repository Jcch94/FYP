// okay
import React from 'react'
import { StyleSheet, Platform, Image, Text, View,Button ,TouchableOpacity} from 'react-native'
import firebase from 'firebase'
export default class Main extends React.Component {
  constructor(props) {
    super(props);
  this.state = { 
    currentUser: null ,
     };
}

  componentDidMount() {
    const { currentUser } = firebase.auth()

    this.setState({ currentUser })
    console.log(currentUser)
  }

  render() {
    const { currentUser } = this.state

    return (
      <View style={styles.container}>
        <Text>
        Welcome  {currentUser && currentUser.email} !
        </Text>
       
       <TouchableOpacity
          onPress={()=> this.props.navigation.navigate("StopWatch")}
          activeOpacity={0.6}
          style={[styles.button,{backgroundColor: '#FF6F00' }]} 
           
>
          <Text style={styles.buttonText}> Start Study </Text>

        </TouchableOpacity>

<TouchableOpacity
          onPress={()=> this.props.navigation.navigate("Profile")}
          activeOpacity={0.6}
          style={[styles.button,{backgroundColor:  '#FF6F00' } ]} 
           
>
          <Text style={styles.buttonText}> Profile Page </Text>

        </TouchableOpacity>
         <TouchableOpacity
          onPress={()=>this.props.navigation.navigate("CoursePage")}
          activeOpacity={0.6}
          style={[styles.button,{backgroundColor: '#FF6F00' }]} 
           
>
          <Text style={styles.buttonText}> Course Summary   </Text>

        </TouchableOpacity>
         <TouchableOpacity
          onPress={()=>this.props.navigation.navigate("Login")}
          activeOpacity={0.6}
          style={[styles.button,{backgroundColor: '#FF6F00' }]} 
           
>
          <Text style={styles.buttonText}> Sign Out   </Text>

        </TouchableOpacity>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
 button: {
   width: '80%',
    paddingTop:8,
    paddingBottom:8,
    borderRadius:7,
    marginTop: 10
  },
 buttonText:{
      color:'#fff',
      textAlign:'center',
      fontSize: 20
  }, 
});
