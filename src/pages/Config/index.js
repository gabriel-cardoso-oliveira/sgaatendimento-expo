import React, { useState, useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Platform,
  Alert,
  ScrollView,
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
  viewScrool: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
  },
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
  inputIos: {
    height: 92,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    marginBottom: 10,
    borderRadius: 4,
  },
  inputIosItems: {
    height: 92,
    color: '#fff',
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
  const [selectedZoom, setSelectedZoom] = useState(100);

  const navigation = useNavigation();

  const noticeValues = [5, 10, 15, 20, 25, 30];

  const zoomValues = [
    130,
    125,
    120,
    115,
    110,
    105,
    100,
    95,
    90,
    85,
    80,
    75,
    70
  ];

  function handleSelectedNotice(itemValue) {
    setSelectedNotice(itemValue);
  }

  function handleSelectedZoom(itemValue) {
    setSelectedZoom(itemValue);
  }

  function openAlert() {
    Alert.alert(
      "Atenção",
      "É necessário preencher o campo da URL.",
      [{
        text: "OK", onPress: () => {},
      }],
      { cancelable: false }
    );
  }

  async function handleSubmit() {
    if (!url) {
      return openAlert();
    }

    try {
      await AsyncStorage.setItem('@storage_url', url);

      await AsyncStorage.setItem('@storage_notice', String(selectedNotice));

      await AsyncStorage.setItem('@storage_zoom', String(selectedZoom));

      navigation.reset({
        index: 0,
        routes: [{
          name: 'Home',
          params: {
            url,
            seconds: selectedNotice,
            zoom: selectedZoom,
          },
        }],
      });
    } catch (error) {

    }
  }

  async function getZoom() {
    const zoom = await AsyncStorage.getItem('@storage_zoom');

    if (!zoom) {
      return setSelectedZoom(100);
    }

    return setSelectedZoom(Number(zoom));
  }

  async function getNotice() {
    const seconds = await AsyncStorage.getItem('@storage_notice');

    if (!seconds) {
      setSelectedNotice(30);

      return getZoom();
    }

    setSelectedNotice(Number(seconds));

    return getZoom();
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

      <View style={styles.viewScrool}>
        <ScrollView>
          <Container>
            <Image style={{ width: 118, height: 118 }} source={logo} />
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
              {
                Platform.OS === `ios` ? (
                  <Picker
                    selectedValue={selectedNotice}
                    style={styles.inputIos}
                    itemStyle={styles.inputIosItems}
                    onValueChange={handleSelectedNotice}
                  >
                    {
                      noticeValues.map(n => (
                        <Picker.Item key={n} label={`${n}`} value={n} />
                      ))
                    }
                  </Picker>
                ) : (
                  <View style={styles.borderPicker}>
                    <Picker
                      selectedValue={selectedNotice}
                      style={styles.input}
                      onValueChange={handleSelectedNotice}
                    >
                      {
                        noticeValues.map(n => (
                          <Picker.Item key={n} label={`${n}`} value={n} />
                        ))
                      }
                    </Picker>
                  </View>
                )
              }

              <Text style={styles.label}>Zoom da página</Text>
              {
                Platform.OS === `ios` ? (
                  <Picker
                    selectedValue={selectedZoom}
                    style={styles.inputIos}
                    itemStyle={styles.inputIosItems}
                    onValueChange={handleSelectedZoom}
                  >
                    {
                      zoomValues.map(zm => (
                        <Picker.Item key={zm} label={`${zm}%`} value={zm} />
                      ))
                    }
                  </Picker>
                ) : (
                  <View style={styles.borderPicker}>
                    <Picker
                      selectedValue={selectedZoom}
                      style={styles.input}
                      onValueChange={handleSelectedZoom}
                    >
                      {
                        zoomValues.map(zm => (
                          <Picker.Item key={zm} label={`${zm}%`} value={zm} />
                        ))
                      }
                    </Picker>
                  </View>
                )
              }

              <SubmitButton onPress={handleSubmit}>
                Salvar
              </SubmitButton>
            </Form>
          </Container>
        </ScrollView>
      </View>
    </Background>
  );
}