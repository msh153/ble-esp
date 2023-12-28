/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles/styles';

export const DeviceList = ({ peripheral, connect, disconnect }) => {
  const { name, rssi } = peripheral;

  return (
    <>
      {name && (
        <View style={styles.deviceContainer}>
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{name}</Text>
            <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
          </View>

          <TouchableOpacity
            onPress={() => connect(peripheral)}
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                { fontWeight: 'bold', fontSize: 16 },
              ]}>
              {'Connect'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => disconnect(peripheral)}
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                { fontWeight: 'bold', fontSize: 16 },
              ]}>
              {'Disconnect'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
