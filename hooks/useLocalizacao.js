// hooks/useLocalizacao.js
import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export function useLocalizacao() {
  const [obtendo, setObtendo] = useState(false);

  async function obterLocalizacao() {
    setObtendo(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à localização nas configurações do dispositivo para usar esta função.'
        );
        return null;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      };
    } catch (erro) {
      console.error('Erro ao obter localização:', erro);
      Alert.alert('Erro', 'Não foi possível obter a localização. Tente novamente.');
      return null;
    } finally {
      setObtendo(false);
    }
  }

  return { obterLocalizacao, obtendo };
}
