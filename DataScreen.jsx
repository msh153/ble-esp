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
  const [data, setData] = useState([
    -2849,3306,3263,2832,2152,1175,114,0,0,0,0,0,0,0,0,0,0,710,1657,2513,3238,3738,3738,3198,2487,1558,465,0,0,0,0,0,0,0,0,935,1791,2670,3430,3999,4043,3483,2704,1793,702,0,0,0,0,0,0,0,0,0,118,989,1957,2839,3681,4095,4095,3759,2887,1971,870,0,0,0,0,0,0,0,392,1311,2288,3249,4095,4095,4095,4095,3467,2525,1453,406,0,0,0,0,0,0,628,1599,2588,3679,4095,4095,4095,4095,4065,2959,1915,821,0,4095,4095,3095,2067,967,41,0,0,0,0,0,0,83,4095,4095,4095,4095,4095,4095,4095,4095,3231,2237,1270,464,0
  ]);

  const handleDisconnectedPeripheral = data => {
    alert('Disconnected from ' + data.peripheral);
  };  
  
  const handleDidUpdateValueForCharacteristic = (receivedData) => {
    const first = parseInt(receivedData.value[0]); 
    const second = parseInt(receivedData.value[1]);

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
