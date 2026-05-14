// screens/RelatorioScreen.js
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores, espacamento, raio } from '../theme';
import { useTransacoes } from '../context/TransacoesContext';
import { useFiltroMes } from '../hooks/useFiltroMes';
import { SeletorMes } from '../components/SeletorMes';

const ICONES_CATEGORIA = {
  alimentacao: 'restaurant',
  transporte: 'car',
  saude: 'medical',
  lazer: 'game-controller',
  moradia: 'home',
  salario: 'cash',
  educacao: 'school',
  outros: 'ellipsis-horizontal-circle',
};

const NOMES_CATEGORIA = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  saude: 'Saúde',
  lazer: 'Lazer',
  moradia: 'Moradia',
  salario: 'Salário',
  educacao: 'Educação',
  outros: 'Outros',
};

export function RelatorioScreen() {
  const { transacoes } = useTransacoes();
  const { labelMes, mesAnterior, mesProximo, transacoesFiltradas, receitas, despesas, saldo } =
    useFiltroMes(transacoes);

  const total = useMemo(() => receitas + despesas || 1, [receitas, despesas]);

  const porCategoria = useMemo(() => {
    const mapa = {};
    transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        mapa[t.categoria] = (mapa[t.categoria] ?? 0) + t.valor;
      });
    return Object.entries(mapa)
      .map(([cat, valor]) => ({ cat, valor }))
      .sort((a, b) => b.valor - a.valor);
  }, [transacoesFiltradas]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Relatório</Text>

        <SeletorMes
          label={labelMes}
          onAnterior={mesAnterior}
          onProximo={mesProximo}
        />

        {/* Barra receitas × despesas */}
        <View style={styles.card}>
          <View style={styles.barra}>
            <View style={[styles.segmento, {
              flex: receitas / total,
              backgroundColor: cores.receita,
            }]} />
            <View style={[styles.segmento, {
              flex: despesas / total,
              backgroundColor: cores.despesa,
            }]} />
          </View>

          <View style={styles.legenda}>
            <View style={styles.itemLegenda}>
              <View style={[styles.ponto, { backgroundColor: cores.receita }]} />
              <Text style={styles.textoLegenda}>Receitas</Text>
              <Text style={styles.valorLegenda}>R$ {receitas.toFixed(2)}</Text>
            </View>
            <View style={styles.itemLegenda}>
              <View style={[styles.ponto, { backgroundColor: cores.despesa }]} />
              <Text style={styles.textoLegenda}>Despesas</Text>
              <Text style={styles.valorLegenda}>R$ {despesas.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.saldoContainer}>
            <Text style={styles.saldoLabel}>Saldo do mês</Text>
            <Text style={[styles.saldoValor, { color: saldo >= 0 ? cores.receita : cores.despesa }]}>
              {saldo >= 0 ? '+' : '-'} R$ {Math.abs(saldo).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Breakdown por categoria */}
        {porCategoria.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.tituloSecao}>Despesas por categoria</Text>
            {porCategoria.map(({ cat, valor }) => {
              const percentual = despesas > 0 ? (valor / despesas) * 100 : 0;
              return (
                <View key={cat} style={styles.itemCategoria}>
                  <View style={styles.categoriaInfo}>
                    <View style={[styles.iconeCategoria, { backgroundColor: cores.despesaFundo }]}>
                      <Ionicons
                        name={ICONES_CATEGORIA[cat] ?? 'ellipsis-horizontal-circle'}
                        size={16}
                        color={cores.despesa}
                      />
                    </View>
                    <Text style={styles.nomeCategoria}>
                      {NOMES_CATEGORIA[cat] ?? cat}
                    </Text>
                  </View>
                  <View style={styles.categoriaValores}>
                    <Text style={styles.valorCategoria}>R$ {valor.toFixed(2)}</Text>
                    <Text style={styles.percentualCategoria}>{percentual.toFixed(0)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {transacoesFiltradas.length === 0 && (
          <View style={styles.vazio}>
            <Ionicons name="bar-chart-outline" size={56} color={cores.subtexto} />
            <Text style={styles.textoVazio}>Sem transações neste mês</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.fundo },
  titulo: {
    fontSize: 22, fontWeight: 'bold', color: cores.texto,
    paddingHorizontal: espacamento.md,
    paddingTop: espacamento.lg,
    paddingBottom: espacamento.md,
  },
  card: {
    backgroundColor: cores.cartao,
    borderRadius: raio.md,
    marginHorizontal: espacamento.md,
    marginBottom: espacamento.md,
    padding: espacamento.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  barra: {
    flexDirection: 'row', height: 24, borderRadius: raio.pill,
    overflow: 'hidden', marginBottom: espacamento.md,
  },
  segmento: { height: '100%' },
  legenda: { gap: 10, marginBottom: espacamento.md },
  itemLegenda: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ponto: { width: 12, height: 12, borderRadius: 6 },
  textoLegenda: { flex: 1, fontSize: 15, color: cores.texto },
  valorLegenda: { fontSize: 15, fontWeight: '700', color: cores.texto },
  saldoContainer: {
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    paddingTop: espacamento.md, alignItems: 'center',
  },
  saldoLabel: { fontSize: 13, color: cores.subtexto },
  saldoValor: { fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  tituloSecao: {
    fontSize: 15, fontWeight: '700', color: cores.texto, marginBottom: espacamento.md,
  },
  itemCategoria: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  categoriaInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconeCategoria: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  nomeCategoria: { fontSize: 14, color: cores.texto },
  categoriaValores: { alignItems: 'flex-end' },
  valorCategoria: { fontSize: 14, fontWeight: '700', color: cores.texto },
  percentualCategoria: { fontSize: 12, color: cores.subtexto },
  vazio: {
    alignItems: 'center', paddingVertical: 48, gap: 8,
  },
  textoVazio: { fontSize: 16, color: cores.subtexto },
});
