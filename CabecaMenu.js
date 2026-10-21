import { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { UsuarioContext } from './UsuarioContext';

const CabecalhoMenu = ({ navigation }) => {

  // Usuário logado (vem do App.js). null = ninguém logado
  const { usuario, setUsuario } = useContext(UsuarioContext);

  const [dialogSair, setDialogSair] = useState(false);

  // Fecha o menu e abre a tela escolhida
  const ir = (tela) => {
    navigation.closeDrawer();
    navigation.navigate('Início', { screen: tela });
  };

  const confirmarSaida = () => {
    setDialogSair(false);
    // Logout: esquece o usuário logado
    setUsuario(null);
    ir('Home');
  };


  return (

    <View style={styles.container}>

      {/* Área do usuário */}
      <View style={styles.usuario}>
        {/* Avatar: foto do perfil, se tiver */}
        {usuario && usuario.imagem ? (
          <Avatar.Image size={65} source={{ uri: usuario.imagem }} />
        ) : (
          <Avatar.Icon
            size={65}
            icon="account"
            style={styles.avatar}
          />
        )}

        {/* Nome e e-mail */}
        <View style={styles.informacoes}>

          <Text
            variant="titleMedium"
            style={styles.nome}
          >
            {usuario ? usuario.nome : 'Visitante'}
          </Text>

          <Text
            variant="bodyMedium"
            style={styles.email}
            numberOfLines={1}
          >
            {usuario ? usuario.email : 'Faça login para gerenciar'}
          </Text>

        </View>

      </View>


      {/* Sem usuário logado: mostra o botão de entrar */}
      {!usuario ? (
        <View style={styles.perfil}>
          <Text
            variant="bodyMedium"
            style={styles.perfilTexto}>
            Entrar / Cadastrar
          </Text>
          <IconButton
            icon="login"
            iconColor="white"
            size={24}
            onPress={() => ir('Acesso')}
          />
        </View>
      ) : null}


      {/* Área do perfil (só logado) */}
      {usuario ? (
        <View style={styles.perfil}>
          <Text
            variant="bodyMedium"
            style={styles.perfilTexto}>
            Meu perfil
          </Text>
          <IconButton
            icon="account"
            iconColor="white"
            size={24}
            onPress={() => ir('Perfil')}
          />
        </View>
      ) : null}


      {/* Área administrativa (só logado) */}
      {usuario ? (
        <View style={styles.perfil}>
          <Text
            variant="bodyMedium"
            style={styles.perfilTexto}>
            Área administrativa
          </Text>
          <IconButton
            icon="view-dashboard"
            iconColor="white"
            size={24}
            onPress={() => ir('Admin')}
          />
        </View>
      ) : null}


      {/* Área do Notificação */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Notificação
        </Text>
        <IconButton
          icon="bell"
          iconColor="white"
          size={24}
          onPress={() => alert('Nenhuma notificação.')}
        />
      </View>

      {/* Área do Pesquisa */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Pesquisa
        </Text>
        <IconButton
          icon="magnify"
          iconColor="white"
          size={24}
          onPress={() => ir('Pesquisa')}
        />
      </View>

      {/* Área do configuração (só logado) */}
      {usuario ? (
        <View style={styles.perfil}  >

          <Text
            variant="bodyMedium"
            style={styles.perfilTexto}>
            Configuração
          </Text>
          <IconButton
            icon="cog"
            iconColor="white"
            size={24}
            onPress={() => ir('Perfil')}
          />
        </View>
      ) : null}

      {/* Área do sair (só logado) */}
      {usuario ? (
        <View style={styles.perfil}>
          <Text
            variant="bodyMedium"
            style={styles.perfilTexto}>
            Sair
          </Text>
          <IconButton
            icon="logout"
            iconColor="white"
            size={24}
            onPress={() => setDialogSair(true)}
          />

        </View>
      ) : null}


      {/* Dialog de confirmação */}
      <Portal>
        <Dialog
          visible={dialogSair}
          onDismiss={() => setDialogSair(false)}>
          <Dialog.Title>Confirmar saída</Dialog.Title>
          <Dialog.Content>
            <Text>
              Deseja realmente sair do aplicativo?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDialogSair(false)}>
              Cancelar
            </Button>

            <Button
              onPress={confirmarSaida}   >
              Sair
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
};


const styles = StyleSheet.create({

  container: {
    backgroundColor: '#C0C0C0',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    backgroundColor: '#F2A900',
  },

  informacoes: {
    flex: 1,
    marginLeft: 15,
  },

  nome: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 19,
  },

  email: {
    color: '#FFFFFF',
    marginTop: 3,
  },

  perfil: {
    marginTop: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  perfilTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});

export { CabecalhoMenu };