import SyncStorage from "sync-storage"

const FEEDS_URL = "http://192.168.79.9:5001/"
const DESCENDENCIA_URL = "http://192.168.79.9:5002/"
const IMAGENS_URL = "http://192.168.79.9:5006/"
const LIKES_URL = "http://192.168.79.9:5004/"
const COMENTARIOS_URL = "http://192.168.79.9:5003/"

export const acessarURL = async (url) =>{
    let promise = null;

    console.log(url)

    try {
        resposta = await fetch(url, { method: "GET" });

        if (resposta.ok) {
            promise = Promise.resolve(resposta.json());
        } else {
            promise = Promise.reject(resposta);
        }
    } catch (erro) {

        promise = Promise.reject(erro)
    }

    return promise;
}

export const getFeeds = async (pagina) =>{
    return acessarURL(FEEDS_URL + "feeds/" + pagina)
}
export const getFeed = async (feedId) =>{
    return acessarURL(FEEDS_URL + "feed/" + feedId)
}
export const getFeedsPorFamilia = async (nomeFamilia, pagina) =>{
    return acessarURL(FEEDS_URL + "feeds_por_familia/" + nomeFamilia +"/"+ pagina)
}
export const getFeedsPorDescendencia = async (idDescendencia , pagina) =>{
    return acessarURL(FEEDS_URL + "feeds_por_descendencia/" + idDescendencia +"/"+ pagina)
}
export const getDescendencia = async () =>{
    return acessarURL(DESCENDENCIA_URL + "descendencia")
}
export const usuarioGostou = async (feedId) =>{
    let promise = null;
    const usuario = SyncStorage.get("user");
    if(usuario){
        promise = acessarURL(LIKES_URL + "gostou/" +usuario.account+"/"+ feedId)
    }

    return promise
}
export const gostar = async (feedId) =>{
    let promise = null;
    const usuario = SyncStorage.get("user");
    if(usuario){
        promise = acessarURL(LIKES_URL + "gostar/" +usuario.account+"/"+ feedId)
    }

    return promise
}
export const desgostar = async (feedId) =>{
    let promise = null;
    const usuario = SyncStorage.get("user");
    if(usuario){
        promise = acessarURL(LIKES_URL + "desgostar/" +usuario.account+"/"+ feedId)
    }

    return promise
}

export const getComentarios = async (feedId, pagina) =>{
    return  acessarURL(COMENTARIOS_URL + "comentarios/" + feedId + "/" + pagina)

}
export const adicionarComentario = async (feedId, comentario) =>{
    let promise = null;
    const usuario = SyncStorage.get("user");
    if(usuario){
        promise = acessarURL(COMENTARIOS_URL + "adicionar/" + feedId+"/"+usuario.name+"/"+usuario.account+"/"+comentario)
    }

    return promise
}
export const removerComentario = async (comentarioId) =>{
    return acessarURL(COMENTARIOS_URL + "remover/" +comentarioId)

}
export const getImagem = (imagem) =>{
    return {uri: IMAGENS_URL + imagem}
}

export const feedAlive = async () =>{
    return acessarURL(FEEDS_URL + "isalive")
}
export const descendenciaAlive = async () =>{
    return acessarURL(DESCENDENCIA_URL + "isalive")
}
export const likesAlive = async () =>{
    return acessarURL(LIKES_URL + "isalive")
}
export const comentariosAlive = async () =>{
    return acessarURL(COMENTARIOS_URL + "isalive")
}