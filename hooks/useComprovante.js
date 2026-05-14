// hooks/useComprovante.js
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DIR_COMPROVANTES = `${FileSystem.documentDirectory}comprovantes/`;

async function persistirImagem(uri) {
  await FileSystem.makeDirectoryAsync(DIR_COMPROVANTES, { intermediates: true });
  const nome = uri.split('/').pop();
  const destino = `${DIR_COMPROVANTES}${nome}`;
  await FileSystem.copyAsync({ from: uri, to: destino });
  return destino;
}

export function useComprovante() {
  const [obtendo, setObtendo] = useState(false);

  async function tirarFoto() {
    setObtendo(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à câmera nas configurações do dispositivo para tirar fotos.'
        );
        return null;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (resultado.canceled) return null;
      return await persistirImagem(resultado.assets[0].uri);
    } catch (erro) {
      console.error('Erro ao tirar foto:', erro);
      return null;
    } finally {
      setObtendo(false);
    }
  }

  async function escolherDaGaleria() {
    setObtendo(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria nas configurações do dispositivo para selecionar fotos.'
        );
        return null;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        quality: 0.5,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (resultado.canceled) return null;
      return await persistirImagem(resultado.assets[0].uri);
    } catch (erro) {
      console.error('Erro ao escolher imagem:', erro);
      return null;
    } finally {
      setObtendo(false);
    }
  }

  return { tirarFoto, escolherDaGaleria, obtendo };
}
