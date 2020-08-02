import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import React, { Component } from 'react';
import { Dimensions, Button, Picker } from 'react-native';
import { db } from './firebase';
import { PieChart, } from 'react-native-chart-kit';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryLabel, VictoryAxis,VictoryGroup } from "victory-native";
import firebase from 'firebase'
import Svg, { Path } from 'react-native-svg';
const screenWidth = Dimensions.get('window').width;
let userRef = db.ref(`/Users`)

function getSum(total, num) {
  return total + Math.round(num);
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      tmpArray: [],
      tmpArrayDur: [],
      sortedArr: [],
      dayArray: [],
      Lec: 0,
      Notes: 0,
      Tut: 0,
      courseArrayDur: [],
    }
  }
  componentDidMount() {
    const currentUserId = firebase.auth().currentUser.uid;
    this.setState({
      userId: currentUserId,
      userEmail: firebase.auth().currentUser.email
    })
  }
  initialiseData() {
    console.log('initialised')

    let userId = this.state.userId
    let userRef = db.ref(`/Users/${userId}`)
    let yourArray = []
    let yourArrayDur = []
    let yourArrayType = []
    let yourArraySubject = []
    userRef.on('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        if ((childSnapshot.key) != "wew") {
          yourArray.push(childSnapshot.val());
          yourArrayDur.push(Number(childSnapshot.val().duration));
          yourArrayType.push(childSnapshot.val().studytype);
        }
      });
      this.setState({
        tmpArray: yourArray,
      })
      console.log(yourArray)
      console.log(yourArrayDur)
      this.setState({
        tmpArray: yourArray,
      })
    });
    this.sortData();
  }
  sortData() {
    let allDataArr = this.state.tmpArray
    let i = 0, j = 0 //i = weekNo , j = pointer in array
    let sortedArr = []
    for (i = 0; i < 13; i++) {
      let arr = []
      let data = 0
      for (j = 0; j < allDataArr.length; j++) {
        if (allDataArr[j].weekNo == i) {
          data = (allDataArr[j])
          arr.push(data)
        }
      }
      sortedArr[i] = arr
    }
    console.log(sortedArr)
    this.setState({
      sortedArr: sortedArr
    })
  }
  //Total Hours Studied Per Week
  yourHours() {
    let allDurArr = this.state.tmpArray
    let wkArray = []
    let i = 0, j = 0 //i = weekNo , j = element pointer in allDurArr
    for (i = 0; i < 13; i++) {
      let arr = []
      let dur = 0
      for (j = 0; j < allDurArr.length; j++) {
        if (allDurArr[j].weekNo == i) {
          dur = Number(allDurArr[j].duration)
          arr.push(dur)
        }
      }
      let duration = arr.reduce(getSum, 0)
      wkArray[i] = { weekNo: i, duration: duration }
      let wkArrayObj = Object.values(wkArray)
      this.setState({ tmpArrayDur: wkArrayObj })
    }
    console.log(wkArray)
  }


  onPickerWeekChange = (weekNo) => {
    this.setState(
      {
        weekNo: weekNo
      },
      () => {
        console.log('worked' + this.state.weekNo)
        this.sortDay(weekNo)
      }
    );

  }
  sortDay(weekNo) {
    let wkNo = weekNo
    let allDurArr = this.state.sortedArr[wkNo]
    let wkArray = []
    let i = 0, j = 0 //i = weekNo , j = element pointer in allDurArr
    for (i = 0; i < 7; i++) {
      let arr = []
      let dur = 0
      for (j = 0; j < allDurArr.length; j++) {
        if (allDurArr[j].dayNo == i) {

          dur = Number(allDurArr[j].duration)
          arr.push(dur)
        }

      }
      let duration = arr.reduce(getSum, 0)
      wkArray[i] = { dayNo: i, duration: duration }
      let wkArrayObj = Object.values(wkArray)
      this.setState({ dayArray: wkArrayObj })
    }
    console.log(wkArray)

  }
  onPickerValueChange = (courseName) => {
    this.setState(
      {
        courseName: courseName
      },
      () => {
        console.log('worked' + this.state.courseName)
        this.sortSubject(courseName);
        this.sortSubjectDur(courseName);
      }
    );
  }
  sortSubject(courseName) {
    let tmpArray = this.state.tmpArray
    let i = 0; //to sort through all data belonging to User
    let counterLec = 0;
    let counterTut = 0;
    let counterNotes = 0;
    console.log(courseName)

    for (i = 0; i < tmpArray.length; i++) {
      if (courseName == (tmpArray[i].courseName)) {
        if (tmpArray[i].studytype == 'Lecture') {
          counterLec = counterLec + 1;
        } else if (tmpArray[i].studytype == 'Notes') {
          counterNotes = counterNotes + 1;
        } else if (tmpArray[i].studytype == 'Tutorial') {
          counterTut = counterTut + 1;
        }

      }

    }
    console.log('one cycle ' + counterLec + 'Lecture')
    console.log('one cycle ' + counterNotes + 'Notes')
    console.log('one cycle ' + counterTut + 'Tutorial')
    this.setState({
      Lec: counterLec,
      Tut: counterTut,
      Notes: counterNotes
    });
    console.log(this.state.Lec + 'counterLec')
    console.log(this.state.Tut + 'counterTut')
    console.log(this.state.Notes + 'counterNotes')
  }
  sortSubjectDur(courseName) {

    console.log(courseName)
    let tmpCourseArray = this.state.tmpArray;
    let courseArray = [];
    let z = 0;
    for (z= 0; z< tmpCourseArray.length; z++) {
      if (tmpCourseArray[z].courseName == courseName) {
        courseArray.push(tmpCourseArray[z])
        console.log('Added')
      }
    }
    let wkArray = []
    let x = 0, j = 0 //x = weekNo , j = element pointer in allDurArr
    for (x = 0; x < 13; x++) {
      let arr = []
      let dur = 0
      for (j = 0; j < courseArray.length; j++) {
        if (courseArray[j].weekNo == x) {
          dur = Number(courseArray[j].duration)
          arr.push(dur)
        }
      }
      let duration = arr.reduce(getSum, 0)
      wkArray[x] = { weekNo: x, duration: duration }
      let wkArrayObj = Object.values(wkArray)
      this.setState({ courseArrayDur: wkArrayObj })
    }
  }
  render() {
    const dataPie = [
      {
        name: 'Lecture',
        population: this.state.Lec,
        color: 'rgba(131, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Tutorials',
        population: this.state.Tut,
        color: 'rgba(0, 167, 234, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Notes',
        population: this.state.Notes,
        color: 'rgba(200, 0, 20, 1)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ];
    const chartConfig = {
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#220000',
      color: (opacity = 1) => `rgba(0, 40, 100, ${opacity})`,
      strokeWidth: 3, // optional, default 3
    };
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text >Welcome {this.state.userEmail}</Text>
          <Button title="Load data" onPress={this.initialiseData.bind(this)} />
          <VictoryChart
            domainPadding={10}
          >
            <VictoryLabel text="Study Duration by Week for all courses" x={200} y={30} textAnchor="middle" />
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              tickFormat={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              label='Week Number'
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(x) => (`${x}Hr`)}
            />
            <VictoryBar
              style={{ data: { fill: "#c43a31" } }}
              data={this.state.tmpArrayDur}
              x="weekNo"
              y="duration"
              name="Your study duration by week"
            />

          </VictoryChart>
          <Button title="Semester View" onPress={this.yourHours.bind(this)} />

          <VictoryChart
            domainPadding={10}
          >
            <VictoryLabel text="Duration for selected Week" x={225} y={30} textAnchor="middle" />
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7]}
              tickFormat={["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"]}
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(x) => (`${x}Hr`)}
            />
            <VictoryBar
              style={{ data: { fill: "#c43a31" } }}
              data={this.state.dayArray}
              x="weekNo"
              y="duration"
              name="Your study duration by week"
            />

          </VictoryChart>
          <Picker
            style={{ height: 50, width: 200 }}
            selectedValue={this.state.weekNo}
            onValueChange={this.onPickerWeekChange}>
            <Picker.Item label="Select Week" value="0" />
            <Picker.Item label="WEEK 1" value="1" />
            <Picker.Item label="WEEK 2" value="2" />
            <Picker.Item label="WEEK 3" value="3" />
            <Picker.Item label="WEEK 4" value="4" />
            <Picker.Item label="WEEK 5" value="5" />
            <Picker.Item label="WEEK 6" value="6" />
            <Picker.Item label="WEEK 7" value="7" />
            <Picker.Item label="WEEK 8" value="8" />
            <Picker.Item label="WEEK 9" value="9" />
            <Picker.Item label="WEEK 10" value="10" />
            <Picker.Item label="WEEK 11" value="11" />
            <Picker.Item label="WEEK 12" value="12" />

          </Picker>
          {/*<Button title="Display for particular Week" onPress={this.sortDay.bind(this)} />*/}
          <Picker
            style={{ height: 50, width: 200 }}
            selectedValue={this.state.courseName}
            onValueChange={this.onPickerValueChange}>
            <Picker.Item label="Select Course" value="EE3001" />
            <Picker.Item label="EE3001" value="EE3001" />
            <Picker.Item label="EE3002" value="EE3002" />
            <Picker.Item label="EE3014" value="EE3014" />
          </Picker>
          <PieChart
            data={dataPie}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <VictoryChart
            domainPadding={10}
          >

            <VictoryLabel text="Study Duration by Week for Selected Course" x={200} y={30} textAnchor="middle" />
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              tickFormat={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              label='Week Number'
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(x) => (`${x}Hr`)}
           />
            <VictoryBar
              style={{ data: { fill: "#c43a31" } }}
              data={this.state.courseArrayDur}
              x="weekNo"
              y="duration"
            />
         

          </VictoryChart>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
