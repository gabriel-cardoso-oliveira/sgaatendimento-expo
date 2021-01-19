import React, { useState, useEffect } from 'react';
import { Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Container,
  Form,
  FormInput,
  SubmitButton,
} from './styles';
import Background from './../../components/Background';
import logo from './../../assets/icon.png';

export default function Config() {
  const [url, setUrl] = useState('');

  const navigation = useNavigation();

  async function handleSubmit() {
    try {
      await AsyncStorage.setItem('@storage_url', url);

      navigation.reset({
        index: 0,
        routes: [{
          name: 'Home',
          params: { url },
        }],
      });
    } catch (error) {

    }
  }

  async function getUrl() {
    setUrl(await AsyncStorage.getItem('@storage_url'));
  }

  useEffect(() => {
    getUrl();
  }, [])

  return (
    <Background>
      <StatusBar hidden={true} />

      <Container>
        <Image style={{ width: 110, height: 110 }} source={logo} />
        <Form>
          <FormInput
            keyboardType="url"
            placeholder="URL SGA Atendimento"
            returnKeyType="send"
            autoCapitalize="none"
            onSubmitEditing={handleSubmit}
            value={url}
            onChangeText={setUrl}
          />

          <SubmitButton onPress={handleSubmit}>
            Salvar
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
