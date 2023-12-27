import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter  } from 'react-native';  
import { ESPEcg } from './src/ESPEcgTag'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);
import TerminalScreen from './TerminalScreen';
import GraphicScreen from './GraphicScreen';

export default function DataScreen({deviceId}) {
  const [data, setData] = useState([0]);

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
      var callCount = 1;
      var repeater = setInterval(function () {
        if (callCount < 30) {
          callCount += 1;
          let val = Math.floor(Math.random() * (10 - 1) + 1);
          setData(prev => [...prev, val]);
        } else {
          clearInterval(repeater);
        }
      }, 1000);

      const value = Math.floor(Math.random() * (10 - 1) + 1);

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
      <NavigationContainer independent={true}>
           <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
      
                  if (route.name === 'Graphic') {
                    iconName = 'heart-pulse';
                      return <MaterialCommunityIcons  name={iconName} size={size} color={color} />;
                    } else if (route.name === 'Terminal') {
                    iconName = 'code-greater-than';
                    return <MaterialCommunityIcons  name={iconName} size={size} color={color} />;
                  }
                },
                tabBarActiveTintColor: '#2296f3',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
                headerShown: false,
              })}
            >
                  <Tab.Screen name="Graphic" 
                      options={{
                        drawerIcon: ({color, size} ) => <MaterialCommunityIcons
                            size={size}
                            color={color}
                            name="heart-pulse"></MaterialCommunityIcons>
                    }}
                    children={() => <GraphicScreen data={data}/>}
                  />
                  <Tab.Screen name="Terminal"
                     options={{
                      drawerIcon: ({color, size} ) => <MaterialCommunityIcons
                          size={size}
                          color={color}
                          name="code-greater-than"></MaterialCommunityIcons>
                     }} 
                    children={() => <TerminalScreen data={data}/>}
                  />
          </Tab.Navigator>
      </NavigationContainer>
  );

}
