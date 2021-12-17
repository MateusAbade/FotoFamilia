import React from "react";
import { TouchableOpacity } from "react-native";
import { Card, CardImage, CardContent } from "react-native-material-cards";
import { NomeFamilia, DescricaoFamilia, EsquerdaDaMesmaLinha, Likes, Titulo } from "../../assets/styles.js";
import Icon from "react-native-vector-icons/AntDesign";
import { getImagem } from "../../api/index.js";
export default class FeedCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feed: this.props.feed,
            navegador: this.props.navegador
        }
    }


    render = () => {
        const { feed, navegador } = this.state;
        return (
            <TouchableOpacity onPress={
                () => {
                    navegador.navigate("Detalhes", { feedId: feed._id })
                }
            }>
                <Card >
                    <CardImage source={getImagem(feed.familia.blobs[0].file)} />
                    <CardContent>
                        <NomeFamilia><Titulo>Familia: </Titulo>{feed.familia.name}</NomeFamilia>
                        <NomeFamilia><Titulo>Descendência: </Titulo>{feed.descendencia.assinatura}</NomeFamilia>
                    </CardContent>
                    <CardContent>
                        <DescricaoFamilia>{feed.familia.description}</DescricaoFamilia>
                    </CardContent>
                    <CardContent>
                        <EsquerdaDaMesmaLinha>
                            <Icon name="heart" size={18} color={"#ff0000"}>
                                <Likes> {feed.likes}</Likes>
                            </Icon>
                        </EsquerdaDaMesmaLinha>
                    </CardContent>

                </Card>
            </TouchableOpacity>
        );
    }
}