import { useState, useContext } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import { styles } from './css/Styles';
import { API_URL } from './Api';
import { CATEGORIAS } from './Categorias';
import { UsuarioContext } from './UsuarioContext';

// Tela usada para CADASTRAR e para EDITAR um conteúdo
const FormConteudo = ({ navigation, route }) => {

    const { usuario } = useContext(UsuarioContext);

    // Se veio um conteúdo pela navegação, estamos editando
    let conteudo = null;
    if (route.params && route.params.conteudo) {
        conteudo = route.params.conteudo;
    }
    const editando = conteudo !== null;

    // Campos começam com os dados do conteúdo (editar) ou vazios (novo)
    const [titulo, setTitulo] = useState(editando ? conteudo.titulo : '');
    const [subtitulo, setSubtitulo] = useState(editando ? conteudo.subtitulo : '');
    const [categoria, setCategoria] = useState(editando ? conteudo.categoria : CATEGORIAS[0]);
    const [imagem, setImagem] = useState(editando ? conteudo.imagem : '');

    // Só usuário logado pode usar esta tela
    if (!usuario) {
        return (
            <View style={styles.adminContainer}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Acesso negado" />
                </Appbar.Header>
                <Text style={styles.vazio}>Faça login para continuar.</Text>
                <Button mode="contained" style={styles.adminButton} onPress={() => navigation.navigate('Login')}>
                    IR PARA O LOGIN
                </Button>
            </View>
        );
    }

    // Abre a galeria e guarda a imagem escolhida
    const escolherImagem = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            alert('Precisamos de permissão para acessar suas fotos.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.3,
            base64: true, // pede a imagem em forma de texto para salvar no banco
        });

        if (!resultado.canceled) {
            // Monta o texto da imagem no formato que o <Image> entende
            setImagem('data:image/jpeg;base64,' + resultado.assets[0].base64);
        }
    };

    const salvar = async () => {

        if (titulo === '') {
            alert('Informe o título.');
            return;
        }

        const dados = {
            titulo: titulo,
            subtitulo: subtitulo,
            categoria: categoria,
            imagem: imagem,
        };

        // Editar usa PUT com o id, novo usa POST
        let url = API_URL + '/conteudos';
        let metodo = 'POST';
        if (editando) {
            url = API_URL + '/conteudos/' + conteudo._id;
            metodo = 'PUT';
        }

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });

            if (!resposta.ok) {
                const erro = await resposta.json();
                alert(erro.mensagem);
                return;
            }

            alert('Salvo com sucesso!');
            navigation.goBack();
        } catch (erro) {
            alert('Não foi possível conectar com a API.');
        }
    };

    return (
        <View style={styles.adminContainer}>

            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={editando ? 'Editar conteúdo' : 'Novo conteúdo'} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.adminContent}>

                {/* IMAGEM */}
                {imagem ? (
                    <Image source={{ uri: imagem }} style={styles.formImagem} />
                ) : (
                    <View style={styles.formSemImagem}>
                        <Text>Sem imagem</Text>
                    </View>
                )}

                <Button mode="outlined" icon="image-edit" style={styles.adminButton} onPress={escolherImagem}>
                    {imagem ? 'TROCAR IMAGEM' : 'ESCOLHER IMAGEM'}
                </Button>

                {imagem ? (
                    <Button mode="text" icon="image-remove" onPress={() => setImagem('')}>
                        REMOVER IMAGEM
                    </Button>
                ) : null}

                {/* TÍTULO */}
                <TextInput
                    label="Título"
                    value={titulo}
                    onChangeText={setTitulo}
                    mode="outlined"
                    style={styles.input}
                />

                {/* SUBTÍTULO */}
                <TextInput
                    label="Subtítulo"
                    value={subtitulo}
                    onChangeText={setSubtitulo}
                    mode="outlined"
                    style={styles.input}
                />

                {/* CATEGORIA (em qual aba vai aparecer) */}
                <Text style={styles.formLabel}>Categoria</Text>
                <View style={styles.formCategorias}>
                    {CATEGORIAS.map((item) => (
                        <Button
                            key={item}
                            mode={categoria === item ? 'contained' : 'outlined'}
                            compact
                            style={styles.formCategoria}
                            onPress={() => setCategoria(item)}
                        >
                            {item}
                        </Button>
                    ))}
                </View>

                {/* SALVAR */}
                <Button mode="contained" icon="content-save" style={styles.adminButton} onPress={salvar}>
                    SALVAR
                </Button>

            </ScrollView>
        </View>
    );
};

export default FormConteudo;
