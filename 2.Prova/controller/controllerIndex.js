const receitas = require('../model/receitaMongo.js')

exports.tela_principal = async function (req, res) {

    contexto = {
        titulo_pagina: "Gerenciador de Receitas Culinárias",
        receitas: await receitas.lista(),
    }

    res.render('index', contexto);
}

exports.sobre = async function (req, res) {
    contexto = {
        titulo_pagina: "Sobre a Aplicação",
    }
    // renderiza o arquivo na dentro da pasta view
    res.render('sobre', contexto);
}

exports.tempo = async function(req, res) {
     const receitasAte30 = await receitas.buscaPorFaixa("ate30");
    const receitas31a60 = await receitas.buscaPorFaixa("31a60");
    const receitasMais60 = await receitas.buscaPorFaixa("mais60");

    res.render('receitaTempo', {
        titulo_pagina: "Minhas Receitas",
        receitasAte30,
        receitas31a60,
        receitasMais60
    });
}
