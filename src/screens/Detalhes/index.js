import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import CardView from "react-native-cardview";
import {
    NomeFamilia, DescricaoFamilia, Likes, Espacador,
    EspacoEsquerda, Cabecalho, LinhaTop, EspacoDireita,
    MenuNomeFamilia, EsquerdaDaMesmaLinha, Titulo, CaixaDetalhes, MenuTop
} from "../../assets/styles.js";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";
import Compartilhador from "../../components/compartilhador";
import syncStorage from "sync-storage";
import Toast from "react-native-simple-toast";
import { getFeed, getImagem, usuarioGostou, gostar, desgostar, likesAlive, comentariosAlive } from "../../api";

const TAMANHO_SLIDE = 3;
export default class Detalhes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            feed: null,
            gostou: false,
            podeGostar: false,
            podeComentar: false
        }

    }
    verificarUsuarioGostou = () => {
        const { feedId } = this.state;

        usuarioGostou(feedId).then((resultado) => {
            this.setState({
                gostou: resultado.likes > 0
            });
        }).catch((erro) => {
            console.log("erro verificando se usuário gostou: " + erro);
        })

    }
    carregarFeed = () => {
        const { feedId } = this.state;
        getFeed(feedId).then((feedAtualizado) => {
            this.setState({
                feed: feedAtualizado
            }, () => {
                this.verificarUsuarioGostou();
            });
        }).catch((erro) => {
            console.error("erro atualizando o feed: " + erro);
        })

    }
    componentDidMount = () => {
        likesAlive().then((resultado) => {
            if (resultado.alive === "yes") {
                this.setState({
                    podeGostar: true
                });
            } else {
                this.setState({
                    podeGostar: false
                }, () => {
                    Toast.show("Não será possível registrar likes agora, tente mais tarde!", Toast.LONG)
                });
            }
        }).catch((erro) => {
            console.error("erro verificando disponibilidade de serviço: " + erro);
        });
        comentariosAlive().then((resultado) => {
            if (resultado.alive === "yes") {
                this.setState({
                    podeComentar: true
                });
            } else {
                this.setState({
                    podeComentar: false
                }, () => {
                    Toast.show("Não será possível comentar agora, tente mais tarde!", Toast.LONG)
                });
            }
        }).catch((erro) => {
            console.error("erro verificando disponibilidade de serviço: " + erro);
        });
        this.carregarFeed();
    }

    mostrarSlide = () => {
        const { feed } = this.state;
        let slides = [];
        for (let i = 0; i < TAMANHO_SLIDE; i++) {
            if (feed.familia.blobs[i].file) {
                slides = [...slides, getImagem(feed.familia.blobs[i].file)]
            }

        }

        return (

            <SliderBox
                dotColor={"#ffad05"}
                inactiveDotColor={"#5995ed"}
                resizeMethod={"resize"}
                resizeMode={"cover"}
                dotStyle={{
                    width: 15,
                    height: 15,
                    borderRadius: 15,
                    marginHorizontal: 5,

                }}
                images={slides} />


        );

    }

    likes = () => {
        const { feedId } = this.state;
        gostar(feedId).then((resultado) => {
            if (resultado.situacao === "ok") {
                this.carregarFeed();
                Toast.show("Obrigado pela sua avaliação!", Toast.LONG);
            } else {
                Toast.show("Ocorreu um erro nessa operação. Tente novamente depois!", Toast.LONG);
            }
        }).catch((erro) => {
            console.erro("erro registrando like: " + erro);
        })


    }

    dislikes = () => {
        const { feedId } = this.state;
        desgostar(feedId).then((resultado) => {
            if (resultado.situacao === "ok") {
                this.carregarFeed();

            } else {
                Toast.show("Ocorreu um erro nessa operação. Tente novamente depois!", Toast.LONG);
            }
        }).catch((erro) => {
            console.erro("erro registrando like: " + erro);
        })
    }

    render = () => {
        const { feed, gostou, podeGostar, podeComentar } = this.state;
        const usuario = syncStorage.get("user")

        if (feed) {
            return (
                <>
                    <Header
                        leftComponent={

                            <Icon color="white" size={28} name="left" onPress={() => {
                                this.props.navigation.goBack();
                            }} />

                        }
                        centerComponent={
                            <MenuNomeFamilia>
                                {feed.assinatura}
                            </MenuNomeFamilia>
                        }
                        rightComponent={
                            <LinhaTop>
                                <EspacoDireita>
                                    <Compartilhador feed={feed} />
                                </EspacoDireita>
                                <EspacoDireita>

                                    {podeGostar && gostou && usuario && <Icon name="heart" size={28} color={"#fff"}
                                        onPress={
                                            () => {
                                                this.dislikes();
                                            }
                                        }
                                    ></Icon>}
                                    {podeGostar && !gostou && usuario && <Icon name="hearto" size={28} color={"#fff"}
                                        onPress={
                                            () => {
                                                this.likes();
                                            }
                                        }
                                    ></Icon>}
                                </EspacoDireita>
                            </LinhaTop>
                        }
                        containerStyle={Cabecalho}
                    >

                    </Header>
                    <CardView
                        cardElevation={2}
                        cornerRadius={0}>

                        {this.mostrarSlide()}
                        <CaixaDetalhes>
                            <NomeFamilia><Titulo>Familia: </Titulo>{feed.familia.name}</NomeFamilia>
                            <NomeFamilia><Titulo>Descendência: </Titulo>{feed.descendencia.assinatura}</NomeFamilia>
                            <DescricaoFamilia>{feed.familia.description}</DescricaoFamilia>
                            <Espacador />
                        </CaixaDetalhes>
                        <EsquerdaDaMesmaLinha>

                            <EspacoEsquerda>

                                <Icon name="heart" size={18} color={"#ff0000"}>
                                    <Likes> {feed.likes}</Likes>
                                </Icon>

                            </EspacoEsquerda>
                            <EspacoEsquerda />
                            {podeComentar && usuario && <Icon name="message1" size={18} onPress={
                                () => {
                                    this.props.navigation.navigate("Comentarios",
                                        {
                                            feedId: feed._id,
                                            familia: feed.familia
                                        })
                                }
                            }
                            />}
                        </EsquerdaDaMesmaLinha>
                        <Espacador />
                    </CardView>
                </>
            );
        } else {
            return (null);
        }
    }
}