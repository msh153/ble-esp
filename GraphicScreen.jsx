import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, ScrollView, SafeAreaView, NativeModules, NativeEventEmitter  } from 'react-native';  
import { LineChart } from 'react-native-chart-kit';
import { ESPEcg } from './src/ESPEcgTag'

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);
import BleManager from "react-native-ble-manager";

export default function GraphicScreen({deviceId}) {
  const [data, setData] = useState([1,2,1,2,1,2,1,2, 1,2,1,2, 1,2,1,2 ]);
  const [contentOffset, setContentOffset] = useState(0);
  const handleDisconnectedPeripheral = data => {
    alert('Disconnected from ' + data.peripheral);
  };  
  const handleDidUpdateValueForCharacteristic = (data) => {
    const first = parseInt(data.value[0]); 
    const second = parseInt(data.value[1]);

    // Зсунути та об'єднати
    const result = (second << 8) + first;
    console.log(
      "Data: " + result
    )
    setData(prev => [...prev, result])
  }
  useEffect(() => {    
    if(!deviceId) return;

    BleManager.connect(deviceId);
    alert(deviceId)
    try{
      BleManager.startNotification(deviceId,ESPEcg.service,ESPEcg.characteristic);
    } catch(e){
      alert(e)
    }

    bleEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleDidUpdateValueForCharacteristic,
    );
    

    return () => {
      console.log('Unmount');

      bleEmitter.removeAllListeners();
    };
  }, [deviceId]);
  return (
    <SafeAreaView >
      <ScrollView
        contentOffset={{x: 0, y: contentOffset}}
        onContentSizeChange={(_, height) => {
          setContentOffset(height);
        }}
        >
          <Text>Дані:</Text>
          {!!data && data.map((value, index) => (
            <Text key={index}>{"    " + value}</Text>  
          ))}
        </ScrollView>
    </SafeAreaView>
  );

}
