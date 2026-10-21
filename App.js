import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

import { View } from 'react-native';
//React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import { PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';

// AppBar
import AppBar from './AppBar';
// Rotas
import Pesquisa from './Pesquisa';
// Acesso
import Acesso from './Acesso';
//Login
import Login from './Login';
//Cadastro
import Cadastro from './Cadastro';
// Perfil
import { Perfil } from './Perfil';
// Área administrativa
import Admin from './Admin';
// Formulário de conteúdo (novo / editar)
import FormConteudo from './FormConteudo';
//cabeçalho do menu
import { CabecalhoMenu } from './CabecaMenu';
// Usuário logado
import { UsuarioContext } from './UsuarioContext';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function stackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={AppBar} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
      <Stack.Screen name="Acesso" component={Acesso} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="FormConteudo" component={FormConteudo} />
    </Stack.Navigator>
  );
}


function DrawerNavigation() {
  return (
    <Drawer.Navigator screenOptions={{
      headerShown: false
    }}

      drawerContent={(props) => (
        <View style={{ flex: 1 }}>

          <CabecalhoMenu navigation={props.navigation} />


          <DrawerContentScrollView {...props} />

        </View>
      )}
    >
      <Drawer.Screen
        name="Início"
        component={stackNavigator}
      />
    </ Drawer.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  // Usuário logado (null = ninguém logado)
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 10000);
  }, []);

  if (loading) {
    return (<SplashScreen />)
  }

  return (
    // Deixa o usuário disponível para todas as telas
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>

          <DrawerNavigation />

        </NavigationContainer>
      </PaperProvider>
    </UsuarioContext.Provider>
  );
}
