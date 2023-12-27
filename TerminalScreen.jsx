import React, { useState } from 'react';
import { Text, ScrollView, SafeAreaView, NativeModules, NativeEventEmitter  } from 'react-native';  

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);

export default function TerminalScreen({data}) {
  const [contentOffset, setContentOffset] = useState(0);
  
  return (
    <SafeAreaView >
      <ScrollView
        contentOffset={{x: 0, y: contentOffset}}
        onContentSizeChange={(_, height) => {
          setContentOffset(height);
        }}
        >
          <Text>{"    Дані:"}</Text>
          {!!data && data.map((value, index) => (
            <Text key={index}>{"    " + value}</Text>  
          ))}
        </ScrollView>
    </SafeAreaView>
  );

}
