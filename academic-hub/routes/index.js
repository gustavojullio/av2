// academic-hub/routes/index.js
const express = require('express');
const router = express.Router();

// Se o usuário estiver logado, vai para os eventos, senão, para a página de login
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/events');
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;