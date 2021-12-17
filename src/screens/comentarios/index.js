import React from 'react';
import { FlatList, Text, Modal, TextInput, Alert } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/AntDesign";
import Swipeable from "react-native-swipeable-row";
import SyncStorage from 'sync-storage';
import Moment from 'react-moment';
import "moment-timezone"
import {
    MenuNomeFamilia, Cabecalho, EspacoDireita,
    AutorComentario, ContededorComentarios, ContededorComentarioDeOutroUsuario,
    ContededorComentarioDoUsuario, ContededorNovoComentario, Comentario,
    DataComentario, EspacadorComentario, LinhaTop, Espacador,
    DivisorComentario, EspacoBottom, EspacoEsquerda, button, ContededorMensagem, Mensagem, buttonFalha
} from '../../assets/styles';
import { View } from 'react-native';
import { getComentarios, adicionarComentario, removerComentario, comentariosAlive } from "../../api"
import Toast from "react-native-simple-toast";

const TAMANHO_MAXIMO_COMENTARIO = 100;
export default class Comentarios extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            familia: this.props.navigation.state.params.familia,
            comentarios: [],
            atualizando: false,
            carregando: false,
            proximaPagina: 1,
            telaAdicaoVisivel: false,
            textoNovoComentario: "",
            podeComentar: true
        }
    }

    carregarComentarios = () => {
        const { feedId, comentarios, proximaPagina } = this.state;

        this.setState({
            carregando: true
        });
        comentariosAlive().then((resultado) => {
            if (resultado.alive === "yes") {
                this.setState({
                    podeComentar: true
                }, () => {
                    getComentarios(feedId, proximaPagina).then((maisComentarios) => {
                        if (maisComentarios.length) {
                            this.setState({
                                proximaPagina: proximaPagina + 1,
                                comentarios: [...comentarios, ...maisComentarios],
                                atualizando: false,
                                carregando: false
                            })
                        } else {
                            this.setState({
                                atualizando: false,
                                carregando: false
                            })
                        }
                    }).catch((erro) => {
                        console.error("erro exibindo comentarios: " + erro);
                    })
                });
            } else {
                this.setState({
                    podeComentar: false
                });
            }
        }).catch((erro) => {
            console.error("erro, verificando a diponibilidade do serviço: " + erro);
        })


    }

    componentDidMount = () => {
        this.carregarComentarios();

    }

    carregarMaisComentarios = () => {
        const { carregando } = this.state;
        if (carregando) {
            return;
        }

        this.carregarComentarios();
    }


    mostrarComentarioDoUsuario = (comentario) => {
        return (
            <>
                <Swipeable
                    rightButtonWidth={50}
                    rightButtons={[
                        <View style={{ marginTop: 35, marginLeft: 10 }}>
                            <Icon name="delete" color="#FF4500" size={28}
                                onPress={() => {
                                    this.confirmarRemocao(comentario);
                                }} />
                        </View>
                    ]
                    }>

                    <ContededorComentarioDoUsuario>
                        <EspacoEsquerda>
                            <AutorComentario>{"você: "}</AutorComentario>
                            <Comentario>{comentario.content}</Comentario>
                            <DataComentario>
                                <Moment element={Text} parse="YYYY-MM-DD HH:mm"
                                    format="DD/MM/YYYY HH:mm">
                                    {comentario.datetime}
                                </Moment>
                            </DataComentario>
                        </EspacoEsquerda>
                    </ContededorComentarioDoUsuario>
                </Swipeable>
                <EspacadorComentario />
            </>
        );
    }
    removerComentario = (comentarioParaRemover) => {
        removerComentario(comentarioParaRemover._id).then(
            (resultado) => {
                if (resultado.situacao === "ok") {
                    this.setState({
                        proximaPagina: 1,
                        comentarios: []
                    }, () => {
                        this.carregarComentarios();
                    });
                }
            }
        ).catch((erro) => {
            console.error("erro removendo comentario: " + erro);

        });
    }

    confirmarRemocao = (comentario) => {
        Alert.alert(
            null,
            "Deseja remover o seu comentário?",
            [
                { text: "NÃO", style: 'cancel' },
                { text: "SIM", onPress: () => this.removerComentario(comentario) }
            ]
        )
    }

    mostrarComentarioDeOutroUsuario = (comentario) => {

        return (
            <>
                <ContededorComentarioDeOutroUsuario>
                    <AutorComentario>{comentario.user.name}</AutorComentario>
                    <Comentario>{comentario.content}</Comentario>
                    <DataComentario>
                        <Moment element={Text} parse="YYYY-MM-DD HH:mm"
                            format="DD/MM/YYYY HH:mm">
                            {comentario.datetime}
                        </Moment>
                    </DataComentario>
                </ContededorComentarioDeOutroUsuario>
                <EspacadorComentario />
            </>
        );
    }

    atualizar = () => {
        this.setState({
            atualizando: true, carregando: false, proximaPagina: 1,
            comentarios: []
        }, () => {
            this.carregarComentarios();
        });
    }
    adicionarComentario = () => {
        const { feedId, textoNovoComentario } = this.state;

        comentariosAlive().then((resultado) => {
            if (resultado.alive === "yes") {
                this.setState({
                    podeComentar: true
                }, () => {
                    adicionarComentario(feedId, textoNovoComentario).then(
                        (resultado) => {
                            if (resultado.situacao == "ok") {
                                this.setState({
                                    proximaPagina: 1,
                                    comentarios: []
                                }, () => {
                                    this.carregarComentarios();
                                })
                            }
                        }
                    ).catch((erro) => {
                        console.error("erro adicionando comentario: " + erro);
                    });
                });
            } else {
                this.setState({
                    podeComentar: false
                });
            }
        }).catch((erro) => {
            console.error("erro, verificando a diponibilidade do serviço: " + erro);
        })

        this.mudarVisibilidadeTelaAcao();
    }

    atualizarTextoNovoComentario = (texto) => {
        this.setState({
            textoNovoComentario: texto
        });
    }


    mudarVisibilidadeTelaAcao = () => {
        const { telaAdicaoVisivel } = this.state;

        this.setState({
            telaAdicaoVisivel: !telaAdicaoVisivel
        })
    }

    mostrarTelaAdicaoComentario = () => {
        return (
            <Modal animationType="slide"
                transparent={true}

                onRequestClose={
                    () => {
                        this.atualizar();
                    }
                }
            >
                <ContededorNovoComentario>
                    <TextInput multiline
                        editable
                        placeholder={"Digite um comentário"}
                        maxLength={TAMANHO_MAXIMO_COMENTARIO}
                        onChangeText={(texto) => {
                            this.atualizarTextoNovoComentario(texto);
                        }}
                    />
                    <DivisorComentario />
                    <LinhaTop>
                        <Button
                            buttonStyle={button}
                            icon={
                                <Icon
                                    name={"check"}
                                    size={22}
                                    color="#fff" />
                            }
                            title="Gravar"
                            type="solid"

                            onPress={
                                () => {
                                    this.adicionarComentario();
                                }
                            }
                        />
                        <Espacador />
                        <Button
                            buttonStyle={button}
                            icon={
                                <Icon
                                    name={"closecircle"}
                                    size={22}
                                    color="#fff"
                                />
                            }
                            title="Cancelar"
                            type="solid"

                            onPress={
                                () => {
                                    this.mudarVisibilidadeTelaAcao();
                                }
                            }

                        />


                    </LinhaTop>
                    <EspacoBottom />
                </ContededorNovoComentario>
            </Modal>
        );
    }


    mostrarComentarios = () => {
        const { familia, comentarios, atualizando } = this.state;
        const usuario = SyncStorage.get("user");

        return (
            <>
                <Header
                    leftComponent={
                        <Icon name="left" color="white" size={28} onPress={() => {
                            this.props.navigation.goBack()
                        }
                        } />
                    }

                    centerComponent={
                        <MenuNomeFamilia>
                            {familia.name}
                        </MenuNomeFamilia>
                    }

                    rightComponent={
                        <EspacoDireita>
                            <Icon name="pluscircleo" size={28} color="white" onPress={
                                () => {
                                    this.mudarVisibilidadeTelaAcao();
                                }
                            } />
                        </EspacoDireita>
                    }

                    containerStyle={Cabecalho}
                />
                <ContededorComentarios>
                    <FlatList
                        data={comentarios}

                        onEndReached={() => { this.carregarMaisComentarios(); }}
                        onEndReachedThreshold={0.1}

                        onRefresh={() => { this.atualizar(); }}
                        refreshing={atualizando}

                        keyExtractor={(item) => String(item._id)}
                        renderItem={({ item }) => {
                            if (item.user.email == usuario.email) {
                                return this.mostrarComentarioDoUsuario(item)
                            } else {
                                return this.mostrarComentarioDeOutroUsuario(item)
                            }
                        }
                        }
                    />
                </ContededorComentarios>

            </>
        )
    }
    mostrarMensagemCarregando = () => {
        return (
            <ContededorMensagem>
                <Mensagem>Carregando feeds, aguarde!</Mensagem>
            </ContededorMensagem>
        );
    }
    mostrarBotaoAtualizar = () => {
        return (
            <ContededorMensagem>
                <Mensagem>Um dos nossos serviços não está funcionando :(</Mensagem>
                <Mensagem>Tente novamente mais tarde!</Mensagem>
                <Espacador />
                <Button
                    buttonStyle={buttonFalha}
                    icon={
                        <Icon
                            name="reload1"
                            size={22}
                            color="#fff"
                        />
                    }
                    title="Atualizar"
                    type="solid"
                    onPress={() => {
                        this.carregarComentarios();
                    }}
                />
            </ContededorMensagem>
        )
    }
    render = () => {
        const { comentarios, telaAdicaoVisivel, podeComentar } = this.state;

        if (podeComentar) {

                return (
                    <>
                        {this.mostrarComentarios()}
                        {telaAdicaoVisivel && this.mostrarTelaAdicaoComentario()}
                    </>
                );
        } else {
            return this.mostrarBotaoAtualizar();
        }
    }



}

