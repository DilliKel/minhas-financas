// hooks/useFiltroMes.js
import { useState, useMemo } from 'react';

function parsearData(dataStr) {
  // Formato esperado: "DD/MM/YYYY"
  const partes = dataStr?.split('/');
  if (!partes || partes.length !== 3) return null;
  return { mes: parseInt(partes[1], 10) - 1, ano: parseInt(partes[2], 10) };
}

export function useFiltroMes(transacoes) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  function mesAnterior() {
    if (mes === 0) { setMes(11); setAno(a => a - 1); }
    else setMes(m => m - 1);
  }

  function mesProximo() {
    if (mes === 11) { setMes(0); setAno(a => a + 1); }
    else setMes(m => m + 1);
  }

  const transacoesFiltradas = useMemo(() =>
    transacoes.filter(t => {
      const d = parsearData(t.data);
      return d !== null && d.mes === mes && d.ano === ano;
    }),
    [transacoes, mes, ano]
  );

  const receitas = useMemo(
    () => transacoesFiltradas.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0),
    [transacoesFiltradas]
  );

  const despesas = useMemo(
    () => transacoesFiltradas.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0),
    [transacoesFiltradas]
  );

  const saldo = useMemo(() => receitas - despesas, [receitas, despesas]);

  const labelMes = useMemo(
    () => new Date(ano, mes).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    [mes, ano]
  );

  return { mes, ano, labelMes, mesAnterior, mesProximo, transacoesFiltradas, receitas, despesas, saldo };
}
