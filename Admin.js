import { useState, useContext, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, Button, Text, List, Avatar, IconButton, Portal, Dialog } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from './css/Styles';
import { API_URL } from './Api';
import { UsuarioContext } from './UsuarioContext';

// Área administrativa: lista todos os conteúdos para gerenciar
const Admin = ({ navigation }) => {

    const { usuario } = useContext(UsuarioContext);
    const [conteudos, setConteudos] = useState([]);
    // Guarda qual conteúdo vai ser excluído (null = nenhum)
    const [paraExcluir, setParaExcluir] = useState(null);

    const carregar = async () => {
        try {
            const resposta = await fetch(API_URL + '/conteudos');
            const dados = await resposta.json();
            setConteudos(dados);
        } catch (erro) {
            alert('Não foi possível carregar os conteúdos.');
        }
    };

    // Recarrega toda vez que a tela aparecer
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    const excluir = async () => {
        const id = paraExcluir._id;
        setParaExcluir(null);
        try {
            await fetch(API_URL + '/conteudos/' + id, { method: 'DELETE' });
            carregar();
        } catch (erro) {
            alert('Não foi possível excluir.');
        }
    };

    // Só usuário logado pode entrar aqui
    if (!usuario) {
        return (
            <View style={styles.adminContainer}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Área administrativa" />
                </Appbar.Header>
                <Text style={styles.vazio}>Você precisa estar logado para acessar esta área.</Text>
                <Button mode="contained" style={styles.adminButton} onPress={() => navigation.navigate('Login')}>
                    IR PARA O LOGIN
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.adminContainer}>

            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Área administrativa" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.adminContent}>

                <Text variant="titleMedium">Olá, {usuario.nome}!</Text>
                <Text style={styles.adminTexto}>
                    {conteudos.length} conteúdo(s) cadastrado(s)
                </Text>

                <Button
                    mode="contained"
                    icon="plus"
                    style={styles.adminButton}
                    onPress={() => navigation.navigate('FormConteudo')}
                >
                    NOVO CONTEÚDO
                </Button>

                {/* Uma linha para cada conteúdo */}
                {conteudos.map((item) => (
                    <List.Item
                        key={item._id}
                        title={item.titulo}
                        description={item.subtitulo + ' • ' + item.categoria}
                        style={styles.adminItem}
                        left={() => (
                            item.imagem
                                ? <Avatar.Image size={50} source={{ uri: item.imagem }} />
                                : <Avatar.Icon size={50} icon="image" />
                        )}
                        right={() => (
                            <View style={{ flexDirection: 'row' }}>
                                <IconButton
                                    icon="pencil"
                                    onPress={() => navigation.navigate('FormConteudo', { conteudo: item })}
                                />
                                <IconButton
                                    icon="delete"
                                    onPress={() => setParaExcluir(item)}
                                />
                            </View>
                        )}
                    />
                ))}

            </ScrollView>

            {/* Confirmação antes de excluir */}
            <Portal>
                <Dialog visible={paraExcluir !== null} onDismiss={() => setParaExcluir(null)}>
                    <Dialog.Title>Excluir</Dialog.Title>
                    <Dialog.Content>
                        <Text>Deseja excluir "{paraExcluir ? paraExcluir.titulo : ''}"?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setParaExcluir(null)}>Cancelar</Button>
                        <Button onPress={excluir}>Excluir</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default Admin;
