import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
// import RNShake from 'react-native-shake';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
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
});

export default function Main() {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const route = useRoute();

  const navigation = useNavigation();

  const routeParams = route.params;

  function toggleModal() {
    setModalVisible(!isModalVisible);
  };

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(true);
    }, 5000);
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
  }, [])

  // useEffect(() => {
  //   RNShake.addEventListener('ShakeEvent', () => {
  //     navigation.navigate('Config');
  //   });

  //   return () => {
  //     RNShake.removeEventListener('ShakeEvent');
  //   }
  // }, [])

  return (
    <Background>
      <Spinner
        visible={loading}
        textContent={'Carregando...'}
        textStyle={{ color: '#FFF' }}
      />

      <WebView source={{ uri: routeParams.url }} />

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
