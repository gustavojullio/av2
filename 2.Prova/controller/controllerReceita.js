const receitas = require('../model/receitaMongo.js')

exports.cria_get = async function (req, res) {
    contexto = {
        titulo_pagina: "Criação de Receita",
    }
    res.render('criaReceita', contexto);
}

exports.cria_post = async function (req, res) {
    var receita = req.body;
    receita.id = Number(receita.id);
    receita.tempo = Number(receita.tempo);

    await receitas.cria(receita);
    res.redirect('/');
}

exports.consulta = async function (req, res) {
    var id = Number(req.params.id_receita);
    var receita = await receitas.consulta(id)

    await receitas.atualiza(receita);
    contexto = {
        titulo_pagina: "Consulta a Receita",
        receita: receita,
    }
    res.render('consultaReceita', contexto);
}

exports.altera_get = async function (req, res) {
    var id = Number(req.params.id_receita);
    var receita = await receitas.consulta(id);

    contexto = {
        titulo_pagina: "Altera a Receita",
        receita: receita,
    }
    res.render('alteraReceita', contexto);
}
exports.altera_post = async function (req, res) {
    var receita = req.body
    receita.id = Number(receita.id);
    receita.tempo = Number(receita.tempo);
    await receitas.atualiza(receita)

    res.redirect('/')
}

exports.deleta = async function (req, res) {
    var id = Number(req.params.id_receita);
    await receitas.deleta(id);

    res.redirect('/');
}

