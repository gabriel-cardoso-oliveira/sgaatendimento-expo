import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
// import RNShake from 'react-native-shake';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { ShakeEventExpo } from './../../utils/ShakeEventExpo';
import Background from './../../components/Background';

// import { Container } from './styles';

export default function Main() {
  const [loading, setLoading] = useState(false);

  const route = useRoute();

  const navigation = useNavigation();

  const routeParams = route.params;

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
    </Background>
  );
}
