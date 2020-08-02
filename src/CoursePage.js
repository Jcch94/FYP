import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Button,
  Picker,
} from 'react-native';
import { db } from './firebase';
import ProgressCircle from 'react-native-progress-circle';
import moment from 'moment';
import firebase from 'firebase';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryLabel,
  VictoryAxis,
} from 'victory-native';
let courseRef = db.ref('/courseName');
const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];
const screenWidth = Dimensions.get('window').width;
function averageDurationFromArray(array) {
  let i = 0;
  let weekNo = array[0].weekNo;
  console.log(weekNo);
  let totalDurationCount = 0;
  console.log(array);
  for (i = 0; i < array.length; ++i) {
    totalDurationCount += Number(array[i].duration);
  }
  console.log(totalDurationCount);
  let averageStudy = totalDurationCount / array.length;
  let averageStudyArr = { weekNo: weekNo, averageStudy: averageStudy };
  return averageStudyArr;
}
function getSum(total, num) {
  return total + Math.round(num);
}
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: 0,
      items: 0,
      studyDuration: 0,
      typeArray: 0,
      Notes: 50,
      Lec: 50,
      Tut: 100,
      counterArray: 0,
      averageStudy: 0,
      averageStudyALL: 20,
      tmpCourseArray: 0,
      tmpArray: 0,
      tmpArrayDur: [
        { weekNo: 0, duration: 0 }

      ],
      tmpDateCourse: 0,
      weekNoArr: 0,
      idealArr: [ { weekNo: 0, duration: 4},
        { weekNo: 1, duration: 3 },
        { weekNo: 2, duration: 4 },
        { weekNo: 3, duration: 3 },
        { weekNo: 4, duration: 5 },
        { weekNo: 5, duration: 4 },
        { weekNo: 6, duration: 5 },
        { weekNo: 7, duration: 4 },
        { weekNo: 8, duration: 3 },
        { weekNo: 9, duration: 3 },
        { weekNo: 10, duration: 2 },
        { weekNo: 11, duration: 8 },
        { weekNo: 12, duration: 6 },
      ],
      courseArrayDur : [],
      resultArray: [],
    };
  }
  componentDidMount() {
    const currentUserId = firebase.auth().currentUser.uid;
    this.setState({
      userId: currentUserId,
      userEmail: firebase.auth().currentUser.email
    })
  }
  studyTypePieData() {
    let durationLec = 0;
    let counterLec = 0;
    let durationTut = 0;
    let counterTut = 0;
    let durationNotes = 0;
    let counterNotes = 0;
    let i = 0;
    let pieTypeArray = this.state.tmpArray;
    console.log(pieTypeArray.length);
    for (i = 0; i < pieTypeArray.length; ++i) {
      if (pieTypeArray[i].studytype == 'Lecture') {
        durationLec += Number(pieTypeArray[i].duration);
        counterLec = counterLec + 1;
      } else if (pieTypeArray[i].studytype == 'Notes') {
        durationTut += Number(pieTypeArray[i].duration);
        counterTut++;
      } else if (pieTypeArray[i].studytype == 'Tutorial') {
        durationNotes += Number(pieTypeArray[i].duration);
        counterNotes++;
      }
      console.log('one cycle' + counterLec + durationLec + 'Lecture')
      console.log('one cycle' + counterNotes + durationNotes + 'Notes')
      console.log('one cycle' + counterTut + durationTut + 'Tutorial')

    }
    this.setState({
      Lec: ((durationLec / counterLec)),
      Tut: ((durationTut / counterTut)),
      Notes: ((durationNotes / counterNotes)),
    });
    console.log(this.state.Lec)
    console.log(this.state.Tut)
    console.log(this.state.Notes)
    let userId = this.state.userId
    let userRef = db.ref(`/Users/${userId}`)
    let yourArray = [];
    userRef.on('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        if ((childSnapshot.key) != "wew") {
          yourArray.push(childSnapshot.val());
        }
      }

      ); this.setState({ yourArray: yourArray })
    })
  }
  updatecourseName = courseName => {
    if (courseName !== 0) {
      this.setState({ courseName: courseName }, () => {

        let tmpCourseArray = [];
        let tmpCourseArrayDuration = [];
        let tmpCourseArrayType = [];
        let courseRef = db.ref(`/courseName/${courseName}`);
        courseRef.on('value', snapshot => {
          snapshot.forEach(childSnapshot => {
            tmpCourseArray.push(childSnapshot.val());
            tmpCourseArrayDuration.push(Number(childSnapshot.val().duration));
            tmpCourseArrayType.push(childSnapshot.val().studytype);
            console.log("FIRSY");

          });
          console.log('this is tmpcourseArray : ');
          console.log(tmpCourseArray);
          console.log(this.state.courseName);
          this.setState({ durray: tmpCourseArrayDuration });
          this.setState({ typeArray: tmpCourseArrayType });
          this.setState({ tmpArray: tmpCourseArray });
          console.log(this.state.tmpArray)
        });
      });
      {/*this.sortData();*/ }
    }
  };
  sortData() {
    let allDataArr = this.state.tmpArray;
    let i = 0,
      j = 0; //i = weekNo , j = pointer in array
    let sortedArr = [];
    for (i = 0; i < 13; i++) {
      let arr = [];
      let data = 0;
      for (j = 0; j < allDataArr.length; j++) {
        if (allDataArr[j].weekNo == i) {
          data = allDataArr[j];
          arr.push(data);
        }
      }
      sortedArr[i] = arr;
    }
    console.log(sortedArr);
    this.setState({
      sortedArr: sortedArr,
    });
  }
  courseHours() {
    let allDurArr = this.state.tmpArray;
    let wkArray = [];
    let sortedArr = [];
    let i = 0,
      j = 0; //i = weekNo , j = element pointer in allDurArr
    for (i = 0; i < 13; i++) {
      let arr = [];
      let dur = 0;
      for (j = 0; j < allDurArr.length; j++) {
        if (allDurArr[j].weekNo == i) {
          dur = Number(allDurArr[j].duration);
          arr.push(dur);
        }
      }
      let duration = arr.reduce(getSum, 0);
      if (duration == 0) {
        wkArray[i] = { weekNo: i, duration: duration };
      } else duration = duration / arr.length;
      {
        wkArray[i] = { weekNo: i, duration: duration };
      }
      let wkArrayObj = Object.values(wkArray);
      this.setState({ tmpArrayDur: wkArrayObj });
    }
    console.log(wkArray);
    console.log(this.state.sortedArr);
    this.sortSubjectDur(this.state.courseName)
  }
  compareToUser() {
    let idealCourseArr = this.state.idealArr
    let i = 0;
    let compArray = this.state.idealArr
    let userArray = this.state.courseArrayDur
    let Result = 0
    let resultArray = [];
    for (i = 0; i < compArray.length; i++) {
      let Result = 0;
      Result =compArray[i].duration - userArray[i].duration
      if (Result >= 0 ){
        resultArray.push({weekNo:i,duration:Result,fill :"red"})
      }
      else 
      resultArray.push({weekNo:i,duration: Math.abs(Result),fill :"green"})
     }
     console.log(resultArray)
     this.setState({resultArray:resultArray})
  }
  sortSubjectDur(courseName) {

    console.log(courseName)
    let tmpCourseArray = this.state.yourArray;
    let courseArray = [];
    let z = 0;
    for (z = 0; z < tmpCourseArray.length; z++) {
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
      console.log(wkArrayObj )
    
    }
console.log('reacched')
    
  }

  render() {
    const chartConfig = {
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#220000',
      color: (opacity = 1) => `rgba(0, 40, 100, ${opacity})`,
      strokeWidth: 3, // optional, default 3
    };

    const graphStyle = {
      marginVertical: 8,
      ...chartConfig.style,
    };
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
    const dataWeek = [ { weekNo: 0, duration: 3 },
      { weekNo: 1, duration: 2 },
      { weekNo: 2, duration: 4 },
      { weekNo: 3, duration: 5 },
      { weekNo: 4, duration: 3 },
      { weekNo: 5, duration: 4 },
      { weekNo: 6, duration: 2 },
      { weekNo: 7, duration: 4 },
      { weekNo: 8, duration: 3 },
      { weekNo: 9, duration: 5 },
      { weekNo: 10, duration: 2 },
      { weekNo: 11, duration: 8 },
      { weekNo: 12, duration: 6 },
      
    ];
    return (
      <ScrollView>
        <View>
          <Text> Course Page </Text>
          <Picker
            selectedValue={this.state.courseName}
            style={{ height: 50, width: 200 }}
            onValueChange={this.updatecourseName.bind(this)}>
            <Picker.Item label="Please select a course" value="0" />
            <Picker.Item label="EE3001" value="EE3001" />
            <Picker.Item label="EE3002" value="EE3002" />
            <Picker.Item label="EE3014" value="EE3014" />
          </Picker>

          <Button title="Study Type Breakdown" onPress={this.studyTypePieData.bind(this)} />
          <Text>Average time spent on Each Study Type by Course</Text>
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


          <VictoryChart domainPadding={10}>
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              tickFormat={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              label="Week Number"
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={x => `${x}Hr`}
            />
            <VictoryLabel
              text="Avg student Studying Hours per Week"
              x={150}
              y={30}
              textAnchor="middle"
            />

            <VictoryBar
              style={{ data: { fill: '#c43a31' } }}
              data={this.state.tmpArrayDur}
              x="weekNo"
              y="duration"
            />
          </VictoryChart>

          <Button title="View Graph" onPress={this.courseHours.bind(this)} />

          <VictoryLabel
            text="Recommended study hours per week"
            x={225}
            y={30}
            textAnchor="middle"
          />

          <VictoryChart
            // domainPadding will add space to each side of VictoryBar to
            // prevent it from overlapping the axis
            domainPadding={10}>
            <VictoryLabel
              text="Recommended Study hours for Course"
              x={150}
              y={30}
              textAnchor="middle"
            />
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              tickFormat={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              label="Week Number"
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={x => `${x}Hr`}
            />
            <VictoryBar
              data={this.state.idealArr}
              x="weekNo"
              y="duration"
              style={{
                data: {
                  fill: ({ datum }) => '#8BC34A',
                },
              }}
            />
          </VictoryChart>

          <VictoryChart domainPadding={10}>
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              tickFormat={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
              label="Week Number"
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={x => `${x}Hr`}
            />
            <VictoryLabel
              text="Your Average study Duration for this course"
              x={150}
              y={30}
              textAnchor="middle"
            />

            <VictoryBar
              style={{ data: { fill: '#c43a31' } }}
              data={this.state.courseArrayDur}
              x="weekNo"
              y="duration"
            />
          </VictoryChart>
          <Button title="Compare my Results with ideal" onPress={this.compareToUser.bind(this)} />
         <VictoryChart domainPadding={10}>
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              tickFormat={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              label="Week Number"
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={x => `${x}Hr`}
            />
            <VictoryLabel
              text="Compared Results"
              x={150}
              y={30}
              textAnchor="middle"
            />

            <VictoryBar
              style={{
      data: {
        fill: ({ datum }) => datum.fill,
      }
    }}
              data={this.state.resultArray}
              x="weekNo"
              y="duration"
            />
  </VictoryChart>
        </View>
      </ScrollView>
    );
  }
}
