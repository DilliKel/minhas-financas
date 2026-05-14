// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabRoutes } from './routes/TabRoutes';
import { TransacoesProvider } from './context/TransacoesContext';
import { BoasVindasScreen } from './screens/BoasVindasScreen';
import {
  PrimeiroAcessoProvider,
  usePrimeiroAcesso,
} from './context/PrimeiroAcessoContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function ConteudoApp() {
  const { primeiroAcesso, carregando, concluir } = usePrimeiroAcesso();

  if (carregando) return null;

  if (primeiroAcesso) {
    return <BoasVindasScreen onConcluir={concluir} />;
  }

  return (
    <TransacoesProvider>
      <NavigationContainer>
        <TabRoutes />
      </NavigationContainer>
    </TransacoesProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PrimeiroAcessoProvider>
          <ConteudoApp />
        </PrimeiroAcessoProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
