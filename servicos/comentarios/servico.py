from flask import Flask, jsonify
import mysql.connector as mysql

servico = Flask(__name__)

IS_ALIVE = "yes"
DEBUG = True
TAMANHO_PAGINA = 4

MYSQL_SERVER = "bancodados"
MYSQL_USER = "root"
MYSQL_PASS = "admin"
MYSQL_BANCO = "fotoFamiliabd"


def get_conexao_bd():
    conexao =  mysql.connect(
        host=MYSQL_SERVER, user = MYSQL_USER, password = MYSQL_PASS, database = MYSQL_BANCO
    )
    return conexao

def gerar_comentario(registro):
    comentario = {
        "_id": registro["id"],
        "feed": registro["feed"],
        "user": {
            "account": registro["conta"],
            "name": registro["nome"]
        },
        "datetime": registro["data"],
        "content": registro["comentario"]
    }
    return comentario

@servico.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)

@servico.route("/comentarios/<int:feed_id>/<int:pagina>")
def get_comentarios(feed_id, pagina):
    comentarios = []

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary= True)
    cursor.execute(
        "SELECT id, feed , comentario, nome, conta, DATE_FORMAT(data, '%Y-%m-%d %T') as data FROM"+
        " comentarios WHERE feed = "+ str(feed_id)+" ORDER BY data desc limit "+ str((pagina - 1)* TAMANHO_PAGINA)+ ", "+ str(TAMANHO_PAGINA)
    )
    resultado=cursor.fetchall()
    for registro in resultado:
        comentarios.append(gerar_comentario(registro))

    return jsonify(comentarios)


@servico.route("/adicionar/<int:feed_id>/<string:nome>/<string:conta>/<string:comentario>")
def adicionar(feed_id, nome, conta, comentario):
    resultado=jsonify(situacao = "ok", erro = "")

    conexao= get_conexao_bd()
    cursor = conexao.cursor()
    try:
      cursor.execute("INSERT INTO comentarios(feed, nome, conta, comentario, data) "+
                     f"values ({feed_id},'{nome}', '{conta}', '{comentario}', NOW())"

      )
      conexao.commit()
    except:
        conexao.rollback()
        resultado=jsonify(situacao = "erro", erro = "adicionando comentário")

    return resultado

@servico.route("/remover/<int:comentario_id>")
def remover(comentario_id):
    resultado=jsonify(situacao = "ok", erro = "")

    conexao= get_conexao_bd()
    cursor = conexao.cursor()
    try:
      cursor.execute(f"DELETE FROM comentarios WHERE id =  {comentario_id}"
      )
      conexao.commit()
    except:
        conexao.rollback()
        resultado=jsonify(situacao = "erro", erro = "removendo comentário")

    return resultado



if __name__ == "__main__":
    servico.run(
        host= "0.0.0.0",
        debug=DEBUG
    )