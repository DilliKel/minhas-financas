// screens/DashboardScreen.js
import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CartaoSaldo } from '../components/CartaoSaldo';
import { CardsResumo } from '../components/CardsResumo';
import { CartaoCotacoes } from '../components/CartaoCotacoes';
import { ItemTransacao } from '../components/ItemTransacao';
import { SeletorMes } from '../components/SeletorMes';
import { useTransacoes } from '../context/TransacoesContext';
import { useFiltroMes } from '../hooks/useFiltroMes';
import { cores, espacamento } from '../theme';

export function DashboardScreen({ navigation }) {
  const { transacoes, carregando, removerTransacao } = useTransacoes();
  const { labelMes, mesAnterior, mesProximo, transacoesFiltradas, receitas, despesas, saldo } =
    useFiltroMes(transacoes);

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, [])
  );

  const confirmarExclusao = useCallback((id, descricao) => {
    Alert.alert(
      'Excluir transação',
      `Deseja excluir "${descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removerTransacao(id) },
      ]
    );
  }, [removerTransacao]);

  const irParaDetalhe = useCallback((transacao) => {
    navigation.navigate('DetalheTransacao', { transacao });
  }, [navigation]);

  const renderItem = useCallback(({ item: t }) => (
    <ItemTransacao
      descricao={t.descricao}
      valor={t.valor}
      tipo={t.tipo}
      categoria={t.categoria}
      data={t.data}
      onPress={() => irParaDetalhe(t)}
      onLongPress={() => confirmarExclusao(t.id, t.descricao)}
    />
  ), [irParaDetalhe, confirmarExclusao]);

  const cabecalho = (
    <>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Minhas Finanças</Text>
      </View>

      <SeletorMes
        label={labelMes}
        onAnterior={mesAnterior}
        onProximo={mesProximo}
      />

      <CartaoSaldo saldo={saldo} mes={labelMes} />
      <CardsResumo receitas={receitas} despesas={despesas} />
      <CartaoCotacoes />

      <View style={styles.secaoTitulo}>
        <Text style={styles.tituloSecao}>Transações do mês</Text>
      </View>
    </>
  );

  const estadoVazio = (
    <View style={styles.vazio}>
      <Ionicons name="wallet-outline" size={64} color={cores.subtexto} />
      <Text style={styles.textoVazio}>Nenhuma transação neste mês</Text>
      <Text style={styles.subtextoVazio}>
        Toque em "Nova Transação" para começar
      </Text>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.centralizador}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoCarregando}>Carregando suas finanças...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        style={styles.lista}
        data={transacoesFiltradas}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={estadoVazio}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.primaria },
  lista: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingBottom: espacamento.xl },
  centralizador: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo,
  },
  textoCarregando: { marginTop: 12, color: cores.subtexto, fontSize: 14 },
  cabecalho: {
    backgroundColor: cores.primaria,
    paddingHorizontal: espacamento.md,
    paddingTop: espacamento.lg,
    paddingBottom: espacamento.md,
  },
  titulo: { color: cores.cartao, fontSize: 22, fontWeight: 'bold' },
  secaoTitulo: { paddingHorizontal: espacamento.md, paddingTop: espacamento.md },
  tituloSecao: { fontSize: 17, fontWeight: '700', color: cores.texto, marginBottom: espacamento.sm },
  vazio: { alignItems: 'center', paddingVertical: 48, gap: 8, paddingHorizontal: espacamento.md },
  textoVazio: { fontSize: 17, fontWeight: '600', color: cores.subtexto },
  subtextoVazio: { fontSize: 13, color: cores.subtexto, textAlign: 'center' },
});
