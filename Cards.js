import { useState, useContext } from 'react';
import { Card, Text, Button, Portal, Dialog } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { styles } from './css/Styles';
import { API_URL } from './Api';
import { UsuarioContext } from './UsuarioContext';

// conteudo = dados do card que vieram do banco
// aoExcluir = função chamada depois de excluir (para atualizar a lista)
const ModCard = ({ conteudo, aoExcluir }) => {

    const navigation = useNavigation();
    const { usuario } = useContext(UsuarioContext);
    const [dialogExcluir, setDialogExcluir] = useState(false);

    // Se o conteúdo não tiver imagem, usa uma imagem padrão
    let imagem = 'https://picsum.photos/700';
    if (conteudo.imagem) {
        imagem = conteudo.imagem;
    }

    const excluir = async () => {
        setDialogExcluir(false);
        try {
            await fetch(API_URL + '/conteudos/' + conteudo._id, { method: 'DELETE' });
            aoExcluir();
        } catch (erro) {
            alert('Não foi possível excluir.');
        }
    };

    return (

        <Card style={styles.card}>
            <Card.Title title={conteudo.titulo} subtitle={conteudo.subtitulo} titleStyle={styles.cardTitle} />
            <Card.Cover
                style={styles.cardCover}
                source={{ uri: imagem }}
            />

            {/* Botões só aparecem para quem está logado */}
            {usuario ? (
                <Card.Actions style={styles.cardActions}>

                    <Button
                        icon="pencil"
                        onPress={() => navigation.navigate('FormConteudo', { conteudo: conteudo })}
                    >
                        Editar
                    </Button>

                    <Button
                        icon="delete"
                        onPress={() => setDialogExcluir(true)}
                    >
                        Excluir
                    </Button>

                </Card.Actions>
            ) : null}

            {/* Confirmação antes de excluir */}
            <Portal>
                <Dialog
                    visible={dialogExcluir}
                    onDismiss={() => setDialogExcluir(false)}>
                    <Dialog.Title>Excluir</Dialog.Title>
                    <Dialog.Content>
                        <Text>Deseja excluir "{conteudo.titulo}"?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogExcluir(false)}>Cancelar</Button>
                        <Button onPress={excluir}>Excluir</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </Card>
    );
};
export default ModCard;
