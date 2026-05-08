// components/FormTransacao.js
import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Menu,
} from 'react-native-paper';
import { cores, espacamento, raio } from '../theme';

const CATEGORIAS = [
  { label: 'Alimentação', value: 'alimentacao' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Moradia', value: 'moradia' },
  { label: 'Salário', value: 'salario' },
  { label: 'Lazer', value: 'lazer' },
  { label: 'Educação', value: 'educacao' },
  { label: 'Outros', value: 'outros' },
];

export function FormTransacao({ visible, onDismiss, onAdicionar }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [categoria, setCategoria] = useState('outros');
  const [menuAberto, setMenuAberto] = useState(false);

  function handleAdicionar() {
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (!descricao.trim() || isNaN(valorNum) || valorNum <= 0) return;

    const hoje = new Date();
    const data = hoje.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    onAdicionar({
      id: Date.now().toString(),
      descricao: descricao.trim(),
      valor: valorNum,
      tipo,
      categoria,
      data,
    });

    // Limpa o formulário
    setDescricao('');
    setValor('');
    setTipo('despesa');
    setCategoria('outros');
    onDismiss();
  }

  const labelCategoria =
    CATEGORIAS.find(c => c.value === categoria)?.label ?? 'Outros';

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>Nova Transação</Text>

          {/* Tipo: Receita ou Despesa */}
          <SegmentedButtons
            value={tipo}
            onValueChange={setTipo}
            buttons={[
              { value: 'receita', label: 'Receita' },
              { value: 'despesa', label: 'Despesa' },
            ]}
            style={styles.segmento}
          />

          {/* Descrição */}
          <TextInput
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            mode="outlined"
            style={styles.input}
            textColor={cores.texto}
            maxLength={60}
          />

          {/* Valor */}
          <TextInput
            label="Valor (R$)"
            value={valor}
            onChangeText={setValor}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
            textColor={cores.texto}
          />

          {/* Categoria — menu dropdown */}
          <Menu
            visible={menuAberto}
            onDismiss={() => setMenuAberto(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuAberto(true)}
                style={styles.botaoCategoria}
                contentStyle={styles.botaoCategoriaContent}
                icon="chevron-down"
              >
                Categoria: {labelCategoria}
              </Button>
            }
          >
            {CATEGORIAS.map(cat => (
              <Menu.Item
                key={cat.value}
                onPress={() => {
                  setCategoria(cat.value);
                  setMenuAberto(false);
                }}
                title={cat.label}
              />
            ))}
          </Menu>

          {/* Ações */}
          <View style={styles.acoes}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.botaoCancelar}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleAdicionar}
              style={styles.botaoAdicionar}
              buttonColor={tipo === 'receita' ? cores.receita : cores.despesa}
            >
              Adicionar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: cores.cartao,
    marginHorizontal: espacamento.lg,
    borderRadius: raio.lg,
    padding: espacamento.lg,
    maxHeight: '85%',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: espacamento.md,
    textAlign: 'center',
  },
  segmento: {
    marginBottom: espacamento.md,
  },
  input: {
    marginBottom: espacamento.md,
    backgroundColor: cores.cartao,
  },
  botaoCategoria: {
    marginBottom: espacamento.md,
    borderColor: '#ccc',
  },
  botaoCategoriaContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  acoes: {
    flexDirection: 'row',
    gap: espacamento.sm,
    marginTop: espacamento.sm,
  },
  botaoCancelar: {
    flex: 1,
  },
  botaoAdicionar: {
    flex: 1,
  },
});
