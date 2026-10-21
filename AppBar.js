import { useState, useContext, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { API_URL } from './Api';
import { CATEGORIAS } from './Categorias';
import { UsuarioContext } from './UsuarioContext';

const AppBar = ({ navigation }) => {

    const { usuario } = useContext(UsuarioContext);

    // Lista de conteúdos que veio do banco
    const [conteudos, setConteudos] = useState([]);
    // Aba escolhida ('TODOS' mostra tudo)
    const [abaAtual, setAbaAtual] = useState('TODOS');

    const carregar = async () => {
        try {
            const resposta = await fetch(API_URL + '/conteudos');
            const dados = await resposta.json();
            setConteudos(dados);
        } catch (erro) {
            alert('Não foi possível carregar os conteúdos.');
        }
    };

    // Toda vez que esta tela aparecer, busca os conteúdos de novo
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    // Mostra só os conteúdos da aba escolhida
    let lista = conteudos;
    if (abaAtual !== 'TODOS') {
        lista = conteudos.filter((item) => item.categoria === abaAtual);
    }

    // Logado vai para a área administrativa, senão vai para o acesso
    const abrirConta = () => {
        if (usuario) {
            navigation.navigate('Admin');
        } else {
            navigation.navigate('Acesso');
        }
    };

    return (
        <>
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Technologic" style={styles.title} />
                <Appbar.Action icon="magnify" onPress={() => navigation.navigate('Pesquisa')} />
                <Appbar.Action icon="account" onPress={abrirConta} />
            </Appbar.Header>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={styles.tabs}
                contentContainerStyle={styles.tabsContent}>

                {/* Aba que mostra tudo */}
                <TouchableOpacity
                    style={[styles.tab, abaAtual === 'TODOS' ? styles.tabAtiva : null]}
                    onPress={() => setAbaAtual('TODOS')}
                >
                    <Text style={styles.tabText}>TODOS</Text>
                </TouchableOpacity>

                {/* Uma aba para cada categoria */}
                {CATEGORIAS.map((categoria) => (
                    <TouchableOpacity
                        key={categoria}
                        style={[styles.tab, abaAtual === categoria ? styles.tabAtiva : null]}
                        onPress={() => setAbaAtual(categoria)}
                    >
                        <Text style={styles.tabText}>{categoria}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>



            <ScrollView
                style={styles.cards}
                contentContainerStyle={styles.cardsContent}
            >
                {lista.length === 0 ? (
                    <Text style={styles.vazio}>Nenhum conteúdo cadastrado.</Text>
                ) : null}

                {/* Um card para cada conteúdo */}
                {lista.map((item) => (
                    <ModCard key={item._id} conteudo={item} aoExcluir={carregar} />
                ))}
            </ScrollView>

            {/* Botão de adicionar (só para quem está logado) */}
            {usuario ? (
                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => navigation.navigate('FormConteudo')}
                />
            ) : null}
        </>
    );
}

export default AppBar;
