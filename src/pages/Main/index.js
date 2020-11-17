import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import Background from './../../components/Background';
import logo from './../../assets/icon.png';

import { Container } from './styles';

export default function Main() {
  const [url, setUrl] = useState('');

  const navigation = useNavigation();

  async function init() {
    try {
      const getUrl = await AsyncStorage.getItem('@storage_url');

      setUrl(getUrl);

      if (!getUrl) {
        return navigation.navigate('Config');
      }

      navigation.navigate('Home', {
        url: getUrl,
      });
    } catch (error) {
      navigation.navigate('Config');
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Background>
      <Container>
        <Image style={{ width: 110, height: 110 }} source={logo} />
      </Container>
    </Background>
    // <Image style={{ width: 110, height: 110 }} source={logo} />
  );
}
