import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions, Button
} from 'react-native';
import { db } from './firebase';
import ProgressCircle from 'react-native-progress-circle';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryLabel, VictoryAxis } from "victory-native";
import firebase from 'firebase'

const screenWidth = Dimensions.get('window').width;

export default class SDA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastNumber: 0,
      items: [],
      durray: [1, 2, 3, 4],
      testtest: [5, 5, 5, 5],
      studyDuration: 0,
      tmpArray: [],
      userId: '',
      loaded: false,
    }
  }
  loadPage() {
    this.setState({ loaded: true });
    this.initialiseData();
  }

  componentDidMount() {
    const currentUserId = firebase.auth().currentUser.uid;
    this.setState({
      userId: currentUserId,
    });
    console.log(currentUserId + ' User ID')
  }

  initialiseData() {
    console.log(this.state.userId)
    let userId = this.state.userId
    let userRef = db.ref(`/Users/${userId}`)
    let tmpArray = [];
    let durray = [];
    userRef.on('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        tmpArray.push(childSnapshot.val());
        durray.push(Number(childSnapshot.val().duration));
      });

      console.log(tmpArray)
      function isReal(obj) {
        return obj.duration != null
      }
      function focus(obj) {
        let x = obj.duration / obj.durationTotal
        return x
      }
      var filArr = tmpArray.filter(isReal)
      console.log(filArr)
      var last5Arr = filArr.slice(Math.max(filArr.length - 5, 0))
      var focusArr = last5Arr.map(focus)
      console.log(focusArr)
      var percentShow = focusArr[(focusArr.length) - 1]
      console.log(percentShow)
      this.setState({
        graphInput: focusArr,
        percentShow: percentShow
      })  
    });
 
  }

  render() {
    console.log("render: " + this.state.loaded);
    if (this.state.loaded == false) {
      return (
        <View>
          <Button
            title="Press me to load data for course "
            onPress={this.loadPage.bind(this)}
          />
        </View>
      );
    }
    else {
      const chartConfig = {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2 // optional, default 3
      };

      return (

        <View>
          <Text>Your Study Duration Breakdown</Text>
          <Button title="Press me to load data for course " onPress={this.initialiseData.bind(this)} />
          <ProgressCircle
            percent={this.state.percentShow * 100}
            radius={80}
            borderWidth={20}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
          >
            <Text style={{ fontSize: 18 }}>{(this.state.percentShow * 100).toFixed(2) + '%'}</Text>
          </ProgressCircle>
          <View>
            <Text>
              Your Average Focus Percentage across the semester
  </Text>
            <VictoryChart
              domainPadding={10}
            >
              <VictoryLabel text="Past 5 focus percentage" x={225} y={30} textAnchor="middle" />
              <VictoryAxis
                // tickValues specifies both the number of ticks and where
                // they are placed on the axis
                tickValues={[0, 1, 2, 3, 4]}
                tickFormat={[0, 1, 2, 3, 4]}
                label='Most recent data at right'
              />
              <VictoryAxis
                dependentAxis
                // tickFormat specifies how ticks should be displayed
                tickFormat={(x) => (`${x * 100}%`)}
                domain={{ x: [0, 4], y: [0, 1] }}
              />
              <VictoryLine

                data={this.state.graphInput}

                name="Your study duration by week"
              />

            </VictoryChart>
          </View>
        </View>

      );
    }
  }
}
