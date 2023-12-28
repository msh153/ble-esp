import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter  } from 'react-native';
import { ESPEcg } from './src/ESPEcgTag';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BleManager from 'react-native-ble-manager';

const Tab = createBottomTabNavigator();

const BleManagerModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleManagerModule);
import TerminalScreen from './TerminalScreen';
import GraphicScreen from './GraphicScreen';

export default function DataScreen({deviceId}) {
  const [data, setData] = useState([0]);

  const parseData = (receivedData) => {
    const first = parseInt(receivedData.value[0], 10);
    const second = parseInt(receivedData.value[1], 10);

    return (second << 8) + first;
  };
  const handleDisconnectedPeripheral = data => {
    alert('Disconnected from ' + data.peripheral);
  };

  const handleDidUpdateValueForCharacteristic = (receivedData) => {
    const result = parseData(receivedData);
    setData(prev => [...prev, result]);
  };
  useEffect(() => {
    if (!deviceId) {return;}

    BleManager.connect(deviceId);
    BleManager.startNotification(deviceId,ESPEcg.service,ESPEcg.characteristic);
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
                            name="heart-pulse" />,
                    }}
                    children={() => <GraphicScreen data={data}/>}
                  />
                  <Tab.Screen name="Terminal"
                     options={{
                      drawerIcon: ({color, size} ) => <MaterialCommunityIcons
                          size={size}
                          color={color}
                          name="code-greater-than" />,
                     }}
                    children={() => <TerminalScreen data={data}/>}
                  />
          </Tab.Navigator>
      </NavigationContainer>
  );

}
