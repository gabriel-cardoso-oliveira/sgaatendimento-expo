import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Vibration,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import * as Speech from 'expo-speech';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { ShakeEventExpo } from './../../utils/ShakeEventExpo';
import Background from './../../components/Background';
import logo from './../../assets/shake.png';

const styles = StyleSheet.create({
  modalTitle: {
    marginBottom: 4,
    fontSize: 30,
    textAlign: 'center',
    color: '#3b9eff'
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 6,
  },
  centeredView: {
    flex: 1,
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  opacityLink: {
    marginTop: 16,
  },
  opacityLinkText: {
    color: '#8985F2',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 16,
  },
  warningText: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff'
  },
});

export default function Main() {
  const anim = useRef(new Animated.Value(0));

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [countVibration, setCountVibration] = useState(0);

  const route = useRoute();

  const navigation = useNavigation();

  const routeParams = route.params;

  BackgroundFetch.setMinimumIntervalAsync(1);

  const taskName = 'background-alert';

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const startLoading = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setModalVisible(true);
    }, 4500);
  };

  useEffect(() => {
    startLoading();
  }, [routeParams]);

  useEffect(() => {
    ShakeEventExpo.addListener(() => {
      navigation.navigate('Config');
    });

    return () => {
      ShakeEventExpo.removeListener();
    }
  }, []);

  const registerTaskAsync = async () => {
    await BackgroundFetch.registerTaskAsync(taskName);
  };

  useEffect(() => {
    registerTaskAsync();
  }, []);

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          toValue: -4,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim.current, {
          toValue: 4,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim.current, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    ).start();
  }, []);

  function enableAudibleAlert() {
    if (routeParams.warningSound === 'Ativado') {
      const thingToSay = 'Atenção. Nova senha!';
      return Speech.speak(thingToSay);
    }

    return;
  }

  const vibrate = () => {
    if (countVibration === 1) {
      enableAudibleAlert();
      return Vibration.vibrate();
    }

    if (countVibration === Number(routeParams.seconds)) {
      setCountVibration(2);
      enableAudibleAlert();
      return Vibration.vibrate();
    }
  };

  const onResultWebView = event => {
    if (event.nativeEvent.title === 'SGA *') {
      setIsWarning(true);
      shake();
      setCountVibration(countVibration + 1);
      return vibrate();
    }

    setCountVibration(0);
    setIsWarning(false);
  };

  const INJECTED_JAVASCRIPT = `(function() {
    document.body.style.zoom = "${routeParams.zoom}%";

    setInterval(function() {
      window.ReactNativeWebView.postMessage(JSON.stringify(document.title));
    }, 1000);
  })();`;

  TaskManager.defineTask(taskName, ({ data, error }) => {
    if (error) {
      return;
    }

    if (data) {
      const onResultWebView = event => {
        if (event.nativeEvent.title === 'SGA *') {
          setIsWarning(true);
          shake();
          setCountVibration(countVibration + 1);
          return vibrate();
        }
    
        setCountVibration(0);
        setIsWarning(false);
      };
    }
  });

  return (
    <Background>
      <StatusBar hidden={true} />

      <Spinner
        visible={loading}
        textContent={'Carregando...'}
        textStyle={{ color: '#FFF' }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={Platform.OS === 'ios'}
        behavior="padding"
      >
        <WebView
          source={{ uri: routeParams.url }}
          onMessage={onResultWebView}
          injectedJavaScript={INJECTED_JAVASCRIPT}
        />
      </KeyboardAvoidingView>

      <Animated.View style={{ transform: [{ translateX: anim.current }] }}>
        { isWarning ? (
            <Text style={styles.warningText}>NOVA SENHA</Text>
          ) : null
        }
      </Animated.View>

      <Modal
        isVisible={isModalVisible}
        swipeDirection="down"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Dica!</Text>

            <Image style={{ width: 110, height: 110 }} source={logo} />

            <Text style={styles.modalText}>
              Para configurar uma nova URL, chacoalhe o dispositivo.
            </Text>

            <TouchableOpacity style={styles.opacityLink} onPress={toggleModal}>
              <Text style={styles.opacityLinkText}>OK!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Background>
  );
}