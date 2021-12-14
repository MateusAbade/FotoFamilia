import React from "react";
import { View, FlatList} from "react-native";
import FeedCard from "../../components/FeedCard";
import { Header, Button} from "react-native-elements";
import { BarraPesquisa, MenuTop, LinhaTop, Cabecalho, ContededorMensagem, Mensagem, 
Espacador, buttonFalha } from "../../assets/styles.js";
import Icon from "react-native-vector-icons/AntDesign";
import Menu from "../../components/Menu/index.js";
import  DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import {getFeeds, getFeedsPorFamilia, getFeedsPorDescendencia, feedAlive } from "../../api";




export default class Feeds extends React.Component{

    constructor(props){
        super(props);

        this.filtrarPorFamlilia = this.filtrarPorFamlilia.bind(this);
        this.state = {
            proximaPagina: 1,
            feeds: [],
            carregando: false,
            atualizando: false,
            nomeFamilia: null,
            familiaEscolhida: null,
            podeVerFeeds: true
        }
    }

    mostrarMaisFeeds = (maisFeeds) => {

        const {feeds, proximaPagina } = this.state;

        if(maisFeeds.length){
            this.setState({
                proximaPagina: proximaPagina + 1,
                feeds: [...feeds, ...maisFeeds],

                carregando: false,
                atualizando: false
            });

           }else{
               this.setState({
                   carregando: false,
                   atualizando: false
               })
           }
    }

    carregarFeeds = () => {

        const { proximaPagina, nomeFamilia, familiaEscolhida } = this.state;

        this.setState({
            carregando: true
        });

        feedAlive().then(
            (resultado)=>{
                    if(resultado.alive==="yes"){
                        this.setState({
                            podeVerFeeds:true
                        }, () =>{
                        if(familiaEscolhida){
                            getFeedsPorDescendencia(familiaEscolhida._id, proximaPagina).then((maisFeeds) => {
                                this.mostrarMaisFeeds(maisFeeds);
                            }).catch((erro)=>{
                                console.error("erro tentando acessar o feeds: "+ erro);
                            })

                        } else if(nomeFamilia){
                            getFeedsPorFamilia(nomeFamilia, proximaPagina).then((maisFeeds)=>{
                                this.mostrarMaisFeeds(maisFeeds);
                            }).catch((erro)=>{
                                console.error("erro tentando acessar o feeds: "+ erro);
                            })
                        }else{

                            getFeeds(proximaPagina).then((maisFeeds)=>{
                                this.mostrarMaisFeeds(maisFeeds);
                            }).catch((error)=>{
                                console.error("erro tentando acessar o feeds: "+ error);
                            });

                        }
                        })
                    }else{
                        this.setState({
                            podeVerFeeds: false,
                        })
                    }
            }
        ).catch((erro) => {
            console.log("erro, verificando a diponibilidade do serviço: "+ erro );
        })
    }


    componentDidMount = () =>{

        this.carregarFeeds();
    }

    carregarMaisFeeds = () =>{
        const { carregando } = this.state;

        if(carregando){
            return;
        }

        this.carregarFeeds();
    }

    atualizar = () =>{
        this.setState({atualizando: true, feeds: [], proximaPagina: 1, nomeFamilia: null, familiaEscolhida: null},

            ()=>{
               this.carregarFeeds();
            });
    }

    mostrarFeed = (feed) => {
        return(
            <FeedCard feed={feed} navegador={this.props.navigation} />
        );
    }
    atualizarNome = (nome) =>{
        this.setState({
            nomeFamilia: nome
        })
    }
    mostrarBarraPesquisa = () => {
        const {nomeFamilia} = this.setState;
        return(
            <>
                <LinhaTop>
                    <BarraPesquisa onChangeText={(nome) => {this.atualizarNome(nome)} }
                    value = {nomeFamilia}></BarraPesquisa>
                    <Icon style={{padding:10}} size={25}
                    name="search1" color ="white"
                    onPress={
                        () => {
                            this.setState({
                                proximaPagina: 1,
                                feeds: []
                            }, () =>{
                                this.carregarFeeds();
                            });

                        }
                    }></Icon>

                </LinhaTop>
            </>
        );
    }

    mostrarMenu = () =>{
        this.menu.openDrawer();

    }
    filtrarPorFamlilia = (familia) => {
        this.setState({
            familiaEscolhida: familia,
            proximaPagina: 1,
            feeds: []
        }, () => {
            this.carregarFeeds();
        })
        this.menu.closeDrawer();
    }

    mostrarFeeds = (feeds) =>{
        const {atualizando} = this.state;

        return(
          <DrawerLayout
                drawerWidth = {250}
                drawerPosition= {DrawerLayout.positions.Left}
                ref = {drawerElement =>{
                this.menu = drawerElement
             }}

                renderNavigationView ={() => <Menu filtragem = {this.filtrarPorFamlilia}/>} 
          >
                <Header
                    leftComponent={
                       <MenuTop>
                       <Icon size={28} color ="white" name="menuunfold" onPress={()=>{
                           this.mostrarMenu();
                       }}/>
                       </MenuTop>
                    }

                    centerComponent={
                        this.mostrarBarraPesquisa()

                    }

                    rightComponent={
                        <></>
                    }
                    containerStyle={Cabecalho}
                ></Header>

                <FlatList
                    data = {feeds}

                    numColumns = {2}

                    onEndReached={() => this.carregarMaisFeeds()}
                    onEndReachedThreshold = {0.1}

                    onRefresh = {() => this.atualizar()}
                    refreshing= {atualizando}

                    keyExtractor = {(item)=> String(item._id)}
                    renderItem={({item}) => {
                        return(
                            <View style = {{ width: '50%'}}>
                                {this.mostrarFeed(item)}
                            </View>
                        )
                    }}


                >
                </FlatList>
            </DrawerLayout>
        );
    }
    mostrarBotaoAtualizar = () => {
        return(
            <ContededorMensagem>
                <Mensagem>Um dos nossos serviços não está funcionando :(</Mensagem>
                <Mensagem>Tente novamente mais tarde!</Mensagem>
                <Espacador/>
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
                    onPress={() =>{
                        this.carregarFeeds();
                    }}
                />
            </ContededorMensagem>
        );
    }

    mostrarMensagensCarregando = () => {
        return (
            <ContededorMensagem>
            <Mensagem>Carregando feeds, aguarde!</Mensagem>
        </ContededorMensagem>
        );
    }
    render = () =>{

        const  { feeds, podeVerFeeds } = this.state;
        if(podeVerFeeds){
            if(feeds.length){
                return (
                this.mostrarFeeds(feeds)
                );

            }else{
                return (this.mostrarMensagensCarregando());
            }
        }else{
            return(this.mostrarBotaoAtualizar());
        }
    }
}