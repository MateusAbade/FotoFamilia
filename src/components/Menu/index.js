import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { NomeFamilia, ContenedorMenu, DivisorMenu, Espacador, Titulo, EspacoEsquerda } from "../../assets/styles"
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { LoginOptionsMenu } from "../Login";
import Toast from "react-native-simple-toast";
import { getDescendencia } from "../../api";

export default class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filtrar: props.filtragem,
            atualizar: true,
            descendencia: []
        }
    }
    componentDidMount = () => {
        getDescendencia().then((maisDescendencia) => {
            console.log("adicionando " + maisDescendencia + " descendencia")
            this.setState({
                descendencia: maisDescendencia
            });
        }).catch((erro) => {
            console.error("ocorreu um erro criando um menu de descendencia: " + erro);
        })
    }

    mostrarFamilias = (descendencia) => {
        const { filtrar } = this.state;

        return (
            <TouchableOpacity onPress={() => {
                filtrar(descendencia)
            }}>
                <DivisorMenu />
                <EspacoEsquerda>
                    <NomeFamilia>
                        <Titulo>Familia: </Titulo>{descendencia.assinaturas}
                    </NomeFamilia>
                </EspacoEsquerda>
                <Espacador></Espacador>
            </TouchableOpacity>

        );
    }
    onLogin = (usuario) => {
        this.setState({
            atualizar: true
        }, () => {
            Toast.show("Login efetuado com sucesso com a conta " + usuario.signer,
                Toast.LONG);
        })
    }


    onLogout = (signer) => {
        this.setState({
            atualizar: true
        }, () => {
            Toast.show("Você foi desconectado da conta " + signer);
        })
    }
    render = () => {
        const { descendencia } = this.state;

        return (
            <SafeAreaInsetsContext.Consumer>
                {insets =>
                    <ScrollView style={{ paddingTop: insets.top }}>
                        <LoginOptionsMenu onLogin={this.onLogin} onLogout={this.onLogout} />
                        <ContenedorMenu>
                            {descendencia.map((des) => this.mostrarFamilias(des))}
                        </ContenedorMenu>
                    </ScrollView>
                }
            </SafeAreaInsetsContext.Consumer>
        );
    }


}