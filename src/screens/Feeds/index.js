import React from "react";
import { View, FlatList} from "react-native";
import feedsEstaticos from "../../assets/dicionarios/feeds.json";
import FeedCard from "../../components/FeedCard";
import { Header} from "react-native-elements";
import { BarraPesquisa, MenuTop, LinhaTop, Cabecalho } from "../../assets/styles.js";
import Icon from "react-native-vector-icons/AntDesign";
import Menu from "../../components/Menu/index.js";
import  DrawerLayout from "react-native-gesture-handler/DrawerLayout";



const FEEDS_POR_PAGINAS = 4;
export default class Feeds extends React.Component{

    constructor(props){
        super(props);

        this.filtrarPorFamlilia = this.filtrarPorFamlilia.bind(this);
       

        this.state = {
            proximaPagina: 0,
            feeds: [],
            carregando: false,
            atualizando: false,
            nomeFamilia: null,
            familiaEscolhida: null
        }
    }

    carregarFeeds = () => {

        const { proximaPagina, feeds, nomeFamilia, familiaEscolhida } = this.state;

        this.setState({
            carregando: true
        });

        if(familiaEscolhida){
            const maisFeeds = feedsEstaticos.feeds.filter((feed)=> 
            feed.assinatura._id == familiaEscolhida._id || feed.assinatura._id2 == familiaEscolhida._id);

            this.setState({
                feeds: maisFeeds,
                atualizando: false,
                carregando: false
            });

        } else if(nomeFamilia){
            const maisFeeds = feedsEstaticos.feeds.filter((feed)=> 
            feed.familia.name.toLocaleLowerCase().includes(nomeFamilia.toLocaleLowerCase()));

            this.setState({
                feeds: maisFeeds,
                atualizando: false,
                carregando: false
            });
        }else{

        
        

        const idInicial = proximaPagina * FEEDS_POR_PAGINAS +1;
        const idFinal = idInicial + FEEDS_POR_PAGINAS -1;
        const maisFeeds = feedsEstaticos.feeds.filter((feed)=> feed._id >=idInicial &&
       feed._id <= idFinal );

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
        this.setState({atualizando: true, feeds: [], proximaPagina: 0, nomeFamilia: null, familiaEscolhida: null},
            
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
                            this.carregarFeeds()
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
            familiaEscolhida: familia
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
    render = () =>{

        const  { feeds } = this.state;
        if(feeds.length){

        
            return (
            this.mostrarFeeds(feeds)
            );

        }else{
            return(
                <View></View>
            );
        }
    }
}
 
 