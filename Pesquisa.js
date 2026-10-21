import React from 'react';

import { View, ScrollView } from 'react-native';

import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import ModCard from './Cards';
import { API_URL } from './Api';

const Pesquisa = ({ navigation }) => {

    const [termo, setTermo] = React.useState('');
    const [resultados, setResultados] = React.useState([]);
    // Só mostra "nenhum resultado" depois da primeira pesquisa
    const [pesquisou, setPesquisou] = React.useState(false);

    const pesquisar = async () => {
        try {
            // Manda o termo para a API, que devolve só os registros que combinam
            const resposta = await fetch(API_URL + '/conteudos?busca=' + encodeURIComponent(termo));
            const dados = await resposta.json();
            setResultados(dados);
            setPesquisou(true);
        } catch (erro) {
            alert('Não foi possível conectar com a API.');
        }
    };

    return (

        <View style={{ flex: 1 }}>

            <Appbar.Header>

                <Appbar.BackAction
                    onPress={() => navigation.goBack()}
                />

                <Appbar.Content
                    title="Pesquisa"
                />

            </Appbar.Header>


            <TextInput
                label="Pesquisar"
                placeholder="Digite aqui..."
                mode="outlined"
                value={termo}
                onChangeText={setTermo}
                onSubmitEditing={pesquisar}
                right={<TextInput.Icon icon="magnify" onPress={pesquisar} />}
                style={{
                    margin: 20,
                    marginBottom: 10,
                }}
            />

            <Button mode="contained" icon="magnify" style={{ marginHorizontal: 20 }} onPress={pesquisar}>
                PESQUISAR
            </Button>

            <ScrollView contentContainerStyle={styles.cardsContent}>

                {pesquisou ? (
                    <Text style={styles.vazio}>{resultados.length} resultado(s) encontrado(s)</Text>
                ) : null}

                {resultados.map((item) => (
                    <ModCard key={item._id} conteudo={item} aoExcluir={pesquisar} />
                ))}

            </ScrollView>

        </View>
    );
};

export default Pesquisa;
