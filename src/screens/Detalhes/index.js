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
        var slidesRecebe = [slide1, slide2, slide3,slide4, slide5, slide6, slide7, slide8, slide9,
            slide10, slide11, slide12, slide13, slide14, slide15,
            slide16, slide17, slide18, slide19, slide20, slide21];
        const slides = [];    
        const { feedId } = this.state;

        var cont=1;
        for (let i = 0; i < slidesRecebe.length; i++)  {
             cont=cont+i;
           if (feedId== cont){
              var recebe = cont * 3;
              recebe = recebe-3;
             for (let i = 0; i < 3; i++) {
                 slides[i]=slidesRecebe[recebe]
                 recebe++;
             }
             break;
           }
           cont=1;
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