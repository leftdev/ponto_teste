import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeviceSreen({ navigation }: RootTabScreenProps<'Device'>) {

  /**
 * Cria UUID do dispositivo
 */
  const [chave, setChave] = useState(null);
  AsyncStorage.getItem('uuid').then((result) => {
    if (result === null) {
      AsyncStorage.setItem('uuid', new Date().getTime() + Math.random().toString(20))
    } else {
      setChave(result)
    }
  }).catch((error) => {
    console.log(error)
  });

  /** CONSULTA DISPOSITIVO */
  const url_consulta = 'http://127.0.0.1:8000/api/device/check/' + chave;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getDevice = async () => {
    try {
      const response = await fetch(url_consulta);
      const json = await response.json();
      setData(json.device);
      console.log('Aqui ' + url_consulta)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDevice();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>{chave}</Text>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.device.status}</Text>

          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({})