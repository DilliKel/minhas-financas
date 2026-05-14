// components/ErrorBoundary.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, espacamento, raio } from '../theme';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { temErro: false, mensagem: '' };
  }

  static getDerivedStateFromError(erro) {
    return { temErro: true, mensagem: erro?.message ?? 'Erro desconhecido' };
  }

  componentDidCatch(erro, info) {
    console.error('ErrorBoundary capturou:', erro, info.componentStack);
  }

  reiniciar() {
    this.setState({ temErro: false, mensagem: '' });
  }

  render() {
    if (this.state.temErro) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.titulo}>Algo deu errado</Text>
          <Text style={styles.mensagem}>{this.state.mensagem}</Text>
          <TouchableOpacity style={styles.botao} onPress={() => this.reiniciar()}>
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espacamento.lg,
    backgroundColor: cores.fundo,
  },
  emoji: { fontSize: 48, marginBottom: espacamento.md },
  titulo: {
    fontSize: 20, fontWeight: 'bold', color: cores.texto, marginBottom: espacamento.sm,
  },
  mensagem: {
    fontSize: 14, color: cores.subtexto, textAlign: 'center',
    marginBottom: espacamento.lg, lineHeight: 20,
  },
  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: raio.pill,
  },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
