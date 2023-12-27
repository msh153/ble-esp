import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, ScrollView, SafeAreaView, NativeModules, NativeEventEmitter  } from 'react-native';  
import { LineChart } from 'react-native-chart-kit';
import { ESPEcg } from './src/ESPEcgTag'

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);
import BleManager from "react-native-ble-manager";

export default function GraphicScreen({data}) {
  const windowWidth = Dimensions.get('window').width; 
  const [chartWidth, setChartWith] = useState(windowWidth);
  const pointsPerScreen = 30;

  useEffect(()=>{
    if(data.length < pointsPerScreen)
      return;
    setChartWith(data.length / pointsPerScreen * windowWidth)
  }, [data.length]);

  return (
    <SafeAreaView >
      <ScrollView
        horizontal={true}
        contentOffset={{x: 26.5625 * data.length, y: 0}}
        showsHorizontalScrollIndicator={false}
        >
          <LineChart
            withDots={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            withShadow={false}
            chartConfig={{
            backgroundColor: "#ffff",
            backgroundGradientFrom: "#ffff",
            backgroundGradientTo: "#ffff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(46, 204, 113  , ${opacity})`,
            labelColor: (opacity = 1) => `rgba(28, 40, 51 , ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#2ECC71",
            },
            }}
            opacity={0}
            data={{
              // labels: ["January", "February", "March", "April", "May", "June"],
              legend: [`{legend}`],
              datasets: [
                {
                  data: data,
                  backgroundColor: '#e26a00',
                }
              ]
            }}
            bezier
            width={chartWidth}
            height={Dimensions.get('window').height - (Dimensions.get('window').height/100*15)}
          />
        </ScrollView>
    </SafeAreaView>
  );

}
