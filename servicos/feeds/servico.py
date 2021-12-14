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

def gerar_feed(registro):
    feed = {
        "_id": registro["feed_id"],
        "datetime": registro["data"],
        "descendencia": {
                "assinatura": registro["nome_assinatura"],
        },
        "likes": registro["likes"],
        "familia":{
                "name": registro["nome_familia"],
                "description": registro["descricao_familia"],
                "blobs": [
                    {
                        "type": "image",
                        "file": registro["imagem1"]
                    },
                    {
                        "type": "image",
                        "file": registro["imagem2"]
                    },
                    {
                        "type": "image",
                        "file": registro["imagem3"]
                    }
                ]
        }
    }
    return feed

def get_total_likes(feed_id):
    likes = 0

    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(f"select count(*) as num_likes from likes where feed = {feed_id}")
    resultado = cursor.fetchone()
    if resultado:
        likes = resultado["num_likes"]
    return likes

@servico.route("/isalive")
def is_alive():
    return jsonify(alive=IS_ALIVE)


@servico.route("/feeds/<int:pagina>")
def get_feeds(pagina):
    feeds = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary= True)
    cursor.execute("SELECT GROUP_CONCAT(fa.nome SEPARATOR ' e ') as  nome_familia,  GROUP_CONCAT(d.assinatura SEPARATOR ' e ') "+
                   "as nome_assinatura, f.id as feed_id, DATE_FORMAT(f.data, '%Y-%m-%d T') as data, f.descricao as descricao_familia, "+
                   "i.imagem1, IFNULL(i.imagem2, '') as imagem2, IFNULL(i.imagem3, '') as imagem3 FROM descendencia d JOIN "+
                   "familias fa ON d.id=fa.descendencia JOIN feeds f ON f.id=fa.feed JOIN  imagens i ON i.id=f.imagem GROUP BY fa.feed limit " + str((pagina - 1) * TAMANHO_PAGINA) + ", " + str(TAMANHO_PAGINA))
    resultado = cursor.fetchall()
    for registro in resultado:
        registro["likes"] = get_total_likes(registro["feed_id"])
        feeds.append(gerar_feed(registro))

    return jsonify(feeds)

@servico.route("/feed/<int:feed_id>")
def get_feed(feed_id):
    feed = {}
    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary= True)
    cursor.execute("SELECT GROUP_CONCAT(fa.nome SEPARATOR ' e ') as  nome_familia,  GROUP_CONCAT(d.assinatura SEPARATOR ' e ') "+
                   "as nome_assinatura, f.id as feed_id, DATE_FORMAT(f.data, '%Y-%m-%d T') as data, f.descricao as descricao_familia, "+
                   "i.imagem1, IFNULL(i.imagem2, '') as imagem2, IFNULL(i.imagem3, '') as imagem3 FROM descendencia d JOIN "+
                   "familias fa ON d.id=fa.descendencia JOIN feeds f ON f.id=fa.feed JOIN  imagens i ON i.id=f.imagem WHERE f.id in (SELECT feed FROM familias fam WHERE fam.feed="+str(feed_id)+") GROUP BY fa.feed")
    registro = cursor.fetchone()
    if registro:
        registro["likes"] = get_total_likes(registro["feed_id"])
        feed = gerar_feed(registro)

    return jsonify(feed)


@servico.route("/feeds_por_familia/<string:nome_familia>/<int:pagina>")
def get_feeds_por_familia(nome_familia, pagina):
    feeds = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary= True)
    cursor.execute("SELECT GROUP_CONCAT(fa.nome SEPARATOR ' e ') as  nome_familia,  GROUP_CONCAT(d.assinatura SEPARATOR ' e ') "+
                "as nome_assinatura, f.id as feed_id, DATE_FORMAT(f.data, '%Y-%m-%d T') as data, f.descricao as descricao_familia, "+
                "i.imagem1, IFNULL(i.imagem2, '') as imagem2, IFNULL(i.imagem3, '') as imagem3 FROM descendencia d JOIN "+
                "familias fa ON d.id=fa.descendencia JOIN feeds f ON f.id=fa.feed JOIN  imagens i ON i.id=f.imagem WHERE f.id in "+
                "(SELECT feed FROM familias WHERE familias.nome LIKE '%"+nome_familia+"%') GROUP BY fa.feed limit " + str((pagina - 1) * TAMANHO_PAGINA) + ", " + str(TAMANHO_PAGINA))
    resultado = cursor.fetchall()
    for registro in resultado:
        registro["likes"] = get_total_likes(registro["feed_id"])
        feeds.append(gerar_feed(registro))

    return jsonify(feeds)

@servico.route("/feeds_por_descendencia/<int:id_descendencia>/<int:pagina>")
def get_feeds_por_descendencia(id_descendencia, pagina):
    feeds = []
    conexao = get_conexao_bd()
    cursor = conexao.cursor(dictionary= True)
    cursor.execute("SELECT GROUP_CONCAT(fa.nome SEPARATOR ' e ') as  nome_familia,  GROUP_CONCAT(d.assinatura SEPARATOR ' e ') "+
                   "as nome_assinatura, f.id as feed_id, DATE_FORMAT(f.data, '%Y-%m-%d T') as data, f.descricao as descricao_familia, "+
                   "i.imagem1, IFNULL(i.imagem2, '') as imagem2, IFNULL(i.imagem3, '') as imagem3 FROM descendencia d JOIN "+
                   "familias fa ON d.id=fa.descendencia JOIN feeds f ON f.id=fa.feed JOIN  imagens i ON i.id=f.imagem WHERE f.id in (SELECT feed FROM familias fam WHERE fam.descendencia="+str(id_descendencia)+") GROUP BY fa.feed limit " + str((pagina - 1) * TAMANHO_PAGINA) + ", " + str(TAMANHO_PAGINA))
    resultado = cursor.fetchall()
    for registro in resultado:
        registro["likes"] = get_total_likes(registro["feed_id"])
        feeds.append(gerar_feed(registro))

    return jsonify(feeds)


if __name__ == "__main__":
    servico.run(
        host= "0.0.0.0",
        debug=DEBUG
    )