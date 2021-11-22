import styled from "styled-components/native";

export const Cabecalho = {
    backgroundColor: '#FF4500',
    justifyContent: 'space-evenly',
    borderBottomWidth: 0
}
export const Titulo = styled.Text`
    font-size: 16px;
    color: #000000;
    font-weight: bold;
`;

export const NomeFamilia = styled.Text`
    font-size: 16px;
    color: #000000;
    
`;

export const DescricaoFamilia = styled.Text`
    font-size: 14px;
    color: #59594a;
`;
export const Likes = styled.Text`
    font-size: 14px;
    color: #59594a;
`;
export const MenuNomeFamilia = styled.Text`
    color: #fff;
    font-size: 20px;
`;
export const EsquerdaDaMesmaLinha = styled.View`
    flexDirection: row;
    justify-content: flex-start;
    align-items: flex-start;
    
`;
export const CaixaDetalhes= styled.View`
    felxDirection: column;
    width: 100%;
    marginLeft: 8px;
    
`;
export const EspacoEsquerda= styled.View`
    marginLeft: 15px;
`;
export const EspacoDireita= styled.View`
    marginRight: 15px;
`;
export const EspacoBottom= styled.View`
    marginBottom: 8px;
`;
export const BarraPesquisa = styled.TextInput`
    height: 40px;
    width: 100%;
    background-color: #fff;
    border-color: #c7c7c7;
    border-width: 1px;
    border-radius: 8px;
`;
export const LinhaTop = styled.View`
    flexDirection: row;
    justify-content: center;
    align-items: center;
    
`;

export const ContenedorMenu = styled.View`
    flex: 1;
    font-size: 18px;
    background-color: #fff;


`;
export const Espacador = styled.View`
    flexDirection: row;
    margin: 20px;

`;
export const MenuTop = styled.View`
    flexDirection: row;
    margin-top: 8px;

`;

export const DivisorMenu = styled.View`
    marginVertical: 5px;
    marginHorizontal: 5px;
    border-bottom-width: 1px;
    borderColor: #FF4500;
`;

export const DivisorComentario = styled.View`
    marginVertical: 5px;
    marginHorizontal: 5px;
    border-bottom-width: 1px;
    border-color: #FF4500;
`;
export const ContededorComentarios = styled.View`
    felxDirection: column;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;

`;
export const ContededorComentarioDoUsuario = styled.View`
    background-color: #ffefdb;
`;
export const ContededorComentarioDeOutroUsuario = styled.View`
    background-color: #eff2f1;
    margin-top: 10px;
    margin-left: 10px;

    
`;
export const EspacadorComentario = styled.View`
    marginVertical: 10px;
`;
export const ContededorNovoComentario = styled.View`
    margin-top: 100px;
    align-self: center;
    width: 95%;
    border-color: #7ca982;
    border-width: 1px;
    border-radius: 6px;
    background-color: #fffcf9;

`;
export const AutorComentario = styled.Text`
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 20px;
    color: #000000;
`;
export const Comentario = styled.Text`
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 16px;
    color: #283044;
`;
export const DataComentario = styled.Text`
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 16px;
    color: #283044;
`;
export const button= {
      backgroundColor: '#FF4500',
      width: 100,
      borderRadius: 15       
   }

   export const buttonGoogle= {
    backgroundColor: '#db4a39',     
 }