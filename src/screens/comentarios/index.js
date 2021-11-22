import React from 'react';
import { FlatList, Text, Modal, TextInput, Alert } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/AntDesign";
import Swipeable from "react-native-swipeable-row";
import SyncStorage from 'sync-storage';
import Moment from 'react-moment';
import "moment-timezone"
import { MenuNomeFamilia,Cabecalho, EspacoDireita,
AutorComentario, ContededorComentarios, ContededorComentarioDeOutroUsuario,
ContededorComentarioDoUsuario, ContededorNovoComentario, Comentario,
DataComentario, EspacadorComentario, LinhaTop, Espacador, 
DivisorComentario, EspacoBottom, EspacoEsquerda, button } from '../../assets/styles';
import comentariosEstaticos from "../../assets/dicionarios/comentarios.json";
import { View } from 'react-native';





const COMENTARIOS_POR_PAGINA = 5;
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
            proximaPagina: 0,
            telaAdicaoVisivel: false,
            textoNovoComentario: ""
        }
    }

    carregarComentarios = () => {
        const { feedId, comentarios, proximaPagina} = this.state;
       
        this.setState({
            carregando: true
        });


        const idInicial = proximaPagina * COMENTARIOS_POR_PAGINA + 1;
        const idFinal = idInicial  + COMENTARIOS_POR_PAGINA - 1;
        
        const maisComentarios = comentariosEstaticos.comentarios.filter((comentario)=>
        comentario._id >= idInicial && comentario._id <= idFinal && comentario.feed === feedId);

        if(maisComentarios.length){
            this.setState({
                proximaPagina: proximaPagina + 1,
                comentarios:[...comentarios, ...maisComentarios],
                atualizando: false,
                carregando: false
            })
        }else{
            this.setState({
                atualizando: false,
                carregando: false
            })
        }
  
    }

    componentDidMount = () => {
        this.carregarComentarios();
       
    }

    carregarMaisComentarios = () => {
       const {carregando }= this.state;
        
       if(carregando){
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
                        <View style={{ marginTop:35, marginLeft: 10 }}>
                            <Icon name="delete" color="#FF4500" size={28}
                                onPress={() => {
                                    this.confirmarRemocao(comentario);
                                }}/>
                        </View>
                        ]
                    }>
                
                <ContededorComentarioDoUsuario>
                    <EspacoEsquerda>
                    <AutorComentario>{"você: "}</AutorComentario>
                    <Comentario>{comentario.content}</Comentario>
                    <DataComentario>
                        <Moment element={Text} parse = "YYYY-MM-DD HH:mm"
                        format="DD/MM/YYYY HH:mm">
                            {comentario.datetime}
                        </Moment>
                    </DataComentario>
                    </EspacoEsquerda>
                </ContededorComentarioDoUsuario>
                </Swipeable>
                <EspacadorComentario/>
            </>
        );
    }
    removerComentario = (comentariosR) => {
        const { comentarios } = this.state;

        const comentariosFiltrados = comentarios.filter((comentario) => {
            comentario._id !== comentariosR._id
        });

        this.setState({
            comentarios: comentariosFiltrados
        }, () => {
            this.atualizar()
        });
    }

    confirmarRemocao = (comentario) => {
        Alert.alert(
            null,
            "Deseja remover o seu comentário?",
            [
                { text: "NÃO", style: 'cancel' },
                { text: "SIM", onPress: () => this.removerComentario(comentario)}
            ]
        )
    }

    mostrarComentarioDeOutroUsuario = (comentario) => {
        
        return(
            <>
                <ContededorComentarioDeOutroUsuario>
                    <AutorComentario>{comentario.user.name}</AutorComentario>
                    <Comentario>{comentario.content}</Comentario>
                    <DataComentario>
                        <Moment element={Text} parse = "YYYY-MM-DD HH:mm"
                        format="DD/MM/YYYY HH:mm">
                            {comentario.datetime}
                        </Moment>
                    </DataComentario>
                </ContededorComentarioDeOutroUsuario>
            <EspacadorComentario/>
            </>
        );
    }

    atualizar = () => {
        this.setState({ atualizando: true, carregando: false, proximaPagina: 0,
            comentarios: [] }, () => {
                this.carregarComentarios();
            });
    }
    adicionarComentario = () =>{
        const { feedId, comentarios, textoNovoComentario} = this.state;
        const usuario = SyncStorage.get("user");
        const comentario = [
            {
                "_id": comentarios.length + 100,
                "feed": feedId,
                "user": {
                    "userId":2,
                    "email": usuario.email,
                    "name": usuario.name
                },
                "datetime": "2021-11-20T17:47-0500",
                "content": textoNovoComentario
            }
        ];

        this.setState({
            comentarios: [...comentario, ...comentarios]
        });
        this.mudarVisibilidadeTelaAcao();
    }   

    atualizarTextoNovoComentario = (texto) =>{
        this.setState({
            textoNovoComentario: texto
        });
    }
                               

    mudarVisibilidadeTelaAcao = () =>{
        const {telaAdicaoVisivel} = this.state;

        this.setState({
            telaAdicaoVisivel : ! telaAdicaoVisivel
        })
    }

    mostrarTelaAdicaoComentario = ()=>{
        return(
            <Modal animationType="slide"
                transparent={true}

                onRequestClose={
                    () =>{
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
                    <DivisorComentario/>    
                    
                    <LinhaTop>
                        
                            <Button 
                                buttonStyle={button}
                                icon={
                                    <Icon
                                        name={"check"}
                                        size={22}
                                        color="#fff"/>
                                }
                                title="Gravar"
                                type="solid"

                                onPress={
                                    () => {
                                        this.adicionarComentario();
                                    }
                                }
                            />
                            <Espacador/>
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
                    <EspacoBottom/>
                </ContededorNovoComentario>
            </Modal>
        );
    }
    

    mostrarComentarios = () => {
        const { familia, comentarios, atualizando } = this.state;
        const usuario = SyncStorage.get("user");

        return(
            <>
                <Header 
                    leftComponent={
                        <Icon name="left" color ="white" size={28} onPress={() => {
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
                        <Icon name="pluscircleo" size={28} color ="white" onPress={
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
                            data = {comentarios}

                            onEndReached = { () => {this.carregarMaisComentarios();} }
                            onEndReachedThreshold = { 0.1 }

                            onRefresh = { () => {this.atualizar();} }
                            refreshing = { atualizando }

                            keyExtractor = { (item) => String(item._id) }
                            renderItem = { ({item}) => {
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

    render = () => {
        const { comentarios, telaAdicaoVisivel } = this.state;

        if (comentarios) {
            return(
                <>
                    {this.mostrarComentarios()}
                    {telaAdicaoVisivel && this.mostrarTelaAdicaoComentario()}
                </>
            );
        } else {
            return null;
        }
    }



}
 
