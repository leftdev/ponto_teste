import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, } from 'react-native';
import React, { useState, useEffect } from 'react';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import * as Location from 'expo-location';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ModalScreen() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    var latitude = location['coords']['latitude'];
    var longitude = location['coords']['longitude'];
  }

  const [chave, setChave] = useState();
  const Armazenar = (chave, valor) => {
    AsyncStorage.setItem(chave, valor)
  }
  const Buscar = async (chave) => {
    const valor = await AsyncStorage.getItem(chave)
    setChave(valor)
  }
  //AsyncStorage.clear()
  AsyncStorage.getItem('uuid').then((result) => {
    if (result === null) {
      Armazenar('uuid', new Date().getTime() + Math.random().toString(20))
      console.log('resultado: ' + result)
    } else {
      setChave(result)
    }
  }).catch((error) => {
    console.log(error)
  });

  function ponto() {
    //const url = 'https://pontoeletronico.gestormunicipal.com.br/api/device/create';
    const url = 'http://127.0.0.1:8000/api/device/create'
    const createDevice = () => {
      if (chave != null) {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uuid: chave,
            identificador: '9889',
            setor_hash: 'aqHEZFr9MPQjviEi12Ov'
          })
        })
          .then((response) => {
            try {
              let resposta = response.json();
              return resposta
            } catch (error) {
              console.log(error)
            }
          })
          .then((device) => {
            console.log(device['message'])
          });
      }
    }
  }

  const [identificador, setIdentificador] = useState()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/ModalScreen.tsx" />
      <Text>Chave: {chave} </Text>
      <Text>Local: {longitude}</Text>
      <form>
        <label>Identificador</label>
        <input type="number" required></input>
        <input type="submit" value="Enviar" />
      </form>
      <Text>{ponto()}</Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
