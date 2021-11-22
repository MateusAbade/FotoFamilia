import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import FamiliasEstaticas from "../../assets/dicionarios/familias.json";
import { NomeFamilia, ContenedorMenu, DivisorMenu, Espacador, Titulo, EspacoEsquerda } from "../../assets/styles"
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { LoginOptionsMenu } from "../Login";
import Toast from "react-native-simple-toast";

export default class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filtrar: props.filtragem,
            atualizar: true
        }
    }

    mostrarFamilias = (familia) => {
        const { filtrar } = this.state;

        return (
            <TouchableOpacity onPress={() => {
                filtrar(familia)
            }}>
                <DivisorMenu />
                <EspacoEsquerda>
                    <NomeFamilia>
                        <Titulo>Familia: </Titulo>{familia.name}
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
        const familias = FamiliasEstaticas.familias;

        return (
            <SafeAreaInsetsContext.Consumer>
                {insets =>
                    <ScrollView style={{ paddingTop: insets.top }}>
                        <LoginOptionsMenu onLogin={this.onLogin} onLogout={this.onLogout} />
                        <ContenedorMenu>
                            {familias.map((familia) => this.mostrarFamilias(familia))}
                        </ContenedorMenu>
                    </ScrollView>
                }
            </SafeAreaInsetsContext.Consumer>
        );
    }


}