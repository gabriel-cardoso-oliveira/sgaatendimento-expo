import React, { useState, useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-picker/picker';
import {
  Container,
  Form,
  FormInput,
  SubmitButton,
} from './styles';
import Background from './../../components/Background';
import logo from './../../assets/icon.png';

const styles = StyleSheet.create({
  input: {
    height: 46,
    fontSize: 15,
    marginLeft: 10,
    color: '#fff',
  },
  borderPicker: {
    height: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 10,
    borderRadius: 4,
    overflow: 'hidden'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    marginTop: 4,
  },
});

export default function Config() {
  const [url, setUrl] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(30);

  const navigation = useNavigation();

  function handleSelectedNotice(itemValue) {
    setSelectedNotice(itemValue);
  }

  async function handleSubmit() {
    try {
      await AsyncStorage.setItem('@storage_url', url);

      await AsyncStorage.setItem('@storage_notice', String(selectedNotice));

      navigation.reset({
        index: 0,
        routes: [{
          name: 'Home',
          params: {
            url,
            seconds: selectedNotice,
          },
        }],
      });
    } catch (error) {

    }
  }

  async function getNotice() {
    const seconds = await AsyncStorage.getItem('@storage_notice');

    if (!seconds) {
      return setSelectedNotice(30);
    }

    return setSelectedNotice(Number(seconds));
  }

  async function getUrl() {
    setUrl(await AsyncStorage.getItem('@storage_url'));

    return getNotice();
  }

  useEffect(() => {
    getUrl();
  }, []);

  return (
    <Background>
      <StatusBar hidden={true} />

      <Container>
        <Image style={{ width: 110, height: 110 }} source={logo} />
          <Form>
            <Text style={styles.label}>URL SGA Atendimento</Text>
            <FormInput
              keyboardType="url"
              placeholder="URL SGA Atendimento"
              returnKeyType="send"
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
              value={url}
              onChangeText={setUrl}
            />

            <Text style={styles.label}>Aviso de nova senha por segundos</Text>
            <View style={styles.borderPicker}>
              <Picker
                selectedValue={selectedNotice}
                style={styles.input}
                onValueChange={handleSelectedNotice}
              >
                <Picker.Item key={5} label={'5'} value={5} />
                <Picker.Item key={10} label={'10'} value={10} />
                <Picker.Item key={15} label={'15'} value={15} />
                <Picker.Item key={20} label={'20'} value={20} />
                <Picker.Item key={25} label={'25'} value={25} />
                <Picker.Item key={30} label={'30'} value={30} />
              </Picker>
            </View>

            <SubmitButton onPress={handleSubmit}>
              Salvar
            </SubmitButton>
          </Form>
      </Container>
    </Background>
  );
}
