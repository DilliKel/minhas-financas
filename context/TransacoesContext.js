// context/TransacoesContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import {
  inicializarBanco,
  buscarTodasTransacoes,
  inserirTransacao,
  excluirTransacao,
} from '../database/db';

const TransacoesContext = createContext(null);

export function TransacoesProvider({ children }) {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await inicializarBanco();
        await carregarTransacoes();
      } catch (e) {
        setErro('Falha ao inicializar o banco de dados.');
        setCarregando(false);
      }
    })();
  }, []);

  async function carregarTransacoes() {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await buscarTodasTransacoes();
      setTransacoes(dados);
    } catch (e) {
      console.error('Erro ao carregar transações:', e);
      setErro('Não foi possível carregar as transações.');
    } finally {
      setCarregando(false);
    }
  }

  async function adicionarTransacao(novaTransacao) {
    try {
      await inserirTransacao(novaTransacao);
      setTransacoes(prev => [novaTransacao, ...prev]);
    } catch (e) {
      console.error('Erro ao adicionar transação:', e);
      Alert.alert('Erro', 'Não foi possível salvar a transação. Tente novamente.');
      throw e;
    }
  }

  async function removerTransacao(id) {
    try {
      await excluirTransacao(id);
      setTransacoes(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error('Erro ao remover transação:', e);
      Alert.alert('Erro', 'Não foi possível excluir a transação. Tente novamente.');
      throw e;
    }
  }

  const receitas = useMemo(
    () => transacoes.filter(t => t.tipo === 'receita').reduce((soma, t) => soma + t.valor, 0),
    [transacoes]
  );

  const despesas = useMemo(
    () => transacoes.filter(t => t.tipo === 'despesa').reduce((soma, t) => soma + t.valor, 0),
    [transacoes]
  );

  const saldo = useMemo(() => receitas - despesas, [receitas, despesas]);

  const valor = useMemo(() => ({
    transacoes,
    carregando,
    erro,
    receitas,
    despesas,
    saldo,
    adicionarTransacao,
    removerTransacao,
  }), [transacoes, carregando, erro, receitas, despesas, saldo]);

  return (
    <TransacoesContext.Provider value={valor}>
      {children}
    </TransacoesContext.Provider>
  );
}

export function useTransacoes() {
  const contexto = useContext(TransacoesContext);
  if (!contexto) {
    throw new Error('useTransacoes precisa estar dentro de <TransacoesProvider>');
  }
  return contexto;
}
