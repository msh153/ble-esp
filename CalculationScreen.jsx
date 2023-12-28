import React, { useContext, useState } from 'react';
import { Text, ScrollView, SafeAreaView, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { DataContext } from './AnalyzeScreen';

export default function CalculationScreen() {
  const [contentOffset, setContentOffset] = useState(0);
  const [result, setResult] = useState(null);
  const {setData} = useContext(DataContext);

  async function pickTxtFile() {
    try {

      const chosenFile = await DocumentPicker.pickSingle({
        type: ['text/plain'],
      });
      console.log(
        'Selected file:',
        chosenFile.size
      );
      const fileContent = await RNFS.readFile(chosenFile.uri, 'utf8');
      const parsed = fileContent.split(',').map(x => parseInt(x));
      console.log('parsed ' + parsed[20]);
      setData(parsed);
      setResult(parsed);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Error!
      }
    }
  }

  return (
    <SafeAreaView >
      <Button title={'Read the file'} onPress={pickTxtFile}/>
      <ScrollView
        contentOffset={{x: 0, y: contentOffset}}
        onContentSizeChange={(_, height) => {
          setContentOffset(height);
        }}
        >
          <Text>{'    Дані:'}</Text>
          {
          result != null ? (<Text>{'    ' + result}</Text>)
           : (<Text>No available</Text>)
          }
        </ScrollView>
    </SafeAreaView>
  );

}
