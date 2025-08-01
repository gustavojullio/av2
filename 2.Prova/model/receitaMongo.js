const mongodb = require('mongodb')

const ClienteMongo = mongodb.MongoClient;
var cliente;

const conexao_bd = async () => {
    if (!cliente)
        cliente = await ClienteMongo.connect('mongodb://127.0.0.1:27017');
}

const bd = () => {
    return cliente.db('receitas');
}

class ReceitaMongo {
    async close() {
        if (cliente)
            cliente.close()
        cliente = undefined
    }

    async atualiza(receita) {
        await conexao_bd();
        const colecao = bd().collection("receitas")
        await colecao.updateOne(
            { id: receita.id },
            { $set: { titulo: receita.titulo, ingredientes: receita.ingredientes, modo: receita.modo, tempo: receita.tempo } }
        )
    }
    async buscaPorFaixa(qualFaixa) {
        await conexao_bd();
        const colecao = bd().collection("receitas");
        let condicao = {};

        if (qualFaixa === "ate30") {
            condicao = { tempo: { $lte: 30 } };
        } else if (qualFaixa === "31a60") {
            condicao = { tempo: { $gte: 31, $lte: 60 } };
        } else if (qualFaixa === "mais60") {
            condicao = { tempo: { $gt: 60 } };
        } else {
            throw new Error("Faixa inválida!");
        }

        const receitas = await colecao.find(condicao).toArray();
        return receitas;
}

    async cria(receita) {
        await conexao_bd()
        const colecao = bd().collection("receitas")
        await colecao.insertOne(receita)
    }
    async consulta(id) {
        await conexao_bd()
        const colecao = bd().collection("receitas")
        const receita = await colecao.findOne({ id: id })
        return receita
    }
    async deleta(id) {
        await conexao_bd()
        const colecao = bd().collection("receitas")
        const doc = await colecao.findOne({ id: id })
        if (!doc) {
            throw new Error(`Não existe a receita com id: ${id}`)
        } else {
            await colecao.findOneAndDelete({ id: id })
        }
    }

    async lista() {
        await conexao_bd();
        const colecao = bd().collection("receitas");
        var receitas = await colecao.find({}).toArray();
        
        return receitas
 }
    // async lista_ids() {
    //     await conexao_bd()
    //     const colecao = bd().collection("receitas")
    //     var ids = []
    //     await colecao.find({}, { projection: { _id: 0, id: 1 } }).forEach((receita) => {
    //         ids.push(receita.id)
    //     })
    //     return id
    // }
    // async qtd() {
    //     await conexao_bd()
    //     const colecao = bd().collection("notas")
    //     const qtd = await colecao.count({})
    //     return qtd
    // }
}
module.exports = new ReceitaMongo()