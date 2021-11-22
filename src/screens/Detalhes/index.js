import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import CardView from "react-native-cardview";
import feedsEstaticos from "../../assets/dicionarios/feeds.json"
import {
    NomeFamilia, DescricaoFamilia, Likes, Espacador,
    EspacoEsquerda, Cabecalho, LinhaTop, EspacoDireita,
    MenuNomeFamilia, EsquerdaDaMesmaLinha, Titulo, CaixaDetalhes, MenuTop
} from "../../assets/styles.js";
import slide1 from "../../assets/img/Homero-Leonor/slide1.jpg";
import slide2 from "../../assets/img/Homero-Leonor/slide2.jpg";
import slide3 from "../../assets/img/Homero-Leonor/slide3.jpg";
import slide4 from "../../assets/img/Emanuel-Irani/slide1.jpg";
import slide5 from "../../assets/img/Emanuel-Irani/slide2.jpg";
import slide6 from "../../assets/img/Emanuel-Irani/slide3.jpg";
import slide7 from "../../assets/img/Maria-Edgar/slide1.jpg";
import slide8 from "../../assets/img/Maria-Edgar/slide2.jpg";
import slide9 from "../../assets/img/Maria-Edgar/slide3.jpg";
import slide10 from "../../assets/img/Elzir-Moises/slide1.jpg";
import slide11 from "../../assets/img/Elzir-Moises/slide2.jpg";
import slide12 from "../../assets/img/Elzir-Moises/slide3.jpg";
import slide13 from "../../assets/img/Virigilio-Iraildes/slide1.jpg";
import slide14 from "../../assets/img/Virigilio-Iraildes/slide2.jpg";
import slide15 from "../../assets/img/Virigilio-Iraildes/slide3.jpg";
import slide16 from "../../assets/img/Clemencia-Alvino/slide1.jpg";
import slide17 from "../../assets/img/Clemencia-Alvino/slide2.jpg";
import slide18 from "../../assets/img/Clemencia-Alvino/slide3.jpg";
import slide19 from "../../assets/img/Raquel-Claudenir/slide1.jpg";
import slide20 from "../../assets/img/Raquel-Claudenir/slide2.jpg";
import slide21 from "../../assets/img/Raquel-Claudenir/slide3.jpg";


import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";
import Compartilhador from "../../components/compartilhador";
import syncStorage from "sync-storage";
import Toast from "react-native-simple-toast";

export default class Detalhes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feedId: this.props.navigation.state.params.feedId,
            feed: null,
            gostou: false
        }

    }
    carregarFeed = () => {
        const { feedId } = this.state;
        const feeds = feedsEstaticos.feeds;
        const feedsFiltrados = feeds.filter((feed) => feed._id === feedId);

        if (feedsFiltrados.length) {
            this.setState({
                feed: feedsFiltrados[0]
            });
        }

    }
    componentDidMount = () => {
        this.carregarFeed();
    }

    mostrarSlide = () => {
        var slides = [];
        const { feedId } = this.state;


        console.log(feedId)
        if (feedId == 1) {
            slides = [slide1, slide2, slide3];
        } if (feedId == 2) {
            slides = [slide4, slide5, slide6];
        } if (feedId == 3) {
            slides = [slide7, slide8, slide9];
        } if (feedId == 4) {
            slides = [slide10, slide11, slide12];
        } if (feedId == 5) {
            slides = [slide13, slide14, slide15];
        } if (feedId == 6) {
            slides = [slide16, slide17, slide18];
        } if (feedId == 7) {
            slides = [slide19, slide20, slide21];
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
        const { feed } = this.state;
        const ususario = syncStorage.get("user");
        feed.likes++;

        this.setState({
            feed: feed,
            gostou: true
        }, () => {
            Toast.show("Obrigado pela sua avaliação!", Toast.LONG);
        });
    }

    dislikes = () => {
        const { feed } = this.state;
        const ususario = syncStorage.get("user");
        feed.likes--;

        this.setState({
            feed: feed,
            gostou: false

        });
    }

    render = () => {
        const { feed, gostou } = this.state;
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
                                {feed.assinatura.name}
                            </MenuNomeFamilia>
                        }
                        rightComponent={
                            <LinhaTop>
                                <EspacoDireita>
                                    <Compartilhador feed={feed} />
                                </EspacoDireita>
                                <EspacoDireita>

                                    {gostou && usuario && <Icon name="heart" size={28} color={"#fff"}
                                        onPress={
                                            () => {
                                                this.dislikes();
                                            }
                                        }
                                    ></Icon>}
                                    {!gostou && usuario && <Icon name="hearto" size={28} color={"#fff"}
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
                            <NomeFamilia><Titulo>Descendência: </Titulo>{feed.assinatura.name}</NomeFamilia>
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
                            {usuario && <Icon name="message1" size={18} onPress={
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