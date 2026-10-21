import React, { useContext } from 'react';
import { View } from 'react-native';

import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import { API_URL } from './Api';
import { UsuarioContext } from './UsuarioContext';

const Login = ({ navigation }) => {

    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [mostrarSenha, setMostrarSenha] = React.useState(false);

    // Função que guarda o usuário logado (vem do App.js)
    const { setUsuario } = useContext(UsuarioContext);

    const entrar = async () => {

        if (email === '' || senha === '') {
            alert('Informe e-mail e senha.');
            return;
        }

        try {
            // Pergunta para a API se o e-mail e a senha estão certos
            const resposta = await fetch(API_URL + '/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, senha: senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.mensagem);
                return;
            }

            // Deu certo: guarda o usuário e volta para a tela inicial
            setUsuario(dados);
            setEmail('');
            setSenha('');
            navigation.navigate('Home');
        } catch (erro) {
            alert('Não foi possível conectar com a API.');
        }
    };

    return (

        <View style={styles.loginContainer}>

            {/* APPBAR */}

            <Appbar.Header >

                <Appbar.BackAction
                    iconColor="black"
                    onPress={() => navigation.goBack()}
                />

                <Appbar.Content
                    title="Login"
                    titleStyle={styles.title}
                />

            </Appbar.Header>


            {/* FORMULÁRIO */}

            <View style={styles.loginContent}>

                <Text
                    variant="headlineMedium"
                    style={styles.loginTitulo}
                >
                    Bem-vindo!
                </Text>


                <Text
                    variant="bodyLarge"
                    style={styles.loginTexto}
                >
                    Entre com sua conta
                </Text>


                {/* E-MAIL */}

                <TextInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={
                        <TextInput.Icon icon="email" />
                    }
                    style={styles.input}
                />


                {/* SENHA */}

                <TextInput
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarSenha}
                    left={
                        <TextInput.Icon icon="lock" />
                    }
                    right={
                        <TextInput.Icon
                            icon={mostrarSenha ? 'eye-off' : 'eye'}
                            onPress={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* ENTRAR */}

                <Button
                    mode="contained"
                    icon="login"
                    style={styles.loginButton}
                    onPress={entrar}
                >
                    ENTRAR
                </Button>


                {/* CADASTRO */}

                <Button
                    mode="text"
                    icon="account-plus"
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    NÃO TENHO CADASTRO
                </Button>

            </View>

        </View>
    );
};

export default Login;