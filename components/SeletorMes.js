// components/SeletorMes.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento, raio } from '../theme';

export function SeletorMes({ label, onAnterior, onProximo }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onAnterior}
        style={styles.botao}
        accessibilityLabel="Mês anterior"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-back" size={20} color={cores.primaria} />
      </TouchableOpacity>

      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={onProximo}
        style={styles.botao}
        accessibilityLabel="Próximo mês"
        accessibilityRole="button"
      >
        <Ionicons name="chevron-forward" size={20} color={cores.primaria} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.cartao,
    borderRadius: raio.md,
    marginHorizontal: espacamento.md,
    marginBottom: espacamento.md,
    paddingVertical: espacamento.sm,
    paddingHorizontal: espacamento.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  botao: {
    padding: espacamento.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.texto,
    textTransform: 'capitalize',
  },
});
