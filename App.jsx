import 'react-native-gesture-handler';

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScanScreen from './ScanScreen';
import DataScreen from './DataScreen';
import {
    createDrawerNavigator,
} from '@react-navigation/drawer';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

const App = () => {
  const [deviceId, setDeviceId] = useState();

    return (
                <NavigationContainer independent={true}>
                    <Drawer.Navigator>
                        <Drawer.Screen
                            name="Scan"
                            options={{
                            drawerIcon: ({color, size} ) => <MaterialCommunityIcons
                                size={size}
                                color={color}
                                name="bluetooth-audio" />,
                        }}>
                            {() => <ScanScreen setDeviceId={setDeviceId}/>}
                        </Drawer.Screen>
                        <Drawer.Screen name="Data" options={{
                            drawerIcon: ({color, size} ) => <MaterialCommunityIcons
                                size={size}
                                color={color}
                                name="heart-pulse" />,
                        }}>
                            {() => <DataScreen deviceId={deviceId}/>}
                        </Drawer.Screen>
                    </Drawer.Navigator>
                </NavigationContainer>
    );
};

export default App;
