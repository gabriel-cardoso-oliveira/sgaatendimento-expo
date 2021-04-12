import React, { useState, useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import Background from './../../components/Background';
import logo from './../../assets/icon.png';

import { Container } from './styles';

export default function Main() {
  const [url, setUrl] = useState('');
  const [notice, setNotice] = useState('');

  const navigation = useNavigation();

  async function init() {
    try {
      const getUrl = await AsyncStorage.getItem('@storage_url');
      const getNotice = await AsyncStorage.getItem('@storage_notice');

      setUrl(getUrl);
      setNotice(getNotice);

      if (!getUrl || !getNotice) {
        return navigation.reset({
          index: 0,
          routes: [{ name: 'Config' }],
        });
      }

      navigation.reset({
        index: 0,
        routes: [{
          name: 'Home',
          params: {
            url: getUrl,
            seconds: getNotice,
          },
        }],
      });
    } catch (error) {
      return navigation.reset({
        index: 0,
        routes: [{ name: 'Config' }],
      });
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Background>
      <StatusBar hidden={true} />

      <Container>
        <Image style={{ width: 110, height: 110 }} source={logo} />
      </Container>
    </Background>
  );
}
