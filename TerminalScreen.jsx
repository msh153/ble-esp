import React, { useState } from 'react';
import { Text, ScrollView, SafeAreaView, Button } from 'react-native';
import RNFS from 'react-native-fs';

export default function TerminalScreen({data}) {
  const [contentOffset, setContentOffset] = useState(0);

  return (
    <SafeAreaView >
      <Button title={'Write to the file'} onPress={() =>  RNFS.write(RNFS.ExternalStorageDirectoryPath + '/data.txt', data.toString())}/>
      <ScrollView
        contentOffset={{x: 0, y: contentOffset}}
        onContentSizeChange={(_, height) => {
          setContentOffset(height);
        }}
        >
          <Text>{'    Дані:'}</Text>
          {!!data && data.map((value, index) => (
            <Text key={index}>{'    ' + value}</Text>
          ))}
        </ScrollView>
    </SafeAreaView>
  );

}
