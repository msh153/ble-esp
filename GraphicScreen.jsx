import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, SafeAreaView, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';


export default function GraphicScreen({data, contentOffsetProp}) {
  const windowWidth = Dimensions.get('window').width;
  const [chartWidth, setChartWith] = useState(windowWidth);
  const [stopWidth, setStopWidth] = useState(false);
  const pointsPerScreen = 200;
  const [kalmanData, setKalmanData] = useState([0,2]);
  const [contentOffset, setContentOffset] = useState({ x: 26.5625 * data.length, y: 0 });

  useEffect(()=>{
    const filteredData = calculateKalmanData(data);
      setKalmanData(filteredData);

    if (data.length < pointsPerScreen) {return;}
      setChartWith(data.length / pointsPerScreen * windowWidth);

    if (stopWidth)
      {setContentOffset({x:0, y:0});}
    else
      {setContentOffset({ x: 26.5625 * data.length, y: 0 });}

  }, [data.length]);

  return (
    <SafeAreaView >
      <Button title={stopWidth ? 'Follow' : 'Stop'} onPress={() => setStopWidth(!stopWidth)}/>
      <ScrollView
        horizontal={true}
        contentOffset={contentOffset}
        showsHorizontalScrollIndicator={false}
        >
          <LineChart
            withDots={false}
            withShadow={false}
            chartConfig={{
            backgroundColor: '#ffff',
            backgroundGradientFrom: '#ffff',
            backgroundGradientTo: '#ffff',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(46, 204, 113  , ${opacity})`,
            labelColor: (opacity = 1) => `rgba(28, 40, 51 , ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 12,
            }}}
            opacity={0}
            data={{
              legend: ['Origin', 'Kalman filter'],
              datasets: [
                {
                  data: data,
                  backgroundColor: '#e26a00',
                },
                {
                  data: kalmanData, //Kalman Values
                  color: (opacity = 1) => `rgba(255,0,0,${opacity})`,
                },
              ],
            }}
            yAxisLabel={'mV '}
            bezier
            width={chartWidth}
            height={Dimensions.get('window').height - (Dimensions.get('window').height / 100 * 25)}
            verticalLabelRotation={-90}
          />
        </ScrollView>
    </SafeAreaView>
  );

}

function calculateKalmanData(data) {

  // Параметри фільтра Калмана
  const R = 0.01; // Шум вимірювань
  const Q = 0.03; // Шум процесу

  const kalmanData = [];

  // Стан фільтра
  let x = 0;
  let p = 1;

  for (let i = 0; i < data.length; i++) {

    // Прогноз
    const x_prior = x;
    const p_prior = p + Q;

    // Оновлення
    const k = p_prior / (p_prior + R);
    x = x_prior + k * (data[i] - x_prior);
    p = (1 - k) * p_prior;

    // Збереження фільтрованого значення
    kalmanData.push(x);
  }

  return kalmanData;
}
