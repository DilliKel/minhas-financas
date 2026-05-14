// components/ItemTransacao.js
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento, raio } from '../theme';

const ICONES = {
  alimentacao: 'restaurant',
  transporte: 'car',
  saude: 'medical',
  lazer: 'game-controller',
  salario: 'cash',
  moradia: 'home',
  educacao: 'school',
  outros: 'ellipsis-horizontal-circle',
};

export const ItemTransacao = memo(function ItemTransacao({
  descricao, valor, categoria, tipo, data, onPress, onLongPress,
}) {
  const isReceita = tipo === 'receita';
  const nomeIcone = ICONES[categoria] ?? 'ellipsis-horizontal-circle';
  const valorFormatado = `${isReceita ? '+' : '-'} R$ ${valor.toFixed(2)}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityLabel={`${descricao}, ${valorFormatado}, ${data}`}
      accessibilityRole="button"
      accessibilityHint="Toque para ver detalhes. Toque longo para excluir."
    >
      <View style={[
        styles.iconeContainer,
        { backgroundColor: isReceita ? cores.receitaFundo : cores.despesaFundo }
      ]}>
        <Ionicons
          name={nomeIcone}
          size={22}
          color={isReceita ? cores.receita : cores.despesa}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.descricao} numberOfLines={1}>{descricao}</Text>
        <Text style={styles.data}>{data}</Text>
      </View>

      <Text style={[styles.valor, { color: isReceita ? cores.receita : cores.despesa }]}>
        {valorFormatado}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: raio.md,
    padding: espacamento.md,
    marginBottom: espacamento.sm,
    marginHorizontal: espacamento.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espacamento.md,
  },
  info: { flex: 1 },
  descricao: { fontSize: 15, fontWeight: '600', color: cores.texto },
  data: { fontSize: 12, color: cores.subtexto, marginTop: 2 },
  valor: { fontSize: 15, fontWeight: '700', marginLeft: espacamento.sm },
});
