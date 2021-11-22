import React, { Component } from "react";
import { Share } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { displayName as nomeApp } from "../../../app.json";

export default class Compartilhador extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feed: this.props.feed
        }

    }
    compartilhar = () => {
        const { feed } = this.state

        const mensagem = feed.familia.url + "\n\n Enviado por " + nomeApp +
            "\n Baixe agora: http://play.google.com/store ";

        const resultado = Share.share({
            title: feed.familia.name,
            message: mensagem
        })
    }

    render = () => {

        return (
            <Icon color="white" size={28} name="sharealt" onPress={() => {
                this.compartilhar();
            }} />
        );
    }

}