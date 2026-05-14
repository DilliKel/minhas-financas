# Minhas Finanças 💰

Aplicativo de controle financeiro pessoal desenvolvido em React Native com Expo, criado durante o Módulo 06 do Curso de Desenvolvimento Full Stack do ITEAM / CCTI.

---

## Funcionalidades

- **Dashboard mensal** — visualize receitas, despesas e saldo do mês atual com navegação entre meses
- **Cadastro de transações** — registre entradas e saídas com descrição, valor, categoria, localização GPS e foto de comprovante
- **Detalhamento** — veja todos os dados de uma transação, incluindo mapa e imagem anexada
- **Relatórios** — análise visual de gastos por categoria com percentuais e totais mensais
- **Mapa de transações** — visualize no mapa onde cada transação foi registrada, com pinos coloridos por tipo
- **Cotações** — exibição automática do câmbio do Dólar e do Euro em tempo real
- **Tela de boas-vindas** — onboarding exibido apenas no primeiro acesso
- **Banco de dados local** — toda a persistência é feita via SQLite, sem necessidade de internet
- **Multiplataforma** — compatível com Android, iOS e Web

---

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navegação | React Navigation (Bottom Tabs + Native Stack) |
| Banco de dados | expo-sqlite |
| Armazenamento | @react-native-async-storage |
| Localização | expo-location |
| Câmera / Galeria | expo-image-picker + expo-file-system |
| Mapas (nativo) | react-native-maps |
| Mapas (web) | Leaflet + react-leaflet |
| UI | react-native-paper + @expo/vector-icons |
| Estado global | React Context API |

---

## Estrutura do projeto

```
minhas-financas/
├── assets/                  # Ícones e splash screens
├── components/              # Componentes reutilizáveis
│   ├── CartaoSaldo.js       # Card de saldo do mês
│   ├── CardsResumo.js       # Cards de receitas e despesas
│   ├── CartaoCotacoes.js    # Cotação de Dólar e Euro
│   ├── ItemTransacao.js     # Item da lista de transações
│   ├── SeletorMes.js        # Navegação entre meses
│   ├── SeletorLocalMapa.js  # Modal de seleção de localização
│   ├── MapaCompat.native.js # Mapa para Android/iOS
│   ├── MapaCompat.web.js    # Mapa para Web (Leaflet)
│   └── ErrorBoundary.js     # Captura de erros de renderização
├── context/
│   ├── TransacoesContext.js     # Estado global das transações
│   └── PrimeiroAcessoContext.js # Controle de onboarding
├── database/
│   └── db.js                # Esquema e operações SQLite
├── hooks/
│   ├── useFiltroMes.js      # Filtro de transações por mês
│   ├── useLocalizacao.js    # Acesso ao GPS
│   ├── useComprovante.js    # Câmera e galeria
│   └── useCotacoes.js       # Busca de câmbio na API
├── routes/
│   ├── TabRoutes.js         # Navegação por abas
│   └── DashboardStack.js    # Stack de navegação do Dashboard
├── screens/
│   ├── BoasVindasScreen.js      # Onboarding (primeiro acesso)
│   ├── DashboardScreen.js       # Tela principal
│   ├── NovaTransacaoScreen.js   # Cadastro de transação
│   ├── DetalheTransacaoScreen.js# Detalhes da transação
│   ├── RelatorioScreen.js       # Relatórios e gráficos
│   ├── MapaScreen.js            # Mapa de transações
│   └── SobreScreen.js           # Sobre o aplicativo
├── theme.js                 # Paleta de cores e espaçamentos
├── App.js                   # Componente raiz
└── app.json                 # Configuração Expo
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- Para Android/iOS: Expo Go instalado no dispositivo ou emulador configurado

---

## Instalação e execução

```bash
# Clone o repositório
git clone <url-do-repositório>
cd minhas-financas

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

Escaneie o QR Code com o Expo Go (Android) ou com a câmera (iOS), ou pressione:

| Comando | Plataforma |
|---|---|
| `a` | Android |
| `i` | iOS |
| `w` | Web |

---

## Telas

### Dashboard
Visão geral do mês: saldo total, receitas, despesas, cotações de câmbio e lista de transações. Arraste para baixo para atualizar. Toque em uma transação para ver detalhes; pressione e segure para excluir.

### Nova Transação
Formulário com validação para cadastrar receitas ou despesas. Suporta categorias (Alimentação, Transporte, Saúde, Lazer, Moradia, Salário, Outros), geolocalização opcional via GPS ou mapa interativo, e anexo de comprovante por câmera ou galeria.

### Relatório
Gráfico de barras empilhado comparando receitas e despesas, seguido de um detalhamento percentual dos gastos por categoria no mês selecionado.

### Mapa
Exibe um mapa com marcadores para todas as transações que possuem localização registrada. Pinos verdes indicam receitas; vermelhos, despesas. Toque no pino para ver descrição, valor e data.

### Sobre
Informações sobre o aplicativo: versão, descrição e stack tecnológico utilizado.

---

## Banco de dados

O aplicativo usa SQLite local com uma única tabela:

```sql
CREATE TABLE transacoes (
  id          TEXT PRIMARY KEY,
  descricao   TEXT NOT NULL,
  valor       REAL NOT NULL,
  tipo        TEXT NOT NULL,   -- 'receita' | 'despesa'
  categoria   TEXT NOT NULL,
  data        TEXT NOT NULL,   -- formato DD/MM/YYYY
  latitude    REAL,
  longitude   REAL,
  comprovante TEXT             -- caminho local do arquivo
);
```

O banco suporta migrações automáticas para adicionar colunas em versões anteriores da base.

---

## Permissões necessárias

| Permissão | Uso |
|---|---|
| Localização | Geotag de transações e exibição no mapa |
| Câmera | Captura de comprovantes |
| Galeria | Seleção de comprovantes existentes |

---

## Contexto acadêmico

Projeto desenvolvido como atividade prática do **Módulo 06 — Desenvolvimento Mobile com React Native** do Curso de Desenvolvimento Full Stack do ITEAM / CCTI, com foco em:

- Persistência local com SQLite
- Gerenciamento de estado com Context API e hooks customizados
- Integração com APIs de device (câmera, GPS)
- Navegação com React Navigation
- Compatibilidade multiplataforma com Expo
