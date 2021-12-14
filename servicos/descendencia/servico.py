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

def gerar_descendencia(registro):

    descendencia = {

        "_id": registro["id"],
        "assinaturas": registro["assinatura"]

    }

    return descendencia

@servico.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)

@servico.route("/descendencia")
def get_descendencia():
    descendencia = []

    conexao = get_conexao_bd()
    cursor =conexao.cursor( dictionary= True)
    cursor.execute("SELECT id, assinatura FROM descendencia")
    resultado = cursor.fetchall()
    for registro in resultado:
        descendencia.append(gerar_descendencia(registro))
    return jsonify(descendencia)


if __name__ == "__main__":
    servico.run(
        host= "0.0.0.0",
        debug=DEBUG
    )