import React, { useState, useEffect, useRef, createContext } from 'react';
import { ESPEcg } from './src/ESPEcgTag';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, Text, TextInput, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

const Tab = createBottomTabNavigator();
export const DataContext = createContext();

import GraphicScreen from './GraphicScreen';
import CalculationScreen from './CalculationScreen';

export default function AnalyzeScreen() {
  const [data, setData] = useState([0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('20');
  const inputRef = useRef(null);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    if (modalVisible) {
      inputRef.current.focus();
    }
  }, [modalVisible]);

  const handleOutsidePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    console.log(locationX + ' ' + locationY);

    const modalView = inputRef?.current?.view;
    alert(modalView);
    if (modalView) {
      const isInsideModal = locationX >= modalView.x && locationX <= modalView.x + modalView.width &&
        locationY >= modalView.y && locationY <= modalView.y + modalView.height;

      if (!isInsideModal) {
        toggleModal();
      }
    }
  };

  return (
    <DataContext.Provider value={{ data, setData }}>
      <NavigationContainer independent={true}>
        <Header toggleModal={toggleModal} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Graphic') {
                iconName = 'heart-pulse';
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              } else if (route.name === 'Terminal') {
                iconName = 'code-greater-than';
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: '#2296f3',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false,
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="Calculation"
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons size={size} color={color} name="code-equal" />
              ),
            }}
          >
            {() => <CalculationScreen setData={setData} />}
          </Tab.Screen>
          <Tab.Screen
            name="GraphicSaved"
            options={{
              drawerIcon: ({ color, size }) => (
                <MaterialCommunityIcons size={size} color={color} name="heart-pulse" />
              ),
            }}>
              {() => <GraphicScreen data={data} contentOffsetProp={inputValue} />}
          </Tab.Screen>
        </Tab.Navigator>
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <Modal animationType="slide" transparent={true} visible={modalVisible}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={toggleModal}
                style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute' }}
              />
              <View style={{ backgroundColor: '#2296f3', borderRadius: 10, padding: 20, width: '80%' }}>
                <TextInput
                  ref={inputRef}
                  inputMode={'numeric'}
                  value={inputValue}
                  onChangeText={(text) => setInputValue(text)}
                  onSubmitEditing={toggleModal}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    height: 40,
                    marginVertical: 12,
                    borderWidth: 1,
                  }}
                />
                <TouchableOpacity onPress={toggleModal} style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold'}}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      </TouchableWithoutFeedback>
      </NavigationContainer>
    </DataContext.Provider>
  );
}

function Header({ toggleModal }) {
  return (
    <View style={{ flex: 0.1,  flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Pressable onPress={toggleModal} style={{ padding: 10, borderRadius: 5, backgroundColor: '#2296f3' }}>
      <Text style={{ color: 'white', fontWeight: 'bold'}}><MaterialCommunityIcons color="white" name="dots-vertical" size={20} />
        Set graphic offset</Text>
      </Pressable>
    </View>
  );
}
