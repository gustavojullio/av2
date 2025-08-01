var express = require('express');
var router = express.Router();
var controllerReceita = require('../controller/controllerReceita.js')

//criar
router.get('/cria', controllerReceita.cria_get);
router.post('/cria', controllerReceita.cria_post);

//consultar
router.get('/consulta/:id_receita', controllerReceita.consulta);

//alterar
router.get('/altera/:id_receita', controllerReceita.altera_get);
router.post('/altera/:id_receita', controllerReceita.altera_post);

//deletar
router.get('/deleta/:id_receita', controllerReceita.deleta);

module.exports = router;